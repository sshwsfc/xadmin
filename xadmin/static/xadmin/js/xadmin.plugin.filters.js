(function($) {
   
  $(function(){
    
	// filter
    $('.filter-multiselect input[type=checkbox]').click(function(e){
    	window.location.href = $(this).parent().attr('href');
    });
    
    // menber filter
    $('.filter-number .remove').click(function(e){
      $(this).parent().parent().find('input[type="number"]').val('');
    });

    $('.filter-number .toggle').click(function(e){
      var new_name = $(this).hasClass('active') ? $(this).attr('data-off-name') : $(this).attr('data-on-name');
      $(this).parent().parent().find('input[type="number"]').attr('name', new_name);
    });

    $('#filter-menu form').submit(function(){
      $(this).find('input[type="text"],input[type="number"]').each(function(e){
        if(!$(this).val()) $(this).attr('name', '');
      });
      return true;
    });

    $('.menu-date-range form').each(function(){
      var el = $(this);
      var start_date = el.find('.calendar.date-start').datepicker({format: 'yyyy-mm-dd', language: 'xadmin'});
      var end_date = el.find('.calendar.date-end').datepicker({format: 'yyyy-mm-dd', language: 'xadmin'});
      
      var checkAvailable = function(){
        if(start_date.data('datepicker').getDate() <= end_date.data('datepicker').getDate()){
          el.find('button[type=submit]').removeAttr('disabled');
        } else {
          el.find('button[type=submit]').attr('disabled', 'disabled');
        }
      }
      
      start_date.on('changeDate', function(ev){
          el.find('.start_input').val(start_date.datepicker('getFormattedDate'));
          end_date.data('datepicker').setStartDate(start_date.data('datepicker').getDate());
          checkAvailable();
      });
      end_date.on('changeDate', function(ev){
          el.find('.end_input').val(end_date.datepicker('getFormattedDate'));
          start_date.data('datepicker').setEndDate(end_date.data('datepicker').getDate());
          checkAvailable();
      });
      
      checkAvailable();
    });
  });

})(jQuery);