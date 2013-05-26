
+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Editpop = function (element, options) {
    this.init('editpop', element, options)
  }

  Editpop.DEFAULTS = $.extend({} , $.fn.popover.Constructor.DEFAULTS, {
    container: 'body'
  , placement: function(tip, el) {

    var $tip = $(tip)
    var $el = $(el)

    var tip_width = $tip.width(),
        tip_height = $tip.height(),
        el_width = $el.width(),
        el_height = $el.height(),
        client_width = document.body.clientWidth,
        gap = 20

    var top_gap = $el.offset().top - $("body").scrollTop() - 40,
        left_gap = $el.offset().left - $("body").scrollLeft(),
        right_gap = client_width - left_gap - el_width

    if(top_gap > tip_height + gap && left_gap > tip_width/2 + gap && right_gap > tip_width/2 + gap){
      return 'top'
    }
    if(top_gap > tip_height/2){
      if(right_gap > tip_width + gap){
        return 'right'
      } else if(left_gap > tip_width + gap) {
        return 'left'
      }
    }
    return 'bottom'
  }
  , template: '<div class="popover editpop"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  , contentTemplate: '<form method="post"><div class="control-group"></div><button type="submit" class="btn btn-success btn-block btn-small">Apply</button></form>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Editpop.prototype = $.extend({}, $.fn.popover.Constructor.prototype)

  Editpop.prototype.constructor = Editpop

  Editpop.prototype.getDefaults = function () {
    return Editpop.DEFAULTS
  }

  Editpop.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title').html('<button class="close" data-dismiss="editpop">&times;</button>' + title)
    $tip.find('.popover-content').html(content)

    this.loadContent()

    $tip.removeClass('fade top bottom left right in')

    //bind events
    $tip.find('[data-dismiss=editpop]').click($.proxy(this.hide, this))

    var me = ((Math.random() * 10) + "").replace(/\D/g, '')
    var click_event_ns = "click." + me + " touchstart." + me
    var that = this

    // $('body').on(click_event_ns, function(e) {
    //   if ( !$tip.has(e.target).length ) { that.hide() }
    // })

    $(document).bind('keyup.editpop', function(e) {
      if (e.keyCode == 27) { that.hide() }
      return
    })
  }

  Editpop.prototype.getContent = function () {
    return this.options.contentTemplate
  }

  Editpop.prototype.loadContent = function () {
    var $tip = this.$tip
    var $el = this.$element
    var $form = $tip.find('.popover-content > form')

    $form.attr('action', $el.data('editable-action'))

    var fieldname = $el.data('editable-field')
    $.ajax({
      url: $el.data('editable-loadurl'),
      success: function(content){
        alert(content)
        $form.find('.control-group').html($(content).find('#div_id_' + fieldname + ' > .controls'))
      },
      dataType: 'html'
    })
  }

  Editpop.prototype.hasContent = function () {
    return this.getTitle()
  }

  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.editpop

  $.fn.editpop = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.editpop')
      var options = typeof option == 'object' && options

      if (!data) $this.data('bs.editpop', (data = new Editpop(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.editpop.Constructor = Editpop


  // POPOVER NO CONFLICT
  // ===================

  $.fn.editpop.noConflict = function () {
    $.fn.editpop = old
    return this
  }

  $(function(){
    $('.editable-handler').editpop();
  })

}(window.jQuery);
