from crispy_forms.helper import FormHelper
from crispy_forms.layout import LayoutObject, Layout, MultiField, HTML, ButtonHolder, Button, Hidden, Reset, Submit, Div, Column

from crispy_forms import layout

class Fieldset(layout.Fieldset):
    template = "admin/fieldset.html"

class Row(layout.Div):

    def __init__(self, *fields, **kwargs):
        css_class = 'form-row num%d' % len(fields)
        super(Row, self).__init__(css_class=css_class, *fields, **kwargs)

class Main(layout.Column):
    css_class = "form-column main span9 form-horizontal"

class Side(layout.Column):
    css_class = "form-column sidebar span3"

class Container(layout.Div):
    css_class = "form-container row-fluid"