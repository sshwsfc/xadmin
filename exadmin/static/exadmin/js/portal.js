jQuery(function() {
    $( ".column" ).sortable({
        connectWith: ".column",
        handle: '.portlet-header',
        forcePlaceholderSize: true,
        cursor: "move",
    });

    $( ".portlet" )
        .find( ".portlet-header" )
            .prepend( "<i class='icon icon-chevron-up'></i>")
            .end()
        .find( ".portlet-content" );

    $( ".portlet-header .icon" ).click(function() {
        $( this ).toggleClass( "icon-chevron-up" ).toggleClass( "icon-chevron-down" );
        $( this ).parents( ".portlet:first" ).find( ".portlet-content" ).toggle('fast');
    });

    $( ".column" ).disableSelection();
});