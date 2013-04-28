;(function($){
    $.convert_format = function(format){
        var fields = {
            d: 'dd',
            H: 'hh',
            I: "HH",
            m: 'mm',
            M: 'MM',
            p: 'PM/AM',
            S: 'ss',
            w: 'w',
            y: 'yy',
            Y: 'yyyy',
            '%' : '%'
        };
        var result = '', i = 0;
        while (i < format.length) {
            if (format.charAt(i) === '%') {
                if(f = fields[format.charAt(i + 1)]){
                  result = result + f;
                }
                ++i;
            } else {
                result = result + format.charAt(i);
            }
            ++i;
        }
        return result;
    }

    $.date_local = {
      days: gettext("Sunday Monday Tuesday Wednesday Thursday Friday Saturday Sunday").split(' '),
      daysShort: gettext("Sun Mon Tue Wed Thu Fri Sat Sun").split(' '),
      daysMin: gettext("Su Mo Tu We Th Fr Sa Su").split(' '),
      months: gettext('January February March April May June July August September October November December').split(' '),
      monthsShort: gettext("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec").split(' '),
      today: gettext("Today"),
      date_string: gettext('%a %d %b %Y %T %Z'),
      ampm: gettext("AM PM").split(' '),
      ampmLower: gettext("am pm").split(' '),
      dateFormat: get_format('DATE_INPUT_FORMATS')[0],
      dateJSFormat: $.convert_format(get_format('DATE_INPUT_FORMATS')[0]),
      timeRepr: gettext('%T')
    }

    $.fn.datepicker.dates['xadmin'] = $.date_local;

    $.fn.exform.renders.push(function(f){
      f.find('.input-append.date').each(function(e){
        var dp = $(this).datepicker({format: $.date_local.dateJSFormat, language: 'xadmin', todayBtn: "linked", autoclose: true})
          .data('datepicker');
        $(this).find('button').click(function(e){
          //dp.setDate(new Date());
          dp.update(new Date());
          dp.hide();
        })
      })
      if($.fn.timepicker){
        f.find('.input-append.time').each(function(e){
          var tp = $(this).find('input').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false,
            defaultTime: "value",
          }).data('timepicker');
          $(this).find('button').click(function(e){
            tp.$element.val("");
            tp.setDefaultTime('current');
            tp.update();
          })
        })
      }
    });

})(jQuery)