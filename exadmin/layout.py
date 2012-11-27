from crispy_forms.helper import FormHelper
from crispy_forms.layout import *
from crispy_forms.bootstrap import *
from crispy_forms.utils import render_field, flatatt

from crispy_forms import layout

class Fieldset(layout.Fieldset):
    template = "admin/fieldset.html"

class Row(layout.Div):

    def __init__(self, *fields, **kwargs):
        css_class = 'form-row num%d' % len(fields)
        super(Row, self).__init__(css_class=css_class, *fields, **kwargs)

class Col(layout.Column):

    def __init__(self, id, *fields, **kwargs):
        css_class = ['form-column', id, 'span%d' % kwargs.get('span', 6)]
        if kwargs.get('horizontal'):
            css_class.append('form-horizontal')
        super(Col, self).__init__(css_class=' '.join(css_class), *fields, **kwargs)

class Main(layout.Column):
    css_class = "form-column main span9 form-horizontal"

class Side(layout.Column):
    css_class = "form-column sidebar span3"

class Container(layout.Div):
    css_class = "form-container row-fluid"