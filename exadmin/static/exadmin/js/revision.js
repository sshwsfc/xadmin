jQuery(function($){
    $('.diff_field').each(function(){
        var el = $(this);
        var title = el.attr('title');
        el.find('.controls').tooltip({
            title: title
        })
    });
});