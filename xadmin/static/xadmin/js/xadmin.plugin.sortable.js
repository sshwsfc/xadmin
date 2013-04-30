(function($) {

  $(function(){
    $(".results table tbody").sortable({
      axis: 'y',
      items: 'tr',
      //handle: 'a.sort_hand',
      cursor: 'move',
      opacity: 0.8,
      stop: function(event, ui) {
        //alert(0);
      }
    });
  });

})(jQuery);