 $( document ).ready(function() {
    $("#desc").hide();
    $("#learned").hide();
     var words = [];
     var descs = [];
     var id = -1;
     var index = 0;
     var id_start_index = "word_text_".length;
     var PAGE_SIZE = 30;
     var max = PAGE_SIZE;
     var page = 0;
     
     query_next_page(true);

     $("#dict_button").click(function(){
         $("#desc").show();
     });
     
     $("#next").click(function(){
         if(index >= max) return ;
         index++;
         $("#word").html(words[index]);
         $("#desc").html(descs[index]);
         $("#desc").hide();
         $("#delword").show();
         $("#learned").hide();
         id = words[index].id.substr(id_start_index,10);
         if(index == max - 10){
             query_next_page(false);
         }
     });
     $("#previous").click(function(){
         if(index <= 0) return;
         index--;
         $("#word").html(words[index]);
         $("#desc").html(descs[index]);
         $("#desc").hide();
         $("#delword").show();
         $("#learned").hide();
         id = words[index].id.substr(id_start_index,10);
     });
     $("#delword").click(function(){
         $.ajax({
          type: "POST",
          url: "http://eowp.alc.co.jp/wordbook/ej",
          data: {textfield:"",fnc:"delword",wordBkId:id,page:1,col:1,sort:2},
          success: function(){
              $("#learned").show();
              $("#delword").hide();

          }
        });
         
     });
     function query_next_page(first_page){
         page++;
         var url = "http://eowp.alc.co.jp/wordbook/ej?page=" + page + "&col=2&sort=2";
         $.get(url , function( data ) {
             var el = $(data);

             push_randomly(el);

             max = PAGE_SIZE * page;
             if(first_page){
                 $("#word").html(words[index]);
                 $("#desc").html(descs[index]);
                 id = words[index].id.substr(id_start_index,10);
             }
         });
         
     }
     
     function push_randomly(el){

         var elems = $("[id*='word_text']",el);
         var len = elems.length;
         var indexes = get_shuffled_indexes(len);

         for(var i = 0; i < len; i++){
             words.push(elems.get(indexes[i]));
         }
         elems = $("[id*='word_desc']",el)
         for(var i = 0; i < len; i++){
             descs.push(elems.get(indexes[i]));
         }
     }
     function get_shuffled_indexes(length){
         var indexes = [];
         for(var i = 0; i < length; i++){
             indexes[i] = i;
         }
         for(var l,o,r = length; r > 0; 
             l = Math.floor(Math.random() * r),
             o = indexes[l],
             indexes[l] = indexes[--r],
             indexes[r] = o);
         return indexes;
     }
 });