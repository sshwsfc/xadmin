(function($) {
  $('.popover.dropdown-menu input, .popover.dropdown-menu label').click(function(e){
    e.stopPropagation();
  });

  $(function(){
    $('.filters .dropdown-submenu').on('mouseover', function(e){
      $(this).parent().find('>.dropdown-submenu.open').removeClass('open');
      $(this).addClass('open');
    });

    $(document)
      .on('click.filterdropdown.data-api touchstart.filterdropdown.data-api', function(e){
        $('.filters .dropdown-submenu.open').removeClass('open');
      })

    // menber filter
    $('.filter-number .add-on.remove').click(function(e){
      $(this).parent().find('input[type="text"]').val('');
    });

    $('.filter-number .add-on.toggle').click(function(e){
      var new_name = $(this).hasClass('active') ? $(this).attr('data-off-name') : $(this).attr('data-on-name');
      $(this).parent().find('input[type="text"]').attr('name', new_name);
    });

    $('#filter-menu form').submit(function(){
      $(this).find('input[type="text"]').each(function(e){
        if(!$(this).val()) $(this).attr('name', '');
      });
      return true;
    });

    $('.menu-date-range .dropdown-menu form').each(function(){
      var el = $(this);
      var start_date = el.find('.calendar.date-start').datepicker({format: $.date_local.dateJSFormat, language: 'xadmin'});
      var end_date = el.find('.calendar.date-end').datepicker({format: $.date_local.dateJSFormat, language: 'xadmin'});
      
      var checkAvailable = function(){
        if(start_date.data('datepicker').getDate().valueOf() <= end_date.data('datepicker').getDate().valueOf()){
          el.find('button[type=submit]').removeAttr('disabled');
        } else {
          el.find('button[type=submit]').attr('disabled', 'disabled');
        }
      }
      
      start_date.on('changeDate', function(ev){
          var startdate = start_date.data('date');
          el.find('.start_input').val(startdate);
          end_date.data('datepicker').setStartDate(startdate);
          checkAvailable();
      });
      end_date.on('changeDate', function(ev){
          var enddate = end_date.data('date');
          el.find('.end_input').val(enddate);
          start_date.data('datepicker').setEndDate(enddate);
          checkAvailable();
      });
      
      checkAvailable();
    });
  });

})(jQuery);