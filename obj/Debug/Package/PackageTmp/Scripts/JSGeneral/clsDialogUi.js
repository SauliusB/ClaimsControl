/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
/// <reference path="Server.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="Validation.js" />
//var oDATA=new ObjectsRegistrator();
/*
Dialogai reikalingi:
1. Naujo iraso sukurimui
2. Iraso redagavimui
3. Confirmacijom, alertams, info blokams
4. Inputams
*/

var DIALOG=new clsDialogUi();

$(document).ready(function () {
   $("#dialog:ui-dialog").dialog("destroy");
   $('.selector').click(function () {
      //DIALOG.Confirm("Ar tu tuo tikras?", "Super program", CallThisBack);
      DIALOG.NewRecord(CallThisBack);
      //DIALOG.fnAlert("bla","Super program");
   });
});

function clsDialogUi() {
   this.Alert=_fnAlert;
   this.NewRecord=_fnNewRecord;
   this.Confirm=_fnConfirm;
   this.CallBack;
   var result;
   //----------------------Funkcijos-----------------------------------------------------------------------------------------------------
   function _fnNewRecord(fnCallBack) {
      //   function _fnNewRecord(Title, Msg, Cols, Ctitles, CallBack) {
      //      dlgNewRecordOpt.title=Title;
      //      var HTML="<>"; //Msg+'<>'
      //      for(var i=0; i<Cols.length; i++) {
      //         HTML+="<label for='"+Cols[i].FName+"'>"+Ctitles[i].sTitle+"</label><input type='text' name='"+Cols[i].FName+"' id='"+Cols[i].FName+"' class='text ui-widget-content ui-corner-all'/>"
      //      }
      //      HTML+=Msg+"<fieldset><legend>"+Title+"</legend>"+HTML+"</fieldset>'";
      //      dlgNewRecordOpt.title=title; this.CallBack=fnCallBack; DIALOG.result=0;
      //      var $dialog=$('<div></div>').html(HTML).dialog(dlgNewRecordOpt).dialog('open');
      //Isrenka validate-dialog
      var html='<p class="validateTips">All form fields are required.</p>';
      html+='<form id="dialog-form-validate">';
      html+='<fieldset>';
      html+='<label for="thename">Name</label>';
      html+='<input type="text" name="thename" id="thename" class="validate-dialog text ui-widget-content ui-corner-all" />';
      html+='<label for="email">Email</label>';
      html+='<input type="text" name="email" id="email" value="" class="validate-dialog text ui-widget-content ui-corner-all" />';
      html+='<label for="password">Password</label>';
      html+='<input type="password" name="password" id="password" value="" class="validate-dialog text ui-widget-content ui-corner-all" />';
      html+='</fieldset>';
      html+='</form>';

      this.CallBack=fnCallBack; DIALOG.result=0;
      $('<div></div>').html(html).dialog(dlgNewRecordOpt).dialog('open');

      return false; // prevent the default action, e.g., following a link
   } //
   function _fnAlert(msg, title, timeout) {
      dlgAlertOpt.title=title;
      var $dialog=$('<div></div>').html(msg).dialog(dlgAlertOpt).dialog('open');
      var t=$(this);
   }
   function _fnConfirm(msg, title, CallBackOnYes) {
      dlgConfirmOpt.title=title; this.CallBack=CallBackOnYes; DIALOG.result=0;
      $('<div></div>').html(msg).dialog(dlgConfirmOpt).dialog('open');
   }
   //----------------------Options-----------------------------------------------------------------------------------------------------
   var dlgConfirmOpt={
      autoOpen: false, height: 'auto', width: 350, modal: true,
      buttons: {
         "Patvirtinti": function () { DIALOG.result=1; $(this).dialog("close"); },
         "Atšaukti": function () { DIALOG.result=0; $(this).dialog("close"); }
      },
      close: function () { if(DIALOG.result===1) { if(DIALOG.CallBack) { DIALOG.CallBack(); } } }
   }
   var dlgNewRecordOpt={
      autoOpen: false, height: 'auto', width: 465, modal: true,
      buttons: {
         "Išsaugoti": function () { if(DialogInputsAreValid($("#dialog-form-validate"))) { $(this).dialog("close"); } },
         "Atšaukti": function () { DIALOG.result=0; $(this).dialog("close"); }
      },
      close: function () {
         if(DIALOG.result===1) { DIALOG.CallBack(); alert("jo"); }
         $(this).remove(); $(".validity-modal-msg").remove();
         //allFields.val("").removeClass("ui-state-error");
      }
   }
   var dlgAlertOpt={
      autoOpen: false, height: 'auto', width: 250, modal: true,
      buttons: { "Gerai": function () { $(this).dialog("close"); } }
   }
   function fnResult(Result) { alert(Result); }
}
function DialogInputsAreValid(frm) {
   var reNumber=new RegExp("'number'");
   var reDate=new RegExp("'date'");
   //reNumber.test(text)
   $.validity.setup({ outputMode: "modal" });
   $.validity.start();
   $(frm).children().find(".validate-dialog").each(function () {
      var child=$(this);
      //alert(child.val()+" "+child.attr("id"));
      //if(reDate.test("require().match('date').lessThanOrEqualTo(new Date())")) {child.val(child.val().replace(/\W|-|\//g,"/")); }
      if(reNumber.test("require().match('number').lessThanOrEqualTo(100)")) { child.val(child.val().replace(/,/g, ".")); }

      eval("child."+"require().match('number').lessThanOrEqualTo(100)");
   });
   var ValRes=$.validity.end();
   if(ValRes.valid) DIALOG.result=1; else { DIALOG.result=0; }
   return ValRes.valid;
}