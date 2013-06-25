(function($){

  var DetailsPop = function(element){
    this.$element = $(element);
    this.res_uri = this.$element.data('res-uri');
    this.edit_uri = this.$element.data('edit-uri');
    this.obj_data = null;
    this.$element.on('click', $.proxy(this.click, this));
  };

  DetailsPop.prototype = {
      constructor: DetailsPop,

      click: function(e){
        e.stopPropagation();
        e.preventDefault();
        var modal = $('#detail-modal');
        var el = this.$element;
        var close_text = gettext('Close');
        var edit_text = gettext('Edit');
        var title = el.attr('title');
        if(!modal.length){
          modal = $('<div id="detail-modal" class="modal container hide fade quick-form" role="dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3></h3></div><div class="modal-body"></div>'+
            '<div class="modal-footer"><button class="btn" data-dismiss="modal" aria-hidden="true">'+close_text+'</button>'+
            '<a class="btn btn-submit btn-primary edit-btn"><i class="icon-pencil"></i> '+edit_text+'</a></div></div>');
          $('body').append(modal);
        }
        var edit_btn = modal.find('.edit-btn');
        if (this.edit_uri){
            edit_btn.attr('href', this.edit_uri);
            edit_btn.show();
        }else{
            edit_btn.hide();
        }

        modal.find('.modal-body').html('<div class="progress progress-striped active" style="width:50%; margin: 10px auto;"><div class="bar" style="width: 100%;"></div></div>');
        modal.find('.modal-body').load(this.res_uri + '?_format=html', function(response, status, xhr) {
          if (status == "error") {
            var msg = "Sorry but there was an error: ";
            modal.find('.modal-body').html(msg + xhr.status + " " + (typeof xhr === 'string' ? xhr : xhr.responseText || xhr.statusText || 'Unknown error!'));
          }
          modal.find('h3').text(title);
          modal.find( ".box-title .icon.chevron" ).click(function() {
              $( this ).toggleClass( "icon-chevron-up" ).toggleClass( "icon-chevron-down" );
              $( this ).parents( ".box:first" ).find( ".box-content" ).toggle('fast');
          });
        });
        modal.modal().css(
            {
                'margin-top': function () {
                    return window.pageYOffset;
                }
            });
      }
  };

  $.fn.details = function () {
    return this.each(function () {
      var $this = $(this), data = $this.data('details');
      if (!data) {
          $this.data('details', (data = new DetailsPop(this)));
      }
    });
  };

  $(function(){
    $('.table td .details-handler').details();
  });

})(jQuery);


