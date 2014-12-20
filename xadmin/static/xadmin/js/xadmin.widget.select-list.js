
;(function($){
	 $.fn.exform.renders.push(function(f){
         if($.fn.select2){
           f.find('.multiselect-list-search').each(function(){
               var $el = $(this);
               var $tbody = $el.closest('table.multiselect-list').find('tbody');
               $el.select2({
            	   multiple:true,
                   minimumInputLength: 1,
                   initSelection: function(elem, callback){
                       callback({id: elem.val(), '__str__': $el.data('label')});
                   },
                   ajax: {
                       url: $el.data('search-url')+$el.data('choices'),
                       dataType: 'json',
                       data: function (term, page) {
                           return {
                               '_q_' : term,
                               '_no_escape':1,
                               '_fields': '__str__,'+$el.data('list-fields'),
                               'p': page - 1
                           };
                       },
                       results: function (data, page) {
                           return {results: data.objects, more: data.has_more};
                       }
                   },
                   formatResult: function(item){
                	   // Instead of adding to list, display it in the list view
                	   
                	   return item['__str__']
                   },
                   formatSelection: function(item){
                	   var id = null;
                	   var builder = "<tr>";
                	   $.each(item,function(name,value){
                		   if (name!='__str__') {
                			   // Replace the name with the input-name
                			   if (name=='action_checkbox') {
                				   value = $($.parseHTML(value));
                				   value.prop('name',$el.data('input-name'));
                				   value.prop('checked',true);
                				   value.attr('checked','checked');
                				   id = value.prop('value');
                				   value = value.prop('outerHTML');
                			   }
                			   builder = builder + "<td>"+value+"</td>";
                		   }
                	   });
                	   builder = builder+"</tr>";
                	   
                	   if (id!=null && $tbody.find('input[value="'+id+'"]').length==0) {
                		   $tbody.append(builder);
                	   }
                	   
                	   // Clear it
                	   setTimeout(function(){$el.select2('val','')},10);
                	   
                	   return item['__str__']
                   }
               });
           })
       }});

})(jQuery)
