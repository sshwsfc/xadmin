;(function($){
    // add select2 render
    $.fn.exform.renders.push(function(f){
      if($.fn.select2){
        f.find('select:not(.select-search):not([multiple=multiple])').select2();
        f.find('.select-search').each(function(){
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
    }});
})(jQuery)

