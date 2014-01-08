  $(function(){
    $('.segment').each(function(){
      var seg = $(this); 
      var t = seg.find('textarea');
      var text = seg.find('p').text();
    t.on('keyup', function(e){
      var txt = t.val();
      if(text.substr(0, txt.length) != txt){
      t.css('color', 'red');
      } else {
      t.css('color', 'green');
      }
    });
    });
  });