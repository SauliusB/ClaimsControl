$(function() {

   $('select#speedA').selectmenu();

   $('select#speedAa').selectmenu({ maxHeight: 150 });

   $('select#speedB').selectmenu({
      width: 300,
      format: addressFormatting
   });

   $('select#speedC').selectmenu({ style: 'dropdown' });

   $('select#speedD').selectmenu({
      style: 'dropdown',
      menuWidth: 400,
      format: addressFormatting
   });

   $('select#files, select#filesC').selectmenu({
      icons: [
					{ find: '.script', icon: 'ui-icon-script' },
					{ find: '.image', icon: 'ui-icon-image' }
				]
   });

   $('select#filesB').selectmenu({
      icons: [
					{ find: '.video' },
					{ find: '.podcast' },
					{ find: '.rss' }
				]
   });


});


//a custom format option callback
var addressFormatting=function(text) {
   var newText=text;
   //array of find replaces
   var findreps=[
				{ find: /^([^\-]+) \- /g, rep: '<span class="ui-selectmenu-item-header">$1</span>' },
				{ find: /([^\|><]+) \| /g, rep: '<span class="ui-selectmenu-item-content">$1</span>' },
				{ find: /([^\|><\(\)]+) (\()/g, rep: '<span class="ui-selectmenu-item-content">$1</span>$2' },
				{ find: /([^\|><\(\)]+)$/g, rep: '<span class="ui-selectmenu-item-content">$1</span>' },
				{ find: /(\([^\|><]+\))$/g, rep: '<span class="ui-selectmenu-item-footer">$1</span>' }
			];

   for(var i in findreps) {
      newText=newText.replace(findreps[i].find, findreps[i].rep);
   }
   return newText;
}

$("#to").autocomplete({

   //define callback to format results  
   
   source: function(req, add) {
      //pass request to server  
      $.getJSON("friends.php?callback=?", req, function(data) {
         //create array for response objects  
         var suggestions=[];
         //process response  
         $.each(data, function(i, val) {
            suggestions.push(val.name);
         });
         //pass array to callback  
         add(suggestions);
      });
   }






});