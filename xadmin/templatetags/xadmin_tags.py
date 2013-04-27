from django.template import Library
from django.forms import Media
from xadmin.util import static, xstatic as util_xstatic

register = Library()

@register.simple_tag(takes_context=True)
def view_block(context, block_name, *args, **kwargs):
    if not context.has_key('admin_view'):
        return ""

    admin_view = context['admin_view']
    nodes = []
    method_name = 'block_%s' % block_name

    for view in [admin_view] + admin_view.plugins:
        if hasattr(view, method_name) and callable(getattr(view, method_name)):
            block_func = getattr(view, method_name)
            result = block_func(context, nodes, *args, **kwargs)
            if result and type(result) in (str, unicode):
                nodes.append(result)
    if nodes:
        return ''.join(nodes)
    else:
        return ""
    
@register.filter
def admin_urlname(value, arg):
    return 'admin:%s_%s_%s' % (value.app_label, value.module_name, arg)

static = register.simple_tag(static)

@register.simple_tag
def xstatic(*tags):
    media = Media()
    for tag in tags:
        file_type = tag.split('.')[-1]
        files = util_xstatic(tag)
        if file_type == 'js':
            media.add_js(files)
        elif file_type == 'css':
            media.add_css({'screen': files})
    return media.render()

@register.inclusion_tag('xadmin/submit_line.html', takes_context=True)
def submit_row(context):
    """
    Displays the row of buttons for delete and save.
    """
    opts = context['opts']
    change = context['change']
    is_popup = context['is_popup']
    save_as = context['save_as']
    return {
        'onclick_attrib': (opts.get_ordered_objects() and change
                            and 'onclick="submitOrderForm();"' or ''),
        'show_delete_link': (not is_popup and context['has_delete_permission']
                              and (change or context['show_delete'])),
        'show_save_as_new': not is_popup and change and save_as,
        'show_save_and_add_another': context['has_add_permission'] and
                            not is_popup and (not save_as or context['add']),
        'show_save_and_continue': not is_popup and context['has_change_permission'],
        'is_popup': is_popup,
        'show_save': True
    }