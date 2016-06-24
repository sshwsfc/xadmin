from django.template.context import RequestContext


def get_context_dict(context):
    if isinstance(context, RequestContext):
        ctx = {}
        map(ctx.update, context.dicts)
    else:
        ctx = context
    return ctx
