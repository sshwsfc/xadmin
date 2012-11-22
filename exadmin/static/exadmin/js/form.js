jQuery(function() {
    $( ".form-column" ).sortable({
        connectWith: ".form-column",
        handle: '.box-title',
        forcePlaceholderSize: true,
        cursor: "move",
    });

    $( ".box" )
        .find( ".box-title" )
            .prepend( "<i class='icon icon-chevron-up'></i>")
            .end()
        .find( ".box-content" );

    $( ".box-title .icon" ).click(function() {
        $( this ).toggleClass( "icon-chevron-up" ).toggleClass( "icon-chevron-down" );
        $( this ).parents( ".box:first" ).find( ".box-content" ).toggle('fast');
    });

    $( ".form-column" ).disableSelection();
});