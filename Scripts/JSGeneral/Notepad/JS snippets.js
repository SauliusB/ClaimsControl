

 
      jsonResponse AddNew(string[] Data, string[] Fields, string DataTable, string Ext);
      jsonResponse Edit(Int32 id, string Data, string Field, string DataTable, string Ext);
      jsonResponse Delete(Int32 id, string DataTable, string Ext);
["5", "4", "2011.01.26", "Lt, Miklusënai", "Vagystë", "1", "1", "45554", "0", "Apiplëðë", "Buvo tamsu", "Jonas1 Jonaitis", "Vardenis Pavardenis",
 "{#{:0:}|4-1|TP valdytoj...Vardenis Pavardenis}}#}", 
 "[[122,3,2,500,'khgf',0,0,0,0]]" 
 ]
 Geras
 ["5", "4", "2011.01.26", "Lt, Miklusënai", "Vagystë", "2", "2", "712553", "0", "Apiplëðë", "Buvo tamsu", "Jonas1 Jonaitis", "Vardenis Pavardenis", 
 "{#{:0:}|4-1|TP valdytoj...Vardenis Pavardenis}}#}", 
 "[[122,3,2,500,'khgf',0,...,2,69,'56456',0,0,0,0]]"]
 
 ["5", "4", "2011.01.26", "Lt, Miklusënai", "Vagystë", "2", "2", "712553", "0", "Apiplëðë", "Buvo tamsu", "Jonas1 Jonaitis", "Vardenis Pavardenis", 
 "{#{:0:}|4-1|TP valdytoj...Vardenis Pavardenis}}#}", 
 "[[122,3,2,500,'khgf',0,...,2,69,'56456',0,0,0,0]]"]
 
 6|#|5|#|2011-01-26|#|Lt, Miklusënai|#|Vagystë|#|1|#|1|#|4500|#|0|#|Apiplëðë2|#|Buvo tamsu2|#|Jonas1 Jonaitis|#|Vardenis Pavardenis
 |#|{#{:0:}|5-1|TP valdytojø civilinë atsakomybë|OVJ635|Ergo Lietuva|4500{{FH15 Volvo 160 Vardenis Pavardenis}}#}|#|[[126,1,2,6000,'kkkk',0,0,0,0]]|#|6
 
 
 //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  $('<div class="subdiv">').appendTo("#font-container").html("<p>Lorem ipsum ...</p>")

 $('h2').prependTo($('.container'));
//-------------------------------------------Binding--------------------------------------------------------------------------------------------------------------------------------------------------
The third, and in my opinion the best option is to utilise the awesome power of event delegation. What you do is attach an event handler to any parent, for example if you're going to be dynamically adding list-items to an unordered list, instead of continually re-applying event handlers to each added item you could simply attach the event handler to the parent and then find the target of the event:
//apply events to parent - kad veiktu ant visu vaiku
$('ul').click(function(e){
    var target = e ? e.target : window.event.srcElement;
    if(target.nodeName.toLowerCase() === 'li') {
        // Do Stuff...
    }
})

$(document).bind('click', function(e) {
  var target = e.target;
  if (target.tagName==='A') {
    // do stuff
  }
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
$('a').live('click', function() { blah() });
// or
$(document).delegate('a', 'click', function() { blah() });
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
 $('.course').click(function(e){
    $("#dateForm").fadeOut("slow", function() { // code to run after the fadeOut is complete
        $(this).appendTo(e.target).fadeIn('slow');
    })
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Table selectors
$('#myTableRow').remove();
$("table td img.delete").click(function () {
    $(this).parent().parent().parent().fadeTo(400, 0, function () { 
        $(this).remove();
    });
    return false;
});

$($(this).closest("tr"))
$("someTableSelector").find("tr:gt(0)").remove();//Remove all except first
$("ul li:nth-child(2)").append("<span> - 2nd!</span>");//apends after 2nd child
$("tr:first").css("font-style", "italic");//first tr italic //equivalent to :eq(0)
$('someTableSelector').children( 'tr:not(:first)' ).remove();
$('someTableSelector tr:not(:first)').remove();
$("#tableID tr:gt(0)").remove();
//Add row
$('#myTable tbody>tr:last').clone(true).insertAfter('#myTable tbody>tr:last');
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  // Assign a click event to each div's paragraph
  $("#myDiv1>p").click( function() { $(this).toggleClass("red"); } );
  $("#myDiv2>p").click( function() { $(this).toggleClass("red"); } );

  // Remove and reattach #myDiv1's paragraph
  var myDiv1Para = $('#myDiv1>p').remove();
  myDiv1Para.appendTo('#myDiv1');

  // Detach and reattach #myDiv2's paragraph
  var myDiv2Para = $('#myDiv2>p').detach();
  myDiv2Para.appendTo('#myDiv2');

 $('.pinMark').hide();
$('#myTable tr:last').after('<tr>...</tr><tr>...</tr>');

$("#tableId tr").last().append("<tr><td>New row</td></tr>");

$('table#tbl_sel_drug > tbody > tr:gt(1)').not(':last').remove();
Dude This can solve your problem for deleting all rows except first and last.

$('#my_table > tbody > tr').eq(i-1).after(html);
The indexes are 0 based, so to be the 4th row, you need i-1, since .eq(3) would be the 4th row, you need to go back to the 3rd row (2) and insert .after() that.

$('#my_table > tbody > tr').eq( i ).after(html);
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------