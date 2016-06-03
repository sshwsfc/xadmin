
;(function($){
	 $.fn.exform.renders.push(function(f){
         if($.fn.wysiwyg){
           f.find('.wysiwyg').each(function(){
               var $el = $(this);
               $el.wysiwyg();
               $el.closest('form').submit(function(){
            	   $($el.data('input')).val($el.cleanHtml());
               });
               
           })
       }});

})(jQuery)
