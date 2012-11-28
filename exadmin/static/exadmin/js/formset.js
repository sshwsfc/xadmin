;(function($) {
    $.fn.formset = function(opts){
        var $$ = $(this);

        var options = $.extend({
            prefix: $$.data('prefix')
        }, $.fn.formset.styles[$$.data('style')], opts),

            updateElementIndex = function(elem, prefix, ndx) {
                var idRegex = new RegExp(prefix + '-(\\d+|__prefix__)-'),
                    replacement = prefix + '-' + ndx + '-';
                if (elem.attr("for")) elem.attr("for", elem.attr("for").replace(idRegex, replacement));
                if (elem.attr('id')) elem.attr('id', elem.attr('id').replace(idRegex, replacement));
                if (elem.attr('name')) elem.attr('name', elem.attr('name').replace(idRegex, replacement));
                if (elem.attr('href')) elem.attr('href', elem.attr('href').replace(idRegex, replacement));
            },

            hasChildElements = function(row) {
                return row.find('input,select,textarea,label,div,a').length > 0;
            },

            updateRowIndex = function(row, i){
                updateElementIndex(row, options.prefix, i);
                row.find('input,select,textarea,label,div,a').each(function() {
                    updateElementIndex($(this), options.prefix, i);
                });
                row.find('.formset-num').html(i + 1);
                row.data('row-index', i);
            },

            insertDeleteLink = function(row) {
                row.find('a.delete-row').click(function() {
                    var row = $(this).parents(".formset-row"),
                        del = row.find('input[id $= "-DELETE"]');
                    if (del.length) {
                        if(del.val() == 'on'){
                            row.removeClass('row-deleted');
                        } else {
                            row.addClass('row-deleted');
                        }
                        del.val(del.val() == 'on'?'':'on');
                    } else {
                        var parent = row.parent();
                        row.remove();
                        var forms = parent.find('.formset-row');
                        $('#id_' + options.prefix + '-TOTAL_FORMS').val(forms.length);
                        for (var i=0, formCount=forms.length; i<formCount; i++) {
                            updateRowIndex(forms.eq(i), i);
                        }
                    }
                    // If a post-delete callback was provided, call it with the deleted form:
                    if (options.removed) options.removed(row, $$);
                    return false;
                });
            };

        $$.find(".formset-row").each(function(i) {
            insertDeleteLink($(this));
        });

        if ($$.length) {
            var template = $('#' + options.prefix + '-empty');
            template.removeAttr('id');
            if(template.data("replace-id")){
                template.attr('id', template.data("replace-id"));
                template.removeAttr('data-replace-id');
            }
            options.formTemplate = template;

            $('#' + options.prefix + '-add-row').click(function() {
                var formCount = parseInt($('#id_' + options.prefix + '-TOTAL_FORMS').val()),
                    row = options.formTemplate.clone(true).removeClass('empty-form');
                updateRowIndex(row, formCount);
                row.appendTo($$);
                insertDeleteLink(row);
                $('#id_' + options.prefix + '-TOTAL_FORMS').val(formCount + 1);
                // If a post-add callback was supplied, call it with the added form:
                if (options.added) options.added(row, $$);
                return false;
            });
        }

        return $$;
    }

    $.fn.formset.styles = {
        'tab': {
            added: function(row, $$){
                var new_tab = $('<li><a data-toggle="tab" href="#'+ row.attr('id') +'">#'+ (row.data('row-index') + 1) +'</a></li>');
                $$.parent().find('.nav-tabs').append(new_tab);
                new_tab.find('a').tab('show');
            }
        }
    }

    $(function(){
        $('.formset-content').formset();
    });
})(jQuery)