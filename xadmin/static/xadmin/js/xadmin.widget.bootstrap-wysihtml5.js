
;(function($){
	 $.fn.exform.renders.push(function(f){
         if($.fn.wysihtml5){
           f.find('.bootstrapwysihtml5editor').each(function(){
               var $el = $(this);
               $el.wysihtml5();
           })
       }});

})(jQuery)
