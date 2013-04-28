$(document).ready(function(){
    
    function showTooltip(x, y, contents) {
        $('<div id="chart-tooltip" class="tooltip-inner">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 5
        }).appendTo("body").fadeIn(200);
    }

    $.fn.chart = function(){
      $(this).each(function(){
        var $chart = $(this);

        if($chart.data('chart-obj')) return;

        $chart.html('<span class="muted"><i class="icon icon-spinner icon-spin"></i> Loading chart...</span>');

        $.getJSON($chart.data('chart-url'), function(data){
            var chart = $.plot($chart, data.data, data.option);
            var previousPoint = null;
            $chart.bind("plothover", function (event, pos, item) {
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;
                        
                        $("#chart-tooltip").remove();
                        var x = item.series.xaxis.tickFormatter(item.datapoint[0], item.series.xaxis),
                            y = item.series.yaxis.tickFormatter(item.datapoint[1], item.series.yaxis);
                        
                        showTooltip(item.pageX, item.pageY,
                                    item.series.label + " : " + x + " , " + y);
                    }
                } else {
                    $("#chart-tooltip").remove();
                    previousPoint = null;            
                }
            });
            $chart.data('chart-obj', chart);
        });
      })
    }

    $('.chart-tab a').click(function(e){
      e.preventDefault();
      $(this).tab('show');

      $($(this).attr('href')).chart();
    });
    $('.chart-tab a:first').click();
    $('.chart.init').chart();
});