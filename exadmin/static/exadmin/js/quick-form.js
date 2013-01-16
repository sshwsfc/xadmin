
;(function($){

  $('form.widget-form').on('post-success', function(e, data){
    $(this).data('ajaxform').clean()
    $('.alert-success #change-link').attr('href', data['change_url'])
    $('.alert-success').show()
  })

  var AjaxForm = function(element, options) {
    var that = this

    this.el = $(element)
    var el = this.el

    this.$form = el
    this.$mask = $('<div class="mask"><div class="progress progress-striped active"><div class="bar"></div></div></div>')

    el.prepend(this.$mask)
    el.submit($.proxy(this.submit, this))

    this.ainit()
  }

  AjaxForm.prototype = {

    constructor: AjaxForm

    , ainit: function(){
      this.$form.find('input, select, textarea').each(function(){
        var el = $(this)
        if (el.is("[type=checkbox]")) {
          el.data('init-value', el.attr('checked'))
        } else if (el.is("select")) {
          el.data('init-value', el[0].selectedIndex)
        } else {
          el.data('init-value', el.val())
        }
      })
    }

    , clean: function(){
      this.$form.find('input, select, textarea').each(function(){
        var el = $(this)
        if (el.is("[type=checkbox]")) {
          el.removeAttr('checked')
        } else if (el.is("select")) {
          el[0].selectedIndex = el.data('init-value')||0
        } else {
          el.val(el.data('init-value')||'')
        }
        el.change()
      })
    }

    , submit: function(e) {
        e.stopPropagation();
        e.preventDefault();

        $.when(this.save())
        .done($.proxy(function(data) {
          this.$mask.hide();

          this.$form.find('submit, button[type=submit], input[type=submit]').removeClass('disabled');

          if(data['result'] != 'success' && data['errors']){
            var non_fields_errors = []
            for (var i = data['errors'].length - 1; i >= 0; i--) {
              var e = data['errors'][i]
              var errdiv = this.$form.find('#div_' + e['id'])
              if(errdiv.length){
                errdiv.addClass('error')
                var err_html = []
                for (var j = e['errors'].length - 1; j >= 0; j--) {
                  err_html.push('<span id="error_'+j+'_'+ e['id'] +'" class="help-inline error"><strong>'+e['errors'][j]+'</strong></span>')
                }
                errdiv.find('.controls').append(err_html.join('\n'))
              } else {
                non_fields_errors = non_fields_errors.concat(e['errors'])
              }
            }
            if(non_fields_errors.length){
              var err_html = []
              for (var i = non_fields_errors.length - 1; i >= 0; i--) {
                err_html.push('<p class="text-error"><strong>'+e['errors'][i]+'</strong></p>')
              }
              this.$form.prepend(err_html.join('\n'))
            }
          } else {
            this.$form.trigger('post-success', data);
          }
        }, this))
        .fail($.proxy(function(xhr) {
          this.$mask.hide();
          alert(typeof xhr === 'string' ? xhr : xhr.responseText || xhr.statusText || 'Unknown error!'); 
        }, this));
    }
    , save: function(newValue) {

      this.$form.find('.text-error, .help-inline.error').remove();
      this.$form.find('.control-group').removeClass('error');

      this.$mask.show();
      this.$form.find('submit, button[type=submit], input[type=submit]').addClass('disabled');

      var off_check_box = Object();
      // this.$form.find('input[type=checkbox]').each(function(){
      //   if(!$(this).attr('checked')){
      //     off_check_box[$(this).attr('name')] = '';
      //   }
      // })

      return $.ajax({
        data: [this.$form.serialize(), $.param(off_check_box)].join('&'),
        url: this.$form.attr('action'),
        type: "POST",
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        beforeSend: function(xhr, settings) {
            xhr.setRequestHeader("X-CSRFToken", $.getCookie('csrftoken'));
        }
      })
    }, 
  }

  $.fn.ajaxform = function ( option ) {
    var args = Array.apply(null, arguments);
    args.shift();
    return this.each(function () {
      var $this = $(this),
        data = $this.data('ajaxform'),
        options = typeof option == 'object' && option;
      if (!data) {
        $this.data('ajaxform', (data = new AjaxForm(this)));
      }
    });
  };

  $.fn.ajaxform.Constructor = AjaxForm

  $.fn.exform.renders.push(function(f){
    if (f.is('.quick-form')) {
      f.ajaxform()
    }
  })

})(jQuery)