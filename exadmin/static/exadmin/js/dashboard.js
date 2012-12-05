jQuery(function() {
  $( ".btn-quick-form" ).click(function(){
    var btn = $(this),
        form_url;
    if(btn.is('a')){
      form_url = btn.attr('href');
    }
    if(form_url == undefined){
      form_url = btn.data('form-url');
    }
    if(!btn.data('form-modal')){
      var modal = $('<div class="modal hide fade quick-form" role="dialog"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3>'+ btn.attr('title') +'</h3></div><div class="modal-body"></div></div>');
      $('body').append(modal);
      btn.data('form-modal', modal);
      modal.find('.modal-body').load(form_url, function(form_html, status, xhr){
        $(this).exform();
      });
    }
    btn.data('form-modal').modal();
    return false;
  });
});