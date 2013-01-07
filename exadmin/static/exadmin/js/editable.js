
;(function($){

  var Editable = function(element, options) {
    var that = this;

    this.el = $(element);
    var el = this.el;

    this.popover = el.find('.popover');
    this.form = el.find('form');

    // setup event
    this.el.click($.proxy(this.show, this));
    this.form.submit($.proxy(this.save, this));
  }

  Editable.prototype = {
    constructor: Editable,

    show : function(){
      this.popover.show();
    },

  }

  $.fn.editable = function ( option ) {
    var args = Array.apply(null, arguments);
    args.shift();
    return this.each(function () {
      var $this = $(this),
        data = $this.data('editable'),
        options = typeof option == 'object' && option;
      if (!data) {
        $this.data('editable', (data = new Editable(this)));
      }
    });
  };

  $(function(){
    $('.editable-handler').editable();
  })

})(jQuery)