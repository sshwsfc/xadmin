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

    $('.controls select').select2();

    $('.fk-search-field').each(function(){
        var $el = $(this);
        $el.select2({
            minimumInputLength: 1,
            ajax: {
                url: $el.data('search-url'),
                dataType: 'json',
                data: function (term, page) {
                    return {};
                },
                results: function (data, page) {
                    return {results: data.objects};
                }
            },
            initSelection : function (element, callback) {
                callback([{id: $el.val(), text: 'qqq'}]);
            },
            formatResult: function(item){return item.name},
            formatSelection: function(item){return item.name}
        });
        $el.select2('val', $el.val());
    })
});