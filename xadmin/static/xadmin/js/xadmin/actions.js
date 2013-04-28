(function($) {

    $.fn.actions = function(opts) {
        var options = $.extend({}, $.fn.actions.defaults, opts);
        var actionCheckboxes = $(this);
        var list_editable_changed = false;
        checker = function(checked) {
            console.log(checked);
            if (checked == 'true') {
                showQuestion();
            } else {
                reset();
            }
            $(actionCheckboxes).attr("checked", checked)
                .parent().parent().toggleClass(options.selectedClass, checked);
        }
        updateCounter = function() {
            var sel = $(actionCheckboxes).filter(":checked").length;
            $(options.counterContainer).html(interpolate(
            ngettext('%(sel)s of %(cnt)s selected', '%(sel)s of %(cnt)s selected', sel), {
                sel: sel,
                cnt: _actions_icnt
            }, true));
            $(options.allToggle).attr("checked", function() {
                if (sel == actionCheckboxes.length) {
                    value = true;
                    showQuestion();
                } else {
                    value = false;
                    clearAcross();
                }
                return value;
            });
        }
        showQuestion = function() {
            $(options.acrossClears).hide();
            $(options.acrossQuestions).show();
            $(options.allContainer).hide();
        }
        showClear = function() {
            $(options.acrossClears).show();
            $(options.acrossQuestions).hide();
            $(options.actionContainer).toggleClass(options.selectedClass);
            $(options.allContainer).show();
            $(options.counterContainer).hide();
        }
        reset = function() {
            $(options.acrossClears).hide();
            $(options.acrossQuestions).hide();
            $(options.allContainer).hide();
            $(options.counterContainer).show();
        }
        clearAcross = function() {
            reset();
            $(options.acrossInput).val(0);
            $(options.actionContainer).removeClass(options.selectedClass);
        }
        // Show counter by default
        $(options.counterContainer).show();
        // Check state of checkboxes and reinit state if needed
        $(this).filter(":checked").each(function(i) {
            $(this).parent().parent().toggleClass(options.selectedClass);
            updateCounter();
            if ($(options.acrossInput).val() == 1) {
                showClear();
            }
        });
        $(options.allToggle).show().click(function() {
            checker($(this).is(":checked"));
            updateCounter();
        });
        $("div.actions .question").click(function(event) {
            event.preventDefault();
            $(options.acrossInput).val(1);
            showClear();
        });
        $("div.actions .clear").click(function(event) {
            event.preventDefault();
            $(options.allToggle).attr("checked", false);
            clearAcross();
            checker(false);
            updateCounter();
        });
        lastChecked = null;
        $(actionCheckboxes).click(function(event) {
            if (!event) { var event = window.event; }
            var target = event.target ? event.target : event.srcElement;
            if (lastChecked && $.data(lastChecked) != $.data(target) && event.shiftKey == true) {
                var inrange = false;
                $(lastChecked).attr("checked", target.checked)
                    .parent().parent().toggleClass(options.selectedClass, target.checked);
                $(actionCheckboxes).each(function() {
                    if ($.data(this) == $.data(lastChecked) || $.data(this) == $.data(target)) {
                        inrange = (inrange) ? false : true;
                    }
                    if (inrange) {
                        $(this).attr("checked", target.checked)
                            .parent().parent().toggleClass(options.selectedClass, target.checked);
                    }
                });
            }
            $(target).parent().parent().toggleClass(options.selectedClass, target.checked);
            lastChecked = target;
            updateCounter();
        });
        updateCounter();
        $('.actions').removeClass('hidden');
    }
    /* Setup plugin defaults */
    $.fn.actions.defaults = {
        actionContainer: "div.actions",
        counterContainer: ".action-counter",
        allContainer: "div.actions .all",
        acrossInput: "div.actions #select-across",
        acrossQuestions: "div.actions .question",
        acrossClears: "div.actions .clear",
        allToggle: "#action-toggle",
        selectedClass: "warning"
    }

    $.do_action = function(name){
      $('#action').val(name);
      $('#changelist-form').submit();
    }

    $(document).ready(function($) {
        $("tr input.action-select").actions();
    });
})(jQuery);
