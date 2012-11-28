/**
 * jQuery Formset 1.1
 * @author Stanislaus Madueke (stan DOT madueke AT gmail DOT com)
 * @requires jQuery 1.2.6 or later
 *
 * Copyright (c) 2009, Stanislaus Madueke
 * All rights reserved.
 *
 * Licensed under the New BSD License
 * See: http://www.opensource.org/licenses/bsd-license.php
 */
;(function($) {
    $.fn.formset = function(opts)
    {
        var options = $.extend({}, $.fn.formset.defaults, opts),
            $$ = $(this),

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
                row.find('input,select,textarea,label,div,a').each(function() {
                    updateElementIndex($(this), options.prefix, i);
                });
                row.find('.formset-num').html(i + 1);
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
                    if (options.removed) options.removed(row);
                    return false;
                });
            };

        $$.find(".formset-row").each(function(i) {
            insertDeleteLink($(this));
        });

        if ($$.length) {
            var template = $('#' + options.prefix + '-empty');
            template.removeAttr('id');
            options.formTemplate = template;

            $('#' + options.prefix + '-add-row').click(function() {
                var formCount = parseInt($('#id_' + options.prefix + '-TOTAL_FORMS').val()),
                    row = options.formTemplate.clone(true).removeClass('empty-form');
                updateRowIndex(row, formCount);
                row.appendTo($$).show();
                insertDeleteLink(row);
                $('#id_' + options.prefix + '-TOTAL_FORMS').val(formCount + 1);
                // If a post-add callback was supplied, call it with the added form:
                if (options.added) options.added(row);
                return false;
            });
        }

        return $$;
    }

    /* Setup plugin defaults */
    $.fn.formset.defaults = {
        prefix: 'form',                  // The form prefix for your django formset
        added: null,                     // Function called each time a new form is added
        removed: null                    // Function called each time a form is deleted
    };

    $(function(){
        $('.formset-content').each(function(){
            var $el = $(this);
            var prefix = $el.data('prefix');
            $el.formset({
                prefix: prefix
            })
        })
    });
})(jQuery)