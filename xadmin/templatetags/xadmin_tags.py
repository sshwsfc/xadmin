from django.template import Library
from xadmin.util import static, vendor as util_vendor
import sys

if sys.version_info[0] == 3:
    unicode = str

register = Library()


@register.simple_tag(takes_context=True)
def view_block(context, block_name, *args, **kwargs):
    if 'admin_view' not in context:
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
    return 'xadmin:%s_%s_%s' % (value.app_label, value.model_name, arg)

static = register.simple_tag(static)


@register.simple_tag(takes_context=True)
def vendor(context, *tags):
    return util_vendor(*tags).render()
