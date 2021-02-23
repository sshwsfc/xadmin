;(function($){
    // QUICK_FORM_PLUGIN: Exists when the script was loaded via the quick-form plugin
    //noinspection JSUnresolvedVariable
    var quick_form_ajax = typeof PLUGIN_QUICK_FORM_AJAX == 'undefined' ? false : PLUGIN_QUICK_FORM_AJAX;
    $(function() {
      var action_bar = $('.form-actions');
      if(action_bar.length && !quick_form_ajax){
            var height=action_bar[0].offsetTop + action_bar.outerHeight();
            var onchange = function(){
                var s=(document.body.scrollTop||document.documentElement.scrollTop) + window.innerHeight;
                if(s<height){action_bar.addClass('fixed');}
                else{action_bar.removeClass('fixed');}
            }
            window.onscroll=onchange;
            onchange();
        }
        if(window.__admin_ismobile__){
            $(window).bind('resize', function(e){
                var rate = $(window).height() / $(window).width();
                var action_bar = $('.form-actions');
                if(rate < 1){
                    action_bar.css('display', 'none');
                } else {
                    action_bar.css('display', 'block');
                }
            });
        }
    });
    var exform = $('.exform').first();
    if (exform.find('.text-error').length > 0){
        var first_activated = false;
        exform.find('.error').each(function(){
            if (!first_activated){
                var parent = $(this);
                while (!(parent.html() == exform.html())){
                    if (parent.hasClass('tab-pane')){
                        parent.addClass('active');
                        parent.siblings().removeClass('active');
                        var menu_tab = $('a[href="#' + parent.attr('id') + '"]');
                        menu_tab.parent().addClass('active');
                        menu_tab.parent().siblings().removeClass('active');
                        first_activated = true;

                    }
                    if (parent.hasClass('box-content')){
                        parent.show();
                    }
                    parent = parent.parent();
                }
            }
        });
    }
})(jQuery)

