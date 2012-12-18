(function ($) {

    //Editable object
    var Editable = function (element, options) {
        var type, typeDefaults;
        this.$element = $(element);
        this.$valEle = this.$element.parent().parent().find('.editable-field')

        //if exists 'placement' or 'title' options, copy them to data attributes to aplly for popover
        if (options && options.placement && !this.$element.data('placement')) {
            this.$element.attr('data-placement', options.placement);
        }
        if (options && options.title && !this.$element.data('original-title')) {
            this.$element.attr('data-original-title', options.title);
        }

        this.name = this.$element.data().name;
        if (!this.name) {
            $.error('You should define name (or id) for Editable element');
        }

        this.settings = {};

        if($.fn.editable.fields){
            fieldDefaults = ($.fn.editable.fields[this.name]) ? $.fn.editable.fields[this.name] : {};
            this.settings = $.extend(this.settings, fieldDefaults);
        }

        //detect type
        type = (this.settings.type || (options && options.type) || $.fn.editable.defaults.type);
        typeDefaults = ($.fn.editable.types[type]) ? $.fn.editable.types[type] : {};

        //apply options
        this.settings = $.extend(this.settings, $.fn.editable.defaults, $.fn.editable.types.defaults, typeDefaults, options, fieldDefaults, this.$element.data());

        //apply type's specific init()
        this.settings.init.call(this, options);

        //if validate is map take only needed function
        if (typeof this.settings.validate === 'object' && this.name in this.settings.validate) {
            this.settings.validate = this.settings.validate[this.name];
        }

        this.value = this.settings.value;
        //also storing last saved value (initially equals to value)
        this.lastSavedValue = this.value;

        this.$toggle = this.$element;
        this.$element.addClass('editable');

        //bind click event on toggle
        this.$toggle.on('click', $.proxy(this.click, this));
        
        //blocking click event when going from inside popover. all other clicks will close it
        $('body').on('click.editable', '.editable-popover', function (e) { e.stopPropagation(); });

        function finalize() {
            //show emptytext if visible text is empty
            this.handleEmpty();

            //trigger 'init' event: DEPRECATED
            this.$element.trigger('init', this);

            //trigger 'render' event with property isInit = true
            var event = jQuery.Event("render");
            event.isInit = true;
            this.$element.trigger(event, this);
        }

        finalize.call(this);
    };

    Editable.prototype = {
        constructor: Editable,

        click: function (e) {
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
            //hide all other popovers if shown
            $('.popover.editable-popover').find('form').find('button.editable-cancel').click();

            //for the first time create popover
            if (!this.$element.data('popover')) {
                this.$element.popover({
                    trigger  :'manual',
                    placement:'top',
                    html: true,
                    content  :this.settings.loading
                });

                this.$element.data('popover').tip().addClass('editable-popover');
            }

            //show popover
            this.$element.popover('show');
            
            //movepopover to correct position. Refers to bug in bootstrap 2.1.x with popover positioning
            //this.setPosition();
            
            this.$element.addClass('editable-open');
            this.errorOnRender = false;

            //use deffered approach to load data asynchroniously
            $.when(this.settings.renderInput.call(this))
            .then($.proxy(function () {
                var $tip = this.$element.data('popover').tip();

                //render content & input
                this.$content = $(this.settings.formTemplate);
                this.$content.find('div.control-group').prepend(this.$input);

                //invoke form into popover content
                $tip.find('.popover-content p').append(this.$content);
                
                //set position once more. It is required to pre-move popover when it is close to screen edge.
                //this.setPosition();

                //check for error during render input
                if (this.errorOnRender) {
                    this.$input.attr('disabled', true);
                    $tip.find('button.btn-primary').attr('disabled', true);
                    $tip.find('form').submit(function () {
                        return false;
                    });
                    //show error
                    this.enableContent(this.errorOnRender);
                } else {
                    this.$input.removeAttr('disabled');
                    $tip.find('button.btn-primary').removeAttr('disabled');
                    //bind form submit
                    $tip.find('form').submit($.proxy(this.submit, this));
                    //show input (and hide loading)
                    this.enableContent();
                    //set input value
                    this.settings.setInputValue.call(this);
                }

                //bind popover hide on button
                $tip.find('button.editable-cancel').click($.proxy(this.hide, this));

                //bind popover hide on escape
                $(document).on('keyup.editable', $.proxy(function (e) {
                    if (e.which === 27) {
                        e.stopPropagation();
                        this.hide();
                    }
                }, this));
               
                //hide popover on external click
                $(document).on('click.editable', $.proxy(this.hide, this));
                
                //trigger 'shown' event
                this.$element.trigger('shown', this);
            }, this));
        },

        submit: function (e) {
            e.stopPropagation();
            e.preventDefault();

            var error,
                value = this.settings.getInputValue.call(this);

            //validation
            if (error = this.validate(value)) {
                this.enableContent(error);
                return;
            }

            /*jslint eqeqeq: false*/
            if (value == this.value) {
            /*jslint eqeqeq: true*/
                //if value not changed --> do nothing, simply hide popover
                this.hide();
            } else {
                //saving new value
                this.save(value);
            }
        },

        save: function(value) {
            $.when(this.send(value))
            .done($.proxy(function (data) {
                var error, isAjax = (typeof data !== 'undefined');

                //check and run custom success handler
                if (isAjax && typeof this.settings.success === 'function' && (error = this.settings.success.apply(this, arguments))) {
                    //show form with error message
                    this.enableContent(error);
                    return;
                }

                //set new value and text
                this.value = value;
                this.settings.setTextByValue.call(this);

                //to show that value modified but not saved
                if (isAjax) {
                    this.markAsSaved();
                } else {
                    this.markAsUnsaved();
                }

                this.handleEmpty();
                this.hide();

                //trigger 'update' event. DEPRECATED! Use 'render' instead.
                this.$element.trigger('update', this);

                //trigger 'render' event with property isInit = false
                var event = jQuery.Event("render");
                event.isInit = false;
                this.$element.trigger(event, this);
            }, this))
            .fail($.proxy(function(xhr) {
                var msg = (typeof this.settings.error === 'function') ? this.settings.error.apply(this, arguments) : null;
                this.enableContent(msg || xhr.responseText || xhr.statusText);
            }, this));
        },

        send: function(value) {
            this.enableLoading();
            var csrftoken = $.getCookie('csrftoken');

            //send ajax to server and return deferred object
            return $.ajax({
                url     : this.settings.url,
                data    : '{"'+ this.name +'": "'+ value +'"}',
                type    : 'patch',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            });
        },

        hide: function () {
            this.$element.popover('hide');
            this.$element.removeClass('editable-open');
            $(document).off('keyup.editable');
            $(document).off('click.editable');
            
            //returning focus on toggle element
            if (this.settings.enablefocus || this.$element.get(0) !== this.$toggle.get(0)) {
                this.$toggle.focus();
            }
            
            //trigger 'hidden' event
            this.$element.trigger('hidden', this);
        },

        /**
         * show input inside popover
         */
        enableContent:function (error) {
            if (error !== undefined && error.length > 0) {
                this.$content.find('div.control-group').addClass('error').find('span.help-block').text(error);
            } else {
                this.$content.find('div.control-group').removeClass('error').find('span.help-block').text('');
            }
            this.$content.show();
            //hide loading
            this.$element.data('popover').tip().find('.editable-loading').hide();

            //move popover to final correct position
            this.setPosition();

            //TODO: find elegant way to exclude hardcode of types here
            if (this.settings.type === 'text' || this.settings.type === 'textarea') {
                this.$input.focus();
            }
        },

        /**
         * move popover to new position. This function mainly copied from bootstrap-popover.
         */
        setPosition: function () {
            var p = this.$element.data('popover'), $tip = p.tip(), inside = false, placement, pos, actualWidth, actualHeight, tp;

            placement = typeof p.options.placement === 'function' ? p.options.placement.call(p, $tip[0], p.$element[0]) : p.options.placement;

            pos = p.getPosition(true);

            actualWidth = $tip[0].offsetWidth;
            actualHeight = $tip[0].offsetHeight;


            switch (inside ? placement.split(' ')[1] : placement) {
                case 'bottom':
                    tp = {top:pos.top + pos.height, left:pos.left + pos.width / 2 - actualWidth / 2};
                    break;
                case 'top':
                    /* For Bootstrap 2.1.x: 10 pixels needed to correct popover position. See https://github.com/twitter/bootstrap/issues/4665 */
                    if($tip.find('.arrow').get(0).offsetHeight === 10) {actualHeight += 10;}
                    tp = {top:pos.top - actualHeight, left:pos.left + pos.width / 2 - actualWidth / 2};
                    break;
                case 'left':
                    /* For Bootstrap 2.1.x: 10 pixels needed to correct popover position. See https://github.com/twitter/bootstrap/issues/4665 */
                    if($tip.find('.arrow').get(0).offsetWidth === 10) {actualWidth  += 10;}
                    tp = {top:pos.top + pos.height / 2 - actualHeight / 2, left:pos.left - actualWidth};
                    break;
                case 'right':
                    tp = {top:pos.top + pos.height / 2 - actualHeight / 2, left:pos.left + pos.width};
                    break;
            }

            $tip.css(tp).addClass(placement).addClass('in');
        },

        /**
         * show loader inside popover
         */
        enableLoading:function () {
            //enlage loading to whole area of popover
            var $tip = this.$element.data('popover').$tip;
            $tip.find('.editable-loading').css({height:this.$content[0].offsetHeight, width:this.$content[0].offsetWidth});

            this.$content.hide();
            this.$element.data('popover').tip().find('.editable-loading').show();
        },

        handleEmpty:function () {
            return;
            //don't have editalbe class --> it's not link --> toggled by another element --> no need to set emptytext
            if (!this.$element.hasClass('editable')) {
                return;
            }

            if ($.trim(this.$element.text()) === '') {
                this.$element.addClass('editable-empty').text(this.settings.emptytext);
            } else {
                this.$element.removeClass('editable-empty');
            }
        },

        validate:function (value) {
            if (value === undefined) {
                value = this.value;
            }
            if (typeof this.settings.validate === 'function') {
                return this.settings.validate.call(this, value);
            }
        },

        markAsUnsaved:function () {
            if (this.value !== this.lastSavedValue) {
                this.$element.addClass('editable-changed');
            } else {
                this.$element.removeClass('editable-changed');
            }
        },

        markAsSaved:function () {
            this.lastSavedValue = this.value;
            this.$element.removeClass('editable-changed');
        }
    };


    /* EDITABLE PLUGIN DEFINITION
     * ======================= */

    $.fn.editable = function (option) {
        //special methods returning non-jquery object
        var result = {}, args = arguments;
        switch (option) {
            case 'validate':
                this.each(function () {
                    var $this = $(this), data = $this.data('editable'), error;
                    if (data && (error = data.validate())) {
                        result[data.name] = error;
                    }
                });
                return result;

            case 'getValue':
                this.each(function () {
                    var $this = $(this), data = $this.data('editable');
                    if (data && data.value !== undefined && data.value !== null) {
                        result[data.name] = data.value;
                    }
                });
                return result;
                
            case 'submit':  //collects value, validate and submit to server for creating new record
                var config = arguments[1] || {},
                    $elems = this,
                    errors = this.editable('validate'),
                    values;
                
                if(typeof config.error !== 'function') {
                    config.error = function() {};
                } 

                if($.isEmptyObject(errors)) {
                    values = this.editable('getValue'); 
                    if(config.data) {
                        $.extend(values, config.data);
                    }
                    $.ajax({
                        type: 'POST',
                        url: config.url, 
                        data: values, 
                        dataType: 'json'
                    }).success(function(response) {
                        if(typeof response === 'object' && response.id) {
                            $elems.editable('option', 'pk', response.id); 
                            $elems.editable('markAsSaved');
                            if(typeof config.success === 'function') {
                                config.success.apply($elems, arguments);
                            } 
                        } else { //server-side validation error
                            config.error.apply($elems, arguments);
                        }
                    }).error(function(){  //ajax error
                        config.error.apply($elems, arguments);
                    });
                } else { //client-side validation error
                    config.error.call($elems, {errors: errors});
                }
                
                return this;
        }

        //return jquery object
        return this.each(function () {
            var $this = $(this), data = $this.data('editable'), options = typeof option === 'object' && option;
            if (!data) {
                $this.data('editable', (data = new Editable(this, options)));
            }
            
            if(option === 'option') {
                 if(args.length === 2 && typeof args[1] === 'object') {
                     $.extend(data.settings, args[1]); //set options by object
                 } else if(args.length === 3 && typeof args[1] === 'string') {
                    data.settings[args[1]] = args[2]; //set one option
                 } 
            } else if (typeof option === 'string') {
                data[option]();
            }
        });
    };

    $.fn.editable.Constructor = Editable;

    //default settings
    $.fn.editable.defaults = {
        url:null, //url for submit
        type:'text', //input type
        name:null, //field name
        pk:null, //primary key or record
        value:null, //real value, not shown. Especially usefull for select
        emptytext:'Empty', //text shown on empty element
        params:null, //additional params to submit
        send:'auto', // strategy for sending data on server: 'always', 'never', 'auto' (default). 'auto' = 'ifpk' (deprecated)
        autotext:'auto', //can be auto|never|always. Useful for select element: if 'auto' -> element text will be automatically set by provided value and source (in case source is object so no extra request will be performed).
        enablefocus:false, //wether to return focus on link after popover is closed. It's more functional, but focused links may look not pretty
        formTemplate:'<form class="form-inline" autocomplete="off">' + 
                       '<div class="control-group">' + 
                       '&nbsp;<button type="submit" class="btn btn-primary"><i class="fa-icon-ok fa-icon-white"></i></button>&nbsp;<button type="button" class="btn editable-cancel"><i class="fa-icon-ban-circle"></i></button>' + 
                       '<span class="help-block" style="clear: both"></span>' + 
                       '</div>' + 
                       '</form>',
        loading:'<div class="editable-loading"></div>',

        validate:function (value) {
        }, //client-side validation. If returns msg - data will not be sent
        success:function (data) {
        }, //after send callback
        error:function (xhr) {
        }  //error wnen submitting data
    };

    //input types
    $.fn.editable.types = {
        //for all types
        defaults:{
            inputclass:'input-medium',
            placeholder:null,
            init:function (options) {},
            // this function called every time popover shown. Should set value of this.$input
            renderInput:function () {
                this.$input = $(this.settings.template);
                this.$input.addClass(this.settings.inputclass);
                if (this.settings.placeholder) {
                    this.$input.attr('placeholder', this.settings.placeholder);
                }
            },
            setInputValue:function () {
                this.$input.val(this.value);
                this.$input.focus();
            },
            //getter for value from input
            getInputValue:function () {
                return this.$input.val();
            },

            //setting text of element (init)
            setTextByValue:function () {
                this.$valEle.text(this.value);
            },

            //setting value by element text (init)
            setValueByText:function () {
                this.value = $.trim(this.$valEle.text());
            }
        },

        //text
        text:{
            template:'<input type="text">',
            setInputValue:function () {
                this.$input.val(this.value);
                setCursorPosition.call(this.$input, this.$input.val().length);
                this.$input.focus();
            }
        },

        //select
        select:{
            template:'<select></select>',
            source:null,
            prepend:false,
            onSourceReady:function (success, error) {
                // try parse json in single quotes (for double quotes jquery does automatically)
                try {
                    this.settings.source = tryParseJson(this.settings.source, false);
                } catch (e) {
                    error.call(this);
                    return;
                }

                if (typeof this.settings.source === 'string') {
                    var cacheID = this.settings.source + '-' + this.name, cache;

                    if (!$(document).data(cacheID)) {
                        $(document).data(cacheID, {});
                    }
                    cache = $(document).data(cacheID);

                    //check for cached data
                    if (cache.loading === false && cache.source && typeof cache.source === 'object') { //take source from cache
                        this.settings.source = cache.source;
                        success.call(this);
                        return;
                    } else if (cache.loading === true) { //cache is loading, put callback in stack to be called later
                        cache.callbacks.push($.proxy(function () {
                            this.settings.source = cache.source;
                            success.call(this);
                        }, this));

                        //also collecting error callbacks
                        cache.err_callbacks.push($.proxy(error, this));
                        return;
                    } else { //no cache yet, activate it
                        cache.loading = true;
                        cache.callbacks = [];
                        cache.err_callbacks = [];
                    }

                    //options loading from server
                    $.ajax({
                        url:this.settings.source,
                        type:'get',
                        data:{name:this.name},
                        dataType:'json',
                        success:$.proxy(function (data) {
                            this.settings.source = this.settings.doPrepend.call(this, data);
                            cache.loading = false;
                            cache.source = this.settings.source;
                            success.call(this);
                            $.each(cache.callbacks, function () {
                                this.call();
                            }); //run callbacks for other fields
                        }, this),
                        error:$.proxy(function () {
                            cache.loading = false;
                            error.call(this);
                            $.each(cache.err_callbacks, function () {
                                this.call();
                            }); //run callbacks for other fields
                        }, this)
                    });
                } else { //options as json/array

                    //convert regular array to object
                    if ($.isArray(this.settings.source)) {
                        var arr = this.settings.source, obj = {};
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] !== undefined) {
                                obj[i] = arr[i];
                            }
                        }
                        this.settings.source = obj;
                    }

                    this.settings.source = this.settings.doPrepend.call(this, this.settings.source);
                    success.call(this);
                }
            },

            doPrepend:function (data) {
                this.settings.prepend = tryParseJson(this.settings.prepend, true);

                if (typeof this.settings.prepend === 'string') {
                    return $.extend({}, {'':this.settings.prepend}, data);
                } else if (typeof this.settings.prepend === 'object') {
                    return $.extend({}, this.settings.prepend, data);
                } else {
                    return data;
                }
            },

            renderInput:function () {
                var deferred = $.Deferred();
                this.$input = $(this.settings.template);
                this.$input.addClass(this.settings.inputclass);
                this.settings.onSourceReady.call(this, function () {
                        if (typeof this.settings.source === 'object' && this.settings.source != null) {
                            $.each(this.settings.source, $.proxy(function (key, value) {
                                this.$input.append($('<option>', { value:key }).text(value));
                            }, this));
                        }
                        deferred.resolve();
                    }, function () {
                        this.errorOnRender = 'Error when loading options';
                        deferred.resolve();
                    });

                return deferred.promise();
            },

            setValueByText:function () {
                this.value = null; //it's not good to set value by select text. better set NULL
            },

            setTextByValue:function () {
                var deferred = $.Deferred();
                this.settings.onSourceReady.call(this, function () {
                        if (typeof this.settings.source === 'object' && this.value in this.settings.source) {
                            this.$valEle.text(this.settings.source[this.value]);
                        } else {
                            //set empty string when key not found in source
                            this.$valEle.text('');
                        }
                        deferred.resolve();
                    }, function () {
                        this.$valEle.text('Error!');
                        deferred.resolve();
                    });

                return deferred.promise();
            }
        },

        //textarea
        textarea:{
            template:'<textarea rows="8"></textarea>',
            inputclass:'input-medium',
            renderInput:function () {
                this.$input = $(this.settings.template);
                this.$input.addClass(this.settings.inputclass);
                if (this.settings.placeholder) {
                    this.$input.attr('placeholder', this.settings.placeholder);
                }

                //ctrl + enter
                this.$input.keydown(function (e) {
                    if (e.ctrlKey && e.which === 13) {
                        $(this).closest('form').submit();
                    }
                });
            },
            setInputValue:function () {
                this.$input.val(this.value);
                setCursorPosition.apply(this.$input, [this.$input.val().length]);
                this.$input.focus();
            },
            setValueByText:function () {
                var lines = this.$valEle.html().split(/<br\s*\/?>/i);
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = $('<div>').html(lines[i]).text();
                }
                this.value = lines.join("\n");
            },
            setTextByValue:function () {
                var lines = this.value.split("\n");
                for (var i = 0; i < lines.length; i++) {
                    lines[i] = $('<div>').text(lines[i]).html();
                }
                var text = lines.join('<br>');
                this.$valEle.html(text);
            }
        },

        /*
         date
         based on fork: https://github.com/vitalets/bootstrap-datepicker
         */
        date:{
            template:'<input type="text" class="input-medium">',
            //template:'<div style="float: left; padding: 0; margin: 0" class="well"></div>',
            format:'yyyy-mm-dd', //format used for datepicker and sending to server
            viewformat: null,  //used only for showing date
            datepicker:{
                autoclose:false,
                keyboardNavigation:false
            },
            init:function (options) {
                //set popular options directly from settings or data-* attributes
                var directOptions = mergeKeys({}, this.settings, ['format', 'weekStart', 'startView']);
                
                //overriding datepicker config (as by default jQuery merge is not recursive)
                this.settings.datepicker = $.extend({}, $.fn.editable.types.date.datepicker, directOptions, options.datepicker);
                
                //by default viewformat equals to format
                if(!this.settings.viewformat) {
                    this.settings.viewformat = this.settings.datepicker.format;
                }                
            },
            renderInput:function () {
                this.$input = $(this.settings.template);
                this.$input.datepicker(this.settings.datepicker);
            },
            setInputValue:function () {
                this.$input.val(this.value);
                this.$input.datepicker('update', this.value);
            },
            getInputValue:function () {
                return this.$input.val();
            },
            setTextByValue:function () {
                var text = this.settings.converFormat.call(this, this.value, this.settings.format, this.settings.viewformat);    
                this.$valEle.text(text);
            },
            setValueByText:function () {
                var text = $.trim(this.$valEle.text());
                if(!text.length) {
                    return;
                }
                this.value = this.settings.converFormat.call(this, text, this.settings.viewformat, this.settings.format);    
            },
            //helper function to convert date between two formats
            converFormat: function(dateStr, formatFrom, formatTo) {
                if(formatFrom === formatTo) {
                    return dateStr; 
                }
                var dpg = $.fn.datepicker.DPGlobal, 
                    dateObj,
                    lang = (this.settings.datepicker && this.settings.datepicker.language) || 'en';
                formatFrom = dpg.parseFormat(formatFrom);
                formatTo = dpg.parseFormat(formatTo);
                dateObj = dpg.parseDate($.trim(dateStr), formatFrom, lang);
                return dpg.formatDate(dateObj, formatTo, lang);
            }           
        }
    };

    /*
    * ========================== FUNCTIONS ========================
    */
    
    /**
     * set caret position in input
     * see http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
     */
    function setCursorPosition(pos) {
        this.each(function (index, elem) {
            if (elem.setSelectionRange) {
                elem.setSelectionRange(pos, pos);
            } else if (elem.createTextRange) {
                var range = elem.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
        });
        return this;
    }

    /**
     * function to parse JSON in *single* quotes. (jquery automatically parse only double quotes)
     * That allows such code as: <a data-source="{'a': 'b', 'c': 'd'}">
     * safe = true --> means no exception will be thrown
     * for details see http://stackoverflow.com/questions/7410348/how-to-set-json-format-to-html5-data-attributes-in-the-jquery
     */
    function tryParseJson(s, safe) {
        if (typeof s === 'string' && s.length && s.match(/^\{.*\}$/)) {
            if (safe) {
                try {
                    /*jslint evil: true*/
                    s = (new Function('return ' + s))();
                    /*jslint evil: false*/
                } catch (e) {} finally {
                    return s;
                }
            } else {
                /*jslint evil: true*/
                s = (new Function('return ' + s))();
                /*jslint evil: false*/
            }
        }

        return s;
    }

    /**
     * function merges only specified keys
     */
    function mergeKeys(objTo, objFrom, keys) {
        var key, keyLower;
        if (!$.isArray(keys)) {
            return objTo;
        }
        for (var i = 0; i < keys.length; i++) {
            key = keys[i];
            if (key in objFrom) {
                objTo[key] = objFrom[key];
                continue;
            }
            //note, that when getting data-* attributes via $.data() it's converted it to lowercase.
            //details: http://stackoverflow.com/questions/7602565/using-data-attributes-with-jquery
            //workaround is code below.
            keyLower = key.toLowerCase();
            if (keyLower in objFrom) {
                objTo[key] = objFrom[keyLower];
            }
        }
        return objTo;
    }

  $(function(){
    $(".results table .editable-handler").editable({autotext: 'never'});
  });

}(window.jQuery));
