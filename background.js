 $( document ).ready(function() {
    $("#desc").hide();
    $("#learned").hide();
     var words = [];
     var descs = [];
     var id = -1;
     var index = 0;
     var id_start_index = "word_text_".length;
     var PAGE_SIZE = 30;
     var max = 0;
     var page = 0;
     
     
     get_first_page();


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
         save_status();
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
         save_status();
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
        save_status();
     });
     
     function init(){
         
        
         if( words.length == 0 || descs.length == 0){
             query_next_page(true);
         }else{
             show_words_and_desc();   
         }
     }
     
     function query_next_page(first_page){
         page++;
         var url = "http://eowp.alc.co.jp/wordbook/ej?page=" + page + "&col=2&sort=2";
         
         $.get(url , function( data ) {
             var el = $(data);

             push_randomly(el);

             max += PAGE_SIZE;
             if(first_page){
                 show_words_and_desc();
//                          //alert(data);
//                 $("#word").html(words[index]);
//                 $("#desc").html(descs[index]);
//                 id = words[index].id.substr(id_start_index,10);
                 save_max_page(el);
             }
         });
         
     }
     
     function show_words_and_desc(){
         $("#word").html(words[index]);
         $("#desc").html(descs[index]);
         id = words[index].id.substr(id_start_index,10);
         
     }
     
     //TODO need to change words/descs to array that holds only string.
     // Both contains jquery object but chrome storage seems to convert data to something.
     function save_status(){
//         chrome.storage.sync.set({index: 0 }, function() {});
//         chrome.storage.sync.set({words: words }, function() {});
//         chrome.storage.sync.set({descs: descs}, function() {});         
     }
     function save_max_page(el){
         var elems = $("[class='bold']",el);
         var word_count = elems.get(0).innerHTML;
         var max_page = Math.floor(word_count / PAGE_SIZE ) + 1;
         chrome.storage.sync.set({max: max_page }, function() {});

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
     
     function get_first_page(){
         chrome.storage.sync.get("max",function(value){ 
             page = (value.max == undefined) ? 0 : value.max;
             page = Math.floor(Math.random() * page);
             console.log(page);
             get_saved_status();
             init();
             
         });
     }
     //TODO need to change words/descs to array that holds only string.
     // Both contains jquery object but chrome storage seems to convert data to something.
     function get_saved_status(){
//         chrome.storage.sync.get("index",function(value){ index = (value.index == undefined ? 0 : value.index)});
//         chrome.storage.sync.get("words",function(value){ words = (value.words == undefined ? [] : value.words)});
//         chrome.storage.sync.get("descs",function(value){ descs = (value.descs == undefined ? [] : value.descs)});       
     }
 });