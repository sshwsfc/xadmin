from django.contrib.admin import helpers, actions as django_actions
from django.contrib.admin.templatetags.admin_static import static
from django.contrib.admin.util import model_format_dict
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.utils.datastructures import SortedDict
from django.utils.encoding import force_unicode
from django.utils.safestring import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext as _, ungettext
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView


def action_checkbox(obj):
    """
    A list_display column containing a checkbox widget.
    """
    return helpers.checkbox.render(helpers.ACTION_CHECKBOX_NAME, force_unicode(obj.pk))
action_checkbox.short_description = mark_safe('<input type="checkbox" id="action-toggle" />')
action_checkbox.allow_tags = True

class ActionPlugin(BaseAdminPlugin):
    # Templates for delet action, move it to delete action class later.
    delete_confirmation_template = None
    delete_selected_confirmation_template = None

    # Actions
    actions = []
    actions_selection_counter = True
    global_actions = {'delete_selected': django_actions.delete_selected}

    def init_request(self):
        self.actions = self.get_actions()
        self.admin_view.delete_confirmation_template = self.delete_confirmation_template
        self.admin_view.delete_selected_confirmation_template = self.delete_selected_confirmation_template

    def get_list_display(self, list_display):
        if self.actions:
            list_display.insert(0, 'action_checkbox')
            self.admin_view.action_checkbox = action_checkbox
        return list_display

    def get_context(self, context):
        if self.actions and self.admin_view.result_count:
            av = self.admin_view
            selection_note_all = ungettext('%(total_count)s selected',
                'All %(total_count)s selected', av.result_count)

            new_context = {
                'selection_note': _('0 of %(cnt)s selected') % {'cnt': len(av.result_list)},
                'selection_note_all': selection_note_all % {'total_count': av.result_count},
                'action_choices': self.get_action_choices(),
                'actions_selection_counter': self.actions_selection_counter,
            }
            context.update(new_context)
        return context

    def post_response(self, response, *args, **kwargs):
        request = self.admin_view.request
        av = self.admin_view
        # Actions with no confirmation
        if self.actions and 'action' in request.POST and '_save' not in request.POST:
            action = request.POST['action']

            if not self.actions.has_key(action):
                msg = _("Items must be selected in order to perform "
                        "actions on them. No items have been changed.")
                av.message_user(msg)
            else:
                func, name, description = self.actions[action]
                select_across = request.POST.get('select_across', False) == '1'
                selected = request.POST.getlist(helpers.ACTION_CHECKBOX_NAME)

                if not selected and not select_across:
                    # Reminder that something needs to be selected or nothing will happen
                    msg = _("Items must be selected in order to perform "
                            "actions on them. No items have been changed.")
                    av.message_user(msg)
                else:
                    queryset = av.list_queryset._clone()
                    if not select_across:
                        # Perform the action only on the selected objects
                        queryset = av.list_queryset.filter(pk__in=selected)
                    response = func(av, request, queryset)
                    # Actions may return an HttpResponse, which will be used as the
                    # response from the POST. If not, we'll be a good little HTTP
                    # citizen and redirect back to the changelist page.
                    if isinstance(response, HttpResponse):
                        return response
                    else:
                        return HttpResponseRedirect(request.get_full_path())
        return response

    def get_actions(self):
        """
        Return a dictionary mapping the names of all actions for this
        ModelAdmin to a tuple of (callable, name, description) for each action.
        """
        # If self.actions is explicitally set to None that means that we don't
        # want *any* actions enabled on this page.
        from django.contrib.admin.views.main import IS_POPUP_VAR
        if self.actions is None or IS_POPUP_VAR in self.request.GET:
            return SortedDict()

        actions = []

        # Gather actions from the admin site first
        for (name, func) in self.global_actions.iteritems():
            description = getattr(func, 'short_description', name.replace('_', ' '))
            actions.append((func, name, description))

        # Then gather them from the model admin and all parent classes,
        # starting with self and working back up.
        for klass in self.admin_view.__class__.mro()[::-1]:
            class_actions = getattr(klass, 'actions', [])
            # Avoid trying to iterate over None
            if not class_actions:
                continue
            actions.extend([self.get_action(action) for action in class_actions])

        # get_action might have returned None, so filter any of those out.
        actions = filter(None, actions)

        # Convert the actions into a SortedDict keyed by name.
        actions = SortedDict([
            (name, (func, name, desc))
            for func, name, desc in actions
        ])

        return actions

    def get_action_choices(self):
        """
        Return a list of choices for use in a form object.  Each choice is a
        tuple (name, description).
        """
        choices = []
        for func, name, description in self.actions.itervalues():
            choice = (name, description % model_format_dict(self.opts))
            choices.append(choice)
        return choices

    def get_action(self, action):
        """
        Return a given action from a parameter, which can either be a callable,
        or the name of a method on the ModelAdmin.  Return is a tuple of
        (callable, name, description).
        """
        # If the action is a callable, just use it.
        if callable(action):
            func = action
            action = action.__name__

        # Next, look for a method. Grab it off self.__class__ to get an unbound
        # method instead of a bound one; this ensures that the calling
        # conventions are the same for functions and methods.
        elif hasattr(self.admin_view.__class__, action):
            func = getattr(self.admin_view.__class__, action)

        # Finally, look for a named method on the admin site
        else:
            try:
                func = self.admin_site.get_action(action)
            except KeyError:
                return None

        if hasattr(func, 'short_description'):
            description = func.short_description
        else:
            description = capfirst(action.replace('_', ' '))
        return func, action, description

    # View Methods
    def result_header(self, item, field_name, row):
        if item.attr and field_name == 'action_checkbox':
            item.classes.append("action-checkbox-column")
        return item

    def result_item(self, item, obj, field_name, row):
        if item.field is None and field_name == u'action_checkbox':
            item.classes.append("action-checkbox")
        return item

    # Media
    def get_media(self, media):
        if self.actions and self.admin_view.result_count:
            media.add_js([static('exadmin/js/actions.js'), reverse('admin:jsi18n')])
        return media

    # Block Views
    def block_results_bottom(self, context, nodes):
        if self.actions and self.admin_view.result_count:
            nodes.append(loader.render_to_string('admin/actions.html', context_instance=context))


site.register_plugin(ActionPlugin, ListAdminView)

