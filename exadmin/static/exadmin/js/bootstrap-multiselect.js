/**
 * bootstrap-multiselect.js 1.0.0
 * https://github.com/davidstutz/bootstrap-multiselect
 * 
 * Copyright 2012 David Stutz 
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
!function ($) {

	"use strict"; // jshint ;_;

	function Multiselect(select, options) {
		
		this.options = this.getOptions(options);
		this.select = $(select);
		this.container = $(this.options.container)
				.append('<button style="width:' + this.options.width + '" class="dropdown-toggle ' + this.options.button + '" data-toggle="dropdown">' + this.options.text($('option:selected', select)) + ' <b class="caret"></b></button>')
				.append('<ul class="dropdown-menu"></ul>');
		
		// Manually add the multiple attribute, if its not already set.
		if (!this.select.attr('multiple')) {
			this.select.attr('multiple', true);
		}
		
		// Build the dropdown.
		$('option', this.select).each($.proxy(function(index, element) {
			if ($(element).is(':selected')) {
				$(element).attr('selected', true);
			}
			
			$('ul', this.container).append('<li><a href="#" style="padding:0;"><label style="margin:0;padding: 3px 20px 3px 20px;width:100%;height:100%;cursor:pointer;"><input style="margin-bottom:5px;" type="checkbox" value="' + $(element).val() + '" /> ' + $(element).text() + '</label</a></li>');
			
			var selected = $(element).attr('selected') || false;
			var checkbox = $('ul li input[value="' + $(element).val() + '"]', this.container);
				
			checkbox.attr('checked', selected);
			
			if (selected) {
				checkbox.parents('li').addClass('active');
			}
		}, this));
		
		this.select.hide()
			.after(this.container);
		
		// Bind the change event on the dropdown elements.
		$('ul li input[type="checkbox"]', this.container).on('change', $.proxy(function(event) {
			var checked = $(event.target).attr('checked') || false;
			
			if (checked) {
				$(event.target).parents('li').addClass('active');
			}
			else {
				$(event.target).parents('li').removeClass('active');
			}
			
			$('option[value="' + $(event.target).val() + '"]', this.select).attr('selected', checked);
			
			$('button', this.container).html(this.options.text($('option:selected', this.select)) + ' <b class="caret"></b>');
		}, this));
		
		$('ul li a', this.container).on('click', function(event) {
			event.stopPropagation();
		});
	};

	Multiselect.prototype = {
		
		defaults: {
			button: 'btn',
			width: 'auto',
			// Default text function will either print 'None selected' in case no option is selected,
			// or a list of the selected options up to a length of 3 selected options.
			// If more than 3 options are selected, the number of selected options is printed.
			text: function(options) {
				if (options.length == 0) {
					return 'None selected';
				}
				else if (options.length > 3) {
					return options.length + ' selected';
				}
				else {
					var selected = '';
					options.each(function() {
						selected += $(this).text() + ', ';
					});
					return selected.substr(0, selected.length -2);
				}
			},
			container: '<div class="btn-group" />',
		},

		constructor: Multiselect,
	
		reset: function() {
			
		},
		
		// Destroy - unbind - the plugin.
		destroy: function() {
			this.container.remove();
			this.select.show();
		},
		
		// Get options by merging defaults and given options.
		getOptions: function(options) {
			return $.extend({}, this.defaults, options);
		}
	};
	
	$.fn.multiselect = function (option) {
		return this.each(function () {
			var data = $(this).data('multiselect'),
				options = typeof option == 'object' && option;
		
			if (!data) {
				$(this).data('multiselect', (data = new Multiselect(this, options)));
			}
			
			if (typeof option == 'string') {
				data[option]();
			}
		});
	}
}(window.jQuery);