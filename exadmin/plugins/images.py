from django.db import models
from django.utils.safestring import mark_safe
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, DetailAdminView


class ModelDetailPlugin(BaseAdminPlugin):

    def __init__(self, admin_view):
        super(ModelDetailPlugin, self).__init__(admin_view)
        self.include_image = False

    def get_field_result(self, result, field_name):
        if isinstance(result.field, models.ImageField):
            obj = self.admin_view.obj
            if result.value:
                img = getattr(obj, field_name)
                result.text = mark_safe('<a href="%s" title="%s" rel="gallery"><img src="%s" class="field_img"/></a>' % (img.url, result.label, img.url))
                self.include_image = True
        return result

    # Media
    def get_media(self, media):
        if self.include_image:
            media.add_js([self.static('exadmin/js/load-image.min.js'), self.static('exadmin/js/bootstrap-image-gallery.min.js')])
            media.add_css({'screen': [self.static('exadmin/css/bootstrap-image-gallery.min.css')]})
        return media

    def block_before_fieldsets(self, context, node):
        if self.include_image:
            return """
              <div id="gallery" data-toggle="modal-gallery" data-target="#modal-gallery">
                <!-- modal-gallery is the modal dialog used for the image gallery -->
                <div id="modal-gallery" class="modal modal-gallery hide fade" tabindex="-1">
                    <div class="modal-header">
                        <a class="close" data-dismiss="modal">&times;</a>
                        <h3 class="modal-title"></h3>
                    </div>
                    <div class="modal-body"><div class="modal-image"></div></div>
                    <div class="modal-footer">
                        <a class="btn btn-primary modal-next">Next <i class="icon-arrow-right icon-white"></i></a>
                        <a class="btn btn-info modal-prev"><i class="icon-arrow-left icon-white"></i> Previous</a>
                        <a class="btn btn-success modal-play modal-slideshow" data-slideshow="5000"><i class="icon-play icon-white"></i> Slideshow</a>
                        <a class="btn modal-download" target="_blank"><i class="icon-download"></i> Download</a>
                    </div>
                </div>
            """

    def block_after_fieldsets(self, context, node):
        if self.include_image:
            return "</div>"

site.register_plugin(ModelDetailPlugin, DetailAdminView)


