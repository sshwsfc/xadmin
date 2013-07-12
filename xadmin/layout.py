from crispy_forms.helper import FormHelper
from crispy_forms.layout import *
from crispy_forms.bootstrap import *
from crispy_forms.utils import render_field, flatatt

from crispy_forms import layout
from crispy_forms import bootstrap


class Fieldset(layout.Fieldset):
    template = "xadmin/layout/fieldset.html"

    def __init__(self, legend, *fields, **kwargs):
        self.description = kwargs.pop('description', None)
        super(Fieldset, self).__init__(legend, *fields, **kwargs)


class Row(layout.Div):

    def __init__(self, *fields, **kwargs):
        css_class = 'form-row row num%d' % len(fields)
        super(Row, self).__init__(css_class=css_class, *fields, **kwargs)


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

    template = "bootstrap3/layout/input_group.html"

    def __init__(self, field, *args, **kwargs):
        self.field = field
        self.inputs = list(args)
        if '@@' not in args:
            self.inputs.append('@@')

        super(InputGroup, self).__init__(field, **kwargs)

    def render(self, form, form_style, context, template_pack='bootstrap'):
        context.update({'inputs': self.inputs})
        return render_field(self.field, form, form_style, context, template=self.template, attrs=self.attrs, template_pack=template_pack)

class PrependedText(InputGroup):

    def __init__(self, field, text, **kwargs):
        super(PrependedText, self).__init__(field, text, '@@', **kwargs)

class AppendedText(InputGroup):

    def __init__(self, field, text, **kwargs):
        super(AppendedText, self).__init__(field, '@@', text, **kwargs)

class PrependedAppendedText(InputGroup):

    def __init__(self, field, prepended_text=None, appended_text=None, *args, **kwargs):
        super(PrependedAppendedText, self).__init__(field, prepended_text, '@@', appended_text, **kwargs)


