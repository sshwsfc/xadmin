jQuery(function() {
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: '.box-title',
        forcePlaceholderSize: true,
        cursor: "move",
        cancel: ".unsort"
    });

    $( ".box" )
        .find( ".box-title" )
            .prepend( "<i class='icon icon-chevron-up chevron'></i>")
            .end()
        .find( ".box-content" );

    $( ".box-title .icon.chevron" ).click(function() {
        $( this ).toggleClass( "icon-chevron-up" ).toggleClass( "icon-chevron-down" );
        $( this ).parents( ".box:first" ).find( ".box-content" ).toggle('fast');
    });
});