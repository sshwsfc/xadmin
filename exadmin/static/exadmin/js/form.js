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
        $('.exform').exform();
        var action_bar = $('.form-actions');
        var height=action_bar[0].offsetTop + action_bar.outerHeight();
        var onchange = function(){
            var s=(document.body.scrollTop||document.documentElement.scrollTop) + window.innerHeight;
            if(s<height){action_bar.addClass('fixed');}
            else{action_bar.removeClass('fixed');}
        }
        window.onscroll=onchange;
        onchange();
    });

})(jQuery)

