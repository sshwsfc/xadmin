/* ==========================================================
 * bootstrapx-clickover.js
 * https://github.com/lecar-red/bootstrapx-clickover
 * version: 1.0
 * ==========================================================
 *
 * Based on work from Twitter Bootstrap and 
 * from Popover library http://twitter.github.com/bootstrap/javascript.html#popover
 * from the great guys at Twitter.
 *
 * Untested with 2.1.0 but should worked with 2.0.x
 *
 * ========================================================== */
!function($) {
  "use strict"

  /* class definition */
  var Clickover = function ( element, options ) {
    // local init
    this.cinit('clickover', element, options );
  }

  Clickover.prototype = $.extend({}, $.fn.popover.Constructor.prototype, {

    constructor: Clickover

    , cinit: function( type, element, options ) {
      this.attr = {};

      // choose random attrs instead of timestamp ones
      this.attr.me = ((Math.random() * 10) + "").replace(/\D/g, '');
      this.attr.click_event_ns = "click." + this.attr.me + " touchstart." + this.attr.me;

      if (!options) options = {};

      options.trigger = 'manual';

      // call parent
      this.init( type, element, options );

      // setup our own handlers
      this.$element.on( 'click', this.options.selector, $.proxy(this.clickery, this) );

      // soon add click hanlder to body to close this element
      // will need custom handler inside here
    }
    , clickery: function(e) {
      // clickery isn't only run by event handlers can be called by timeout or manually
      // only run our click handler and  
      // need to stop progration or body click handler would fire right away
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // set popover's dim's
      this.options.width  && this.tip().find('.popover-inner').width(  this.options.width  );
      this.options.height && this.tip().find('.popover-inner').height( this.options.height );

      // set popover's tip 'id' for greater control of rendering or css rules
      this.options.tip_id     && this.tip().attr('id', this.options.tip_id );

      // add a custom class
      this.options.class_name && this.tip().addClass(this.options.class_name);

      // we could override this to provide show and hide hooks 
      this[ this.isShown() ? 'hide' : 'show' ]();

      // if shown add global click closer
      if ( this.isShown() ) {
        var that = this;

        // close on global request, exclude clicks inside clickover
        this.options.global_close &&
          $('body').on( this.attr.click_event_ns, function(e) {
            if ( !that.tip().has(e.target).length ) { that.clickery(); }
          });

        this.options.esc_close && $(document).bind('keyup.clickery', function(e) {
            if (e.keyCode == 27) { that.clickery(); }
            return;
        });

        // first check for others that might be open
        // wanted to use 'click' but might accidently trigger other custom click handlers
        // on clickover elements 
        !this.options.allow_multiple &&
            $('[data-clickover-open=1]').each( function() { 
                $(this).data('clickover') && $(this).data('clickover').clickery(); });

        // help us track elements w/ open clickovers using html5
        this.$element.attr('data-clickover-open', 1);

        // if element has close button then make that work, like to
        // add option close_selector
        this.tip().on('click', '[data-dismiss="clickover"]', $.proxy(this.clickery, this));

        // trigger timeout hide
        if ( this.options.auto_close && this.options.auto_close > 0 ) {
          this.attr.tid = 
            setTimeout( $.proxy(this.clickery, this), this.options.auto_close );  
        }

        // provide callback hooks for post shown event
        typeof this.options.onShown == 'function' && this.options.onShown.call(this);
        this.$element.trigger('shown');
      }
      else {
        this.$element.removeAttr('data-clickover-open');

        this.options.esc_close && $(document).unbind('keyup.clickery');

        $('body').off( this.attr.click_event_ns ); 

        if ( typeof this.attr.tid == "number" ) {
          clearTimeout(this.attr.tid);
          delete this.attr.tid;
        }

    // provide some callback hooks
        typeof this.options.onHidden == 'function' && this.options.onHidden.call(this);
        this.$element.trigger('hidden');
      }
    }
    , isShown: function() {
      return this.tip().hasClass('in');
    }
    , resetPosition: function() {
        var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip.css(tp)
      }
    }
    , debughide: function() {
      var dt = new Date().toString();

      console.log(dt + ": clickover hide");
      this.hide();
    }
  })

  /* plugin definition */
  /* stolen from bootstrap tooltip.js */
  $.fn.clickover = function( option ) {
    return this.each(function() {
      var $this = $(this)
        , data = $this.data('clickover')
        , options = typeof option == 'object' && option

      if (!data) $this.data('clickover', (data = new Clickover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.clickover.Constructor = Clickover

  // these defaults are passed directly to parent classes
  $.fn.clickover.defaults = $.extend({}, $.fn.popover.defaults, {
    trigger: 'manual',
    auto_close:   0, /* ms to auto close clickover, 0 means none */
    global_close: 1, /* allow close when clicked away from clickover */
    esc_close:    1, /* allow clickover to close when esc key is pressed */
    onShown:  null,  /* function to be run once clickover has been shown */
    onHidden: null,  /* function to be run once clickover has been hidden */
    width:  null, /* number is px (don't add px), null or 0 - don't set anything */
    height: null, /* number is px (don't add px), null or 0 - don't set anything */
    tip_id: null,  /* id of popover container */
    class_name: 'clickover', /* default class name in addition to other classes */
    allow_multiple: 0 /* enable to allow for multiple clickovers to be open at the same time */
  })

}( window.jQuery );

;(function($){
  "use strict"

  var Editable = function(element, options) {
    var that = this;

    this.el = $(element);
    var el = this.el;

    this.$text = el.parent().parent().find('.editable-field');
    this.field = el.data('field');

    this.$tip = el.find('.popover.editable');
    this.$form = el.find('form');
    this.$mask = $('<div class="mask"><div class="progress progress-striped active"><div class="bar"></div></div></div>');
    el.find('.popover-content').prepend(this.$mask);
    this.rendered_form = false;

    this.einit('editable', el.find('>a'), options );
  }
  Editable.prototype = $.extend({}, $.fn.clickover.Constructor.prototype, {

    constructor: Editable

    , einit: function( type, element, options ) {
      this.cinit(type, element, options);

      this.$form.submit($.proxy(this.submit, this));
    }
    , getPlacement: function(){
      var $tip = this.tip();
      var $el = this.$element;

      var tip_width = $tip.width(),
          tip_height = $tip.height(),
          el_width = $el.width(),
          el_height = $el.height(),
          client_width = document.body.clientWidth,
          gap = 20;

      var top_gap = $el.offset().top - $("body").scrollTop() - 40,
          left_gap = $el.offset().left - $("body").scrollLeft(),
          right_gap = client_width - left_gap - el_width;

      if(top_gap > tip_height + gap && left_gap > tip_width/2 + gap && right_gap > tip_width/2 + gap){
        return 'top';
      }
      if(top_gap > tip_height/2){
        if(right_gap > tip_width + gap){
          return 'right';
        } else if(left_gap > tip_width + gap) {
          return 'left';
        }
      }
      return 'bottom';
    }  
    , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        $tip
          .detach()
          .css({ top: 0, left: 0, display: 'block' })
          .insertAfter(this.$element)

        placement = this.getPlacement();

        inside = /in/.test(placement)
        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .offset(tp)
          .addClass(placement)
          .addClass('in')

        var first = this.$form.find('input,textarea,select').first();
        if(first) first.focus();
      }
    }
    , setContent: function () {
      if(!this.rendered_form){
        this.$form.exform();
        this.rendered_form = true;
      }
      this.$tip.removeClass('fade in top bottom left right')
    }
    , submit: function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        $.when(this.save())
        .done($.proxy(function(data) {
          this.$mask.hide();
          if(data['result'] != 'success' && data['errors']){
            var err_html = [];
            for (var i = data['errors'].length - 1; i >= 0; i--) {
              var e = data['errors'][i];
              for (var j = e['errors'].length - 1; j >= 0; j--) {
                err_html.push('<span class="help-inline error">'+e['errors'][j]+'</span>');
              }
            }
            this.$form.find(".control-group").addClass('error');
            this.$form.find('.controls').append(err_html.join('\n'));
          } else {
            this.$text.html(data['new_html'][this.field]);
            if(this.isShown()){
              this.clickery();
            }
          }
        }, this))
        .fail($.proxy(function(xhr) {
          this.$mask.hide();
          alert(typeof xhr === 'string' ? xhr : xhr.responseText || xhr.statusText || 'Unknown error!'); 
        }, this));
    }
    , save: function(newValue) {

      this.$form.find('.control-group').removeClass('error');
      this.$form.find('.controls .help-inline.error').remove();

      this.$mask.show();

      var off_check_box = Object();
      this.$form.find('input[type=checkbox]').each(function(){
        if(!$(this).attr('checked')){
          off_check_box[$(this).attr('name')] = '';
        }
      })

      return $.ajax({
        data: [this.$form.serialize(), $.param(off_check_box)].join('&'),
        url: this.$form.attr('action'),
        type: "POST",
        dataType: 'json',
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.getCookie('csrftoken'));
        }
      })
    }, 
  })

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

  $.fn.editable.Constructor = Editable

  // these defaults are passed directly to parent classes
  $.fn.editable.defaults = $.extend({}, $.fn.clickover.defaults, {
    placement: 'top'
  })

  $(function(){
    $('.editable-handler').editable();
  })

})(window.jQuery)