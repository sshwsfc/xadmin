(function($){

  var DetailsPop = function(element){
    this.$element = $(element);
    this.res_uri = this.$element.data('res-uri');
    this.edit_uri = this.$element.data('edit-uri');
    this.obj_data = null;

    this.$element.on('click', $.proxy(this.click, this));
  };

  DetailsPop.prototype = {
      constructor: DetailsPop,

      click: function(e){
        e.stopPropagation();
        e.preventDefault();

        var popover = this.$element.data('popover');
        if (popover && popover.tip().is(':visible')) {
          this.hide();
        } else {
          this.show();
        }
      },
      show: function () {
        $('.popover.details-popover').hide();

        if (!this.$element.data('popover')) {
            this.$element.popover({
                trigger  :'manual',
                html: true,
                content: '<div class="editable-loading"></div>',
            });
            this.$element.data('popover').tip().addClass('details-popover');
            this.load_data();
        }
        this.$element.popover('show');
        this.$element.addClass('details-open');

        var $tip = this.$element.data('popover').tip();
        //bind popover hide on button
        $tip.find('.close-details').click($.proxy(this.hide, this));

        //bind popover hide on escape
        $(document).on('keyup.details', $.proxy(function (e) {
            if (e.which === 27) {
                e.stopPropagation();
                this.hide();
            }
        }, this));
       
        //hide popover on external click
        $(document).on('click.details', $.proxy(this.hide, this));
      },
      hide: function () {
        this.$element.popover('hide');
        this.$element.removeClass('details-open');

        $(document).off('keyup.details');
        $(document).off('click.details');
      },
      load_data: function(){
        $.getJSON(this.res_uri, $.proxy(function(data){
          var html = '<div class="data-details"><dl class="dl-horizontal">';
          for(var i in data){
            html += '<dt>'+i+'</dt><dd>'+(data[i] || '<span class="muted">null</span>')+'</dd>';
          }
          html += '</dl>';
          if(this.edit_uri){
            html += '<a href="'+ this.edit_uri +'" class="btn"><i class="icon-pencil"></i> Edit</a>';
          }
          html += '</div>';
          this.$element.attr('data-content', html);
          this.$element.data('popover').setContent();
          this.$element.popover('show');
        }, this));
      }
  };

  $.fn.details = function () {
    return this.each(function () {
      var $this = $(this), data = $this.data('details');
      if (!data) {
          $this.data('details', (data = new DetailsPop(this)));
      }
    });
  };

  $(function(){
    $('.table td .details-handler').details();
  });

})(jQuery);


