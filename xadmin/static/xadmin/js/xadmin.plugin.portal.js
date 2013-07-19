jQuery(function() {
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: '.box-title',
        forcePlaceholderSize: true,
        cursor: "move",
        cancel: ".unsort, .tab-content",
        stop: function( event, ui ) {
            var pos = [];
            $('.column').each(function(){
                var col = [];
                $(this).find('.box').each(function(){
                    col.push($(this).attr('id'));
                });
                pos.push(col.join(','));
            });
            var pos_val = pos.join('|');
            var key = $('#_portal_key').val();
            $.save_user_settings(key, pos_val, function(){
                //alert('success');
            });
        }
    });


    $( ".box-title .icon.chevron" ).click(function() {
        $( this ).toggleClass( "icon-chevron-up" ).toggleClass( "icon-chevron-down" );
        $( this ).parents( ".box:first" ).find( ".box-content" ).toggle('fast');
    });
    
    $( ".column" ).disableSelection();

    // for dashboard
});