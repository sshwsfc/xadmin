;(function($){
    // add select2 render
    $.fn.exform.renders.push(
      function(f){
        f.find('.controls select.select').select2();
        f.find('.controls .select-search').each(function(){
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

    $(function() {
        $( ".form-column" ).sortable({
            connectWith: ".form-column",
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

        $( ".form-column" ).disableSelection();

        $('.exform').exform();
    });

})(jQuery)

