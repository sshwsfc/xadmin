$(document).ready(function(){

    function showTooltip(x, y, contents) {
        $('<div id="chart-tooltip" class="tooltip-inner">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5
        }).appendTo("body").fadeIn(200);
    }

    $('.chart-tab a').click(function(e){
      e.preventDefault();
      $(this).tab('show');

      $($(this).attr('href')).chart();
    });
    $('.chart-tab a:first').click();
    // $('.chart.init').chart();
});