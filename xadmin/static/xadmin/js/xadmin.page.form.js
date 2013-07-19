;(function($){
    $(function() {
        var action_bar = $('.form-actions');
        if(action_bar.length){
            var height=action_bar[0].offsetTop + action_bar.outerHeight();
            var onchange = function(){
                var s=(document.body.scrollTop||document.documentElement.scrollTop) + window.innerHeight;
                if(s<height){action_bar.addClass('fixed');}
                else{action_bar.removeClass('fixed');}
            }
            window.onscroll=onchange;
            onchange();
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
                console.log("WUALA");
            }
        });
    }
})(jQuery)

