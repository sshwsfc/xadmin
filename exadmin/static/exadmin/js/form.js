jQuery(function() {
    $( ".form-column" ).sortable({
        connectWith: ".form-column",
        handle: '.box-title',
        forcePlaceholderSize: true,
        cursor: "move",
        cancel: ".unsort"
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

    $('.controls select.select').select2();
    $('.controls .select-search').each(function(){
        var $el = $(this);
        $el.select2({
            minimumInputLength: 1,
            initSelection: function(elem, callback){
                callback({id: elem.val(), '__str__': $el.data('label')});
            },
            ajax: {
                url: $el.data('search-url'),
                dataType: 'json',
                data: function (term, page) {
                    return {
                        '_q_' : term,
                        '_cols': 'id.__str__',
                        'p': page - 1
                    };
                },
                results: function (data, page) {
                    return {results: data.objects, more: data.has_more};
                }
            },
            formatResult: function(item){return item['__str__']},
            formatSelection: function(item){return item['__str__']}
        });
    })
});