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
})(jQuery)

