
+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Editpop = function (element, options) {
    this.einit('editpop', element, options)
  }

  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Editpop.prototype = $.extend({}, $.fn.popover.Constructor.prototype)

  Editpop.prototype.constructor = Editpop

  Editpop.prototype.einit = function (type, element, options) {
    this.init(type, element, options)
    this.content = null
    this.$element.on('click.' + this.type, $.proxy(this.beforeToggle, this))

    this.$text = this.$element.parent().parent().find('.editable-field')
    this.field = this.$element.data('editable-field')
  }

  Editpop.prototype.getDefaults = function () {
    return Editpop.DEFAULTS
  }

  Editpop.prototype.beforeToggle = function() {
    if(this.content == null){
      var $el = this.$element
      var that = this

      $el.find('>i').removeClass('icon-edit').addClass('icon-spinner icon-spin')
      $.ajax({
        url: $el.data('editable-loadurl'),
        success: function(content){
          $el.find('>i').removeClass('icon-spinner icon-spin').addClass('icon-edit')
          that.content = content
          that.toggle()
        },
        dataType: 'html'
      })
    } else {
      this.toggle()
    }
  }

  Editpop.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()

    $tip.find('.popover-title').html('<button class="close" data-dismiss="editpop">&times;</button>' + title)
    $tip.find('.popover-content').html(this.content)

    var $form = $tip.find('.popover-content > form')
    $form.exform()
    $form.submit($.proxy(this.submit, this))

    this.$form = $form
    this.$mask = $('<div class="mask"><h2 style="text-align:center;"><i class="icon-spinner icon-spin icon-large"></i></h2></div>')
    $tip.find('.popover-content').prepend(this.$mask)

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

  Editpop.prototype.hasContent = function () {
    return this.getTitle() || this.content
  }

  Editpop.prototype.submit = function(e) {
      e.stopPropagation()
      e.preventDefault()
      
      $.when(this.save())
      .done($.proxy(function(data) {
        this.$mask.hide()
        if(data['result'] != 'success' && data['errors']){
          var err_html = []
          for (var i = data['errors'].length - 1; i >= 0; i--) {
            var e = data['errors'][i]
            for (var j = e['errors'].length - 1; j >= 0; j--) {
              err_html.push('<span class="help-block error">'+e['errors'][j]+'</span>')
            }
          }
          this.$form.find(".control-group").addClass('has-error')
          this.$form.find('.controls').append(err_html.join('\n'))
        } else {
          this.$text.html(data['new_html'][this.field])
          this.hide()
        }
      }, this))
      .fail($.proxy(function(xhr) {
        this.$mask.hide()
        alert(typeof xhr === 'string' ? xhr : xhr.responseText || xhr.statusText || 'Unknown error!');
      }, this))
  }

  Editpop.prototype.save = function(newValue) {
    this.$form.find('.control-group').removeClass('has-error')
    this.$form.find('.controls .help-block.error').remove()

    this.$mask.show()

    var off_check_box = Object();
    this.$form.find('input[type=checkbox]').each(function(){
      if(!$(this).attr('checked')){
        off_check_box[$(this).attr('name')] = ''
      }
    })

    return $.ajax({
      data: [this.$form.serialize(), $.param(off_check_box)].join('&'),
      url: this.$form.attr('action'),
      type: "POST",
      dataType: 'json',
      beforeSend: function(xhr, settings) {
          xhr.setRequestHeader("X-CSRFToken", $.getCookie('csrftoken'))
      }
    })
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

  $.fn.editpop.defaults = $.extend({} , $.fn.popover.defaults, {
    container: 'body'
  , placement: 'top'
  , trigger: 'manual'
  , template: '<div class="popover editpop editable"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


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
