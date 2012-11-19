(function($) {
  $('.popover.dropdown-menu input, .popover.dropdown-menu label').click(function(e){
    e.stopPropagation();
  });
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

  $(function(){
    $('.menu-date-range .dropdown-menu form').each(function(){
      var el = $(this);
      el.find('.daterangepicker').daterangepicker({format: 'yyyy-MM-dd'}, function(startDate, endDate, availableDate){
        el.find('.start_input').val(startDate);
        el.find('.end_input').val(endDate);
        if(availableDate){
          el.find('button[type=submit]').removeAttr('disabled');
        } else {
          el.find('button[type=submit]').attr('disabled', 'disabled');
        }
      });
    });
  });

})(jQuery);