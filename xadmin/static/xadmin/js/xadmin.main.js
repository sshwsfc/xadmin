;(function($){

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

  /*Returns the value of the name of a url parameter*/
  $.urlParam = function (name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
 }

  $.setCookie = function(name, value, options){
    options = options || {};
    if (value === null) {
        value = '';
        options.expires = -1;
    }
    var expires = '';
    if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
  }

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

  //dropdown submenu plugin
  $(document)
    .on('click.xa.dropdown.data-api touchstart.xa.dropdown.data-api', '.dropdown-submenu', function (e) { e.stopPropagation(); })
    .on('click.xa.dropdown.data-api', function(e){
      $('.dropdown-submenu.open').removeClass('open');
    });

  if ('ontouchstart' in document.documentElement) {
    $('.dropdown-submenu a').on('click.xa.dropdown.data-api', function(e){
      $(this).parent().toggleClass('open');
    });
  } else{
    $('.dropdown-submenu').on('click.xa.dropdown.data-api mouseover.xa.dropdown.data-api', function(e){
      $(this).parent().find('>.dropdown-submenu.open').removeClass('open');
      $(this).addClass('open');
    });
  }
  
  //toggle class button
  $('body').on('click.xa.togglebtn.data-api', '[data-toggle=class]', function (e) {
    var $this  = $(this), href
    var target = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var className = $this.attr('data-class-name')
    $(target).toggleClass(className)
  })
  
  // loading btn
  // $('.btn.btn-loading,.btn[type=submit]')
  //   .click(function () {
  //     var btn = $(this)
  //     btn.button('loading')
  //   })

  //.nav-content bar nav-menu
  $('.navbar-xs .navbar-nav > li')
    .on('shown.bs.dropdown', function(e){
      $(this).find('>.dropdown-menu').css('max-height', $(window).height()-120);
      $(this).parent().find('>li').addClass('hidden-xs');
      $(this).removeClass('hidden-xs');
    })
    .on('hidden.bs.dropdown', function(e){
      $(this).parent().find('>li').removeClass('hidden-xs');
    });

  // dashboard widget
  $('.widget-form').each(function(e){
    var el = $(this);
    el.find('.btn-remove').click(function(){
      el.find('input[name=_delete]').val('on');
      el.submit();
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