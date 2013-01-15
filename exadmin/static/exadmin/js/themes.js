(function($) {

  $(function(){
    var top_nav = $('#top-nav');
    $('body').css('padding-top', $('body>.container-fluid').offset().top + 'px');
    top_nav.css('position', 'fixed');

    if($("#g-theme-menu")){
      $('#g-theme-menu li>a').click(function(){
        var $el = $(this);
        var themeHref = $el.data('css-href');
        $.save_user_settings("site-theme", themeHref, function(){
          $('#site-theme').attr('href', themeHref);

          setTimeout(function(){
            var nav_height = $('#top-nav').height();
            $('body').animate({'padding-top': (nav_height + 18)}, 500, 'easeOutBounce');
          }, 500);

          $('#g-theme-menu li').removeClass('active');
          $el.parent().addClass('active');
        });
      })
    }
  });

})(jQuery);