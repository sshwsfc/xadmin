;(function($){
  $('body').on('touchstart.dropdown', '.dropdown-menu', function (e) { e.stopPropagation(); });

  $.fn.exform = function(){
    this.each(function () {
      var form = $(this);
      for (var i = $.fn.exform.renders.length - 1; i >= 0; i--) {
        $.fn.exform.renders[i](form)
      };
      form.addClass('rended');
    })
  }
  $.fn.exform.renders = [];
  $(function() {
    $('.exform:not(.rended)').exform();
  });

  $.getCookie = function(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }

  // dashboard widget
  $('.widget-form').each(function(e){
    var el = $(this);
    el.find('.btn-remove').click(function(){
      el.find('input[name=_delete]').val('on');
      return true;
    });
  });

  // g-search
  $('#g-search .dropdown-menu a').click(function(){
      $('#g-search').attr('action', $(this).data('action')).submit();
  })

  // save settings
  $.save_user_settings = function(key, value, success, error){
    var csrftoken = $.getCookie('csrftoken');
    $.ajax({
      type: 'POST',
      url: window.__admin_path_prefix__ + 'settings/user',
      data: {'key': key, 'value': value},
      success: success,
      error: error,
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    });
  }
  
})(jQuery)