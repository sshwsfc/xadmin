from django.contrib.admin.templatetags.admin_static import static
from django.template import loader
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext_lazy as _
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.contrib.contenttypes.models import ContentType
from django.db import transaction

from exadmin.sites import site
from exadmin.views import ModelAdminView, BaseAdminPlugin, ListAdminView
from exadmin.views.list import COL_LIST_VAR, ORDER_VAR
from exadmin.filters import FILTER_PREFIX, SEARCH_VAR

from exadmin.models import Bookmark

csrf_protect_m = method_decorator(csrf_protect)

class BookmarkPlugin(BaseAdminPlugin):

    # [{'title': "Female", 'query': {'gender': True}, 'order': ('-age'), 'cols': ('first_name', 'age', 'phones'), 'search': 'Tom'}]
    list_bookmarks = []
    show_bookmarks = True

    def get_context(self, context):
        if not self.show_bookmarks:
            return context

        bookmarks = []

        current_qs = '&'.join(['%s=%s' % (k,v) for k,v in sorted(\
            filter(lambda i: bool(i[1] and (i[0] in (COL_LIST_VAR, ORDER_VAR, SEARCH_VAR) or i[0].startswith(FILTER_PREFIX))), \
            self.request.GET.items()))])

        model_info = (self.opts.app_label, self.opts.module_name)
        has_selected = False
        menu_title = _(u"Bookmark")
        list_base_url = reverse('admin:%s_%s_changelist' % model_info, current_app=self.admin_site.name)

        # local bookmarks
        for bk in self.list_bookmarks:
            title = bk['title']
            params = dict([(FILTER_PREFIX + k, v) for (k,v) in bk['query'].items()])
            if bk.has_key('order'):
                params[ORDER_VAR] = '.'.join(bk['order'])
            if bk.has_key('cols'):
                params[COL_LIST_VAR] = '.'.join(bk['cols'])
            if bk.has_key('search'):
                params[SEARCH_VAR] = bk['search']
            bk_qs = '&'.join(['%s=%s' % (k,v) for k,v in sorted(filter(lambda i: bool(i[1]), params.items()))])

            url = list_base_url + '?' + bk_qs
            selected = (current_qs == bk_qs)

            bookmarks.append({'title': title, 'selected': selected, 'url': url})
            if selected:
                menu_title = title
                has_selected = True

        content_type = ContentType.objects.get_for_model(self.model)
        bk_model_info = (Bookmark._meta.app_label, Bookmark._meta.module_name)
        for bk in Bookmark.objects.filter(content_type=content_type, user=self.user, url_name='admin:%s_%s_changelist' % model_info):
            selected = (current_qs == bk.query)

            bookmarks.append({'title': bk.title, 'selected': selected, 'url': bk.url, 'edit_url': 
                reverse('admin:%s_%s_change' % bk_model_info, args=(bk.id,))})
            if selected:
                menu_title = bk.title
                has_selected = True

        post_url = reverse('admin:%s_%s_bookmark' % model_info,
                           current_app=self.admin_site.name)

        new_context = {
            'bk_menu_title': menu_title,
            'bk_bookmarks': bookmarks,
            'bk_current_qs': current_qs,
            'bk_has_selected': has_selected,
            'bk_list_base_url': list_base_url,
            'bk_post_url': post_url,
        }
        context.update(new_context)
        return context

    # Media
    def get_media(self, media):
        media.add_js([static('exadmin/js/bookmark.js')])
        return media

    # Block Views
    def block_nav_menu(self, context, nodes):
        if self.show_bookmarks:
            nodes.insert(0, loader.render_to_string('admin/bookmarks.html', context_instance=context))

class BookmarkView(ModelAdminView):

    @csrf_protect_m
    @transaction.commit_on_success
    def post(self, request):
        model_info = (self.opts.app_label, self.opts.module_name)
        url_name = 'admin:%s_%s_changelist' % model_info
        bookmark = Bookmark(content_type=ContentType.objects.get_for_model(self.model), \
            title=request.POST['title'], user=self.user, query=request.POST.get('query', ''), \
            is_share=request.POST.get('is_share', 0), url_name=url_name)
        bookmark.save()
        content = {'title': bookmark.title, 'url': bookmark.url}
        return self.render_response(content)

class BookmarkAdmin(object):

    list_display = ('title', 'url_name', 'query')
    list_display_links = ('title',)

    def queryset(self):
        return Bookmark.objects.filter(user=self.user)
        

site.register(Bookmark, BookmarkAdmin)
site.register_plugin(BookmarkPlugin, ListAdminView)
site.register_modelview(r'^bookmark/$', BookmarkView, name='%s_%s_bookmark')


