jQuery(function($){
    //full screen btn
    $('.layout-btns .layout-full').click(function(e){
        if($(this).hasClass('active')){
            // reset
            $('#left-side, ul.breadcrumb').show('fast');
            $('#content-block').removeClass('col-lg-12 col-sm-12 full-content').addClass('col-sm-11 col-lg-10');
        } else {
            // full screen
            $('#left-side, ul.breadcrumb').hide('fast', function(){
                $('#content-block').removeClass('col-sm-11 col-lg-10').addClass('col-lg-12 col-sm-12 full-content');
            });
        }
    });

    $('.layout-btns .layout-normal').click(function(e){
        $('.results table').removeClass('table-condensed');
    });

    $('.layout-btns .layout-condensed').click(function(e){
        $('.results table').addClass('table-condensed');
    });

});