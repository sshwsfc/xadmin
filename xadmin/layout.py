from crispy_forms.helper import FormHelper
from crispy_forms.layout import *
from crispy_forms.bootstrap import *
from crispy_forms.utils import render_field, flatatt

from crispy_forms import layout
from crispy_forms import bootstrap

import math


class Fieldset(layout.Fieldset):
    template = "xadmin/layout/fieldset.html"

    def __init__(self, legend, *fields, **kwargs):
        self.description = kwargs.pop('description', None)
        self.collapsed = kwargs.pop('collapsed', None)
        super(Fieldset, self).__init__(legend, *fields, **kwargs)


class Row(layout.Div):

    def __init__(self, *fields, **kwargs):
        css_class = 'form-inline form-group'
        new_fields = [self.convert_field(f, len(fields)) for f in fields]
        super(Row, self).__init__(css_class=css_class, *new_fields, **kwargs)

    def convert_field(self, f, counts):
        col_class = "col-sm-%d" % int(math.ceil(12 / counts))
        if not (isinstance(f, Field) or issubclass(f.__class__, Field)):
            f = layout.Field(f)
        if f.wrapper_class:
            f.wrapper_class += " %s" % col_class
        else:
            f.wrapper_class = col_class
        return f


class Col(layout.Column):

    def __init__(self, id, *fields, **kwargs):
        css_class = ['column', 'form-column', id, 'col col-sm-%d' %
                     kwargs.get('span', 6)]
        if kwargs.get('horizontal'):
            css_class.append('form-horizontal')
        super(Col, self).__init__(css_class=' '.join(css_class), *
                                  fields, **kwargs)


class Main(layout.Column):
    css_class = "column form-column main col col-sm-9 form-horizontal"


class Side(layout.Column):
    css_class = "column form-column sidebar col col-sm-3"


class Container(layout.Div):
    css_class = "form-container row clearfix"


# Override bootstrap3
class InputGroup(layout.Field):

    template = "xadmin/layout/input_group.html"

    def __init__(self, field, *args, **kwargs):
        self.field = field
        self.inputs = list(args)
        if '@@' not in args:
            self.inputs.append('@@')

        super(InputGroup, self).__init__(field, **kwargs)

    def render(self, form, form_style, context, template_pack='bootstrap'):
        classes = form.fields[self.field].widget.attrs.get('class', '')
        context.update(
            {'inputs': self.inputs, 'classes': classes.replace('form-control', '')})
        if hasattr(self, 'wrapper_class'):
            context['wrapper_class'] = self.wrapper_class
        return render_field(
            self.field, form, form_style, context, template=self.template,
            attrs=self.attrs, template_pack=template_pack)


class PrependedText(InputGroup):

    def __init__(self, field, text, **kwargs):
        super(PrependedText, self).__init__(field, text, '@@', **kwargs)


class AppendedText(InputGroup):

    def __init__(self, field, text, **kwargs):
        super(AppendedText, self).__init__(field, '@@', text, **kwargs)


class PrependedAppendedText(InputGroup):

    def __init__(self, field, prepended_text=None, appended_text=None, *args, **kwargs):
        super(PrependedAppendedText, self).__init__(
            field, prepended_text, '@@', appended_text, **kwargs)
