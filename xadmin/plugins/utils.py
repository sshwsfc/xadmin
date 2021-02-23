from django.template.context import RequestContext, Context


def get_context_dict(context):
    """
     Contexts in django version 1.9+ must be dictionaries. As xadmin has a legacy with older versions of django,
    the function helps the transition by converting the [RequestContext, Context] object to the dictionary when necessary.
    :param context: RequestContext
    :return: dict
    """
    if isinstance(context, RequestContext):
        ctx = context.flatten()
    elif isinstance(context, Context):
        ctx = context.flatten()
    else:
        ctx = context
    return ctx
