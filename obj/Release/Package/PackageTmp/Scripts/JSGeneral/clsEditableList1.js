/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
/// <reference path="Server.js" />
/// <reference path="clsGrid.js" />


function clsEditableList(ListTitle, _clsOBJByName, GridOpt) {
   if(GridOpt===undefined) { GridOpt={}; GridOpt.RENDER_OPT={}; }
   //GridOpt.RENDER_OPT.sScrollX="99%";
   this.GridOpt=GridOpt;
   this.clsOBJByName=_clsOBJByName;
   this.ListTitle=ListTitle;
   this.RowClicked=_RowClicked;
   this.RowData;
   function _RowClicked(RowData) {
      $('.ui-dialog-buttonpane button').removeClass('ui-state-disabled');
      this.RowData=RowData;
   }
}
//*******************************Redagavimo forma**************************************************************************

clsEditableList.prototype={
   Obj: "SisObjektas",
   GetEditableOpt: function (Action) {
      var t=clsEditableList.prototype.Obj;
      return dlgEditableOpt={
         autoOpen: false, minWidth: 300, width: 465, modal: true, title: t.ListTitle, draggable: false,
         buttons: {
            "Išsaugoti": function () { if(t.fnCheckAndSave(Action)) { DIALOG.result=1; $(this).dialog("close"); } },
            "Atšaukti": function () { DIALOG.result=0; $(this).dialog("close"); }
         },
         close: function () {
            if(DIALOG.result===1) { }  //setTimeout("DIALOG.CallBack();");
            $(this).remove(); $(".validity-modal-msg").remove();
         }
      }
   },
   //clsEditableList.prototype.Show=function () {
   LoadEditableForm: function (LoadTitle, Action) {
      var t=clsEditableList.prototype.Obj;
      var html='<form id="dialog-form-validate-editable">';
      html+='<fieldset class="ui-corner-all"><legend>'+LoadTitle+'</legend>';
      var dlgEditableOpt=t.GetEditableOpt(Action);
      html+=t.GenerateHTML(t.clsOBJByName.SD, Action);
      html+='</fieldset>';
      html+='</form>';
      $('<div></div>').html(html).dialog(dlgEditableOpt).dialog('open'); //LoadFormAccidentsScript();
      t.AddFieldControls(t.clsOBJByName.SD.Cols);
      return false;
   },
   AddFieldControls: function (c) {
      //--------------------pridedami controlai redagavimo formai-------------------------------------------------------------------------
      //--------------------kontroliuoja MyPlugins.js
      //default   minDate: "-3Y", maxDate: 0  dateFormat: 'yy-mm-dd', constrainInput: true,
      //$("#_EndDate").datepicker({ minDate: '-0', maxDate: '+3y' }).ValidateOnBlur({ Allow: 'date' }); // currentText:'Now'
      //ValidateOnBlur({ Allow: 'float' })
      var js='';
      for(var i=0; i<c.length; i++) {
         if(c[i].Valid!=undefined) {
            if(c[i].Valid.Type!=undefined) {
               var ctrl="$('#_"+c[i].FName+"')";
               if(c[i].Valid.Type=='DateCtrl') { js+=ctrl+".datepicker();"; }
               else if(c[i].Valid.Type=='DateNotLessCtrl') { js+=ctrl+".datepicker({minDate:'-0',maxDate:'+5y'});"; }
               else if(c[i].Valid.Type=='DateNotMoreCtrl') { js+=ctrl+".datepicker({minDate:'-5y',maxDate:'+0'});"; }
               if(c[i].Valid.Type=='Year'||c[i].Valid.Type=='YearNotMore'||c[i].Valid.Type=='YearNotLess'||c[i].Valid.Type=='Date'
               ||c[i].Valid.Type=='Integer'||c[i].Valid.Type=='Decimal') { js+=ctrl+".ValidateOnBlur({ Allow: '"+c[i].Valid.Type+"' });"; }
            }
         }
      }
      //eval(js);
      setTimeout(js, 300);
   },
   fnCheckAndSave: function (Action) {
      var t=clsEditableList.prototype.Obj;
      var reNumber=new RegExp("'number'"), reDate=new RegExp("'date'");
      var Data=t.clsOBJByName.Data, DataToSave={ Data: [], Fields: [] }, IsUniqueArr=0;
      //reNumber.test(text)
      $.validity.setup({ outputMode: "modal" });
      $.validity.start();
      $("#dialog-form-validate-editable .validate-dialog").each(function () {
         var child=$(this), FName=child.attr("id").substring(1), ColI=t.clsOBJByName.SD.Cols.FNameIndex(FName); //col=clsOJJByName.SD.Cols;
         var Col=t.clsOBJByName.SD.Cols[ColI];

         if(Col.Valid!=undefined) {
            FUnique=(Col.Valid.IsUnique)?Col.Valid.IsUnique:0; Type=(Col.Valid.Type)?Col.Valid.Type:0;
         } else { FUnique=0; Type=0; }
         var Validity=Col.Validity;

         if(Type==="decimal") { child.val(child.val().replace(/,/g, ".")); }
         eval("child."+Validity);
         IsUniqueArr=(Col.Valid.IsUnique)?Col.Valid.IsUnique:IsUniqueArr;
         var Save=false;
         if(Action=="Add") Save=true; else { if(RowData) { if(child.val()!=RowData[ColI]) Save=true; } } //Redagavimui saugojam tik tuos kurie pasikeite
         if(Save) { DataToSave.Data.push(child.val()); DataToSave.Fields.push(FName); }
      });
      var ValRes=$.validity.end();

      if(IsUniqueArr) {
         var resIsNotUn=IsNotUnique(IsUniqueArr, DataToSave, t.clsOBJByName.SD);
         if(resIsNotUn&&$("#dialog-form-validate-editable legend .error-msg").length==0) {
            //<Vairuotojas> <Petras Petraitis> jau yra įvestas.
            $("#dialog-form-validate-editable legend").after("<div class='error-msg'>"+t.clsOBJByName.SD.Config.Msg.GenName+" "+resIsNotUn+" jau yra įvestas.</div>");
         }
         if(resIsNotUn) ValRes.valid=false;
      }
      //if(ValRes.valid) DIALOG.result=1; else { DIALOG.result=0; }
      if(ValRes.valid) {
         if(Action=="Edit") { DataToSave["id"]=RowData[0]; }
         if (DataToSave.Data.length>0) oGLOBAL.UpdateServer(Action, DataToSave, t.clsOBJByName.SD.Config.tblUpdate, t.fnServerUpdated);
      }
      return ValRes.valid;
      //-------------------------------------------------------
      function IsNotUnique(IsUniqueArr, DataToSave, sd) {
         var GetValueToSave=function (i) {
            var UniqueF=sd.Cols[i].FName, ix=DataToSave.Fields.findIndexByVal(UniqueF);
            return DataToSave.Data[ix];
         }
         var UniqueV=GetValueToSave(IsUniqueArr[0]), NotUniqVals=UniqueV, NotUnique=false;
         for(var i=0; i<sd.Data.length; i++) {
            if(sd.Data[i][IsUniqueArr[0]]==UniqueV) {
               NotUnique=true;
               for(var iU=1; iU<IsUniqueArr.length; iU++) {
                  var UniqueV=GetValueToSave(IsUniqueArr[iU]);
                  NotUniqVals+=' '+UniqueV;
                  if(UniqueV!=sd.Data[i][IsUniqueArr[iU]]) { NotUnique=false; break; }
               } if(NotUnique) break;
            }
         }
         return NotUnique?NotUniqVals:false;
      }
   },
   GenerateHTML: function (sd, Action) {
      var HTML="", FName, Title, Type, el;
      for(var i=0; i<sd.Cols.length; i++) {
         if(sd.Grid.aoColumns[i].bVisible!==undefined) continue;
         FName=sd.Cols[i].FName;
         Title=sd.Grid.aoColumns[i].sTitle?sd.Grid.aoColumns[i].sTitle:"Be pavadinimo";
         Type="text"; Tip=sd.Cols[i].Tip?sd.Cols[i].Tip:"";

         if(sd.Cols[i].Valid) {
            ModelType=sd.Cols[i].Valid;
            if(ModelType.Type==="boolean") { Type="checkbox" }
            else if(ModelType.Type.substring(0, 4)==="Date") { Type="Date" } //DateNotLessCtr ir pan
            else if(ModelType.LenMax) { if(ModelType.LenMax>100) { Type="textarea" } }
         } else { if(sd.Cols[i].List) { Type="List"; } }

         if(Type=="checkbox") {
            el="<input type='checkbox'  id='_"+FName+"' name='"+FName+"' value='"+FName+"'><label class='dialog-form-label label-forChk' for='_"+FName+"'>"+Title+"</label>";
         } else if(Type=="textarea") {
            el="<div><label for='"+FName+"' class='dialog-form-label'>"+Title+"</label></div><textarea rows=2 cols=60 id='_"+FName+"' title='"+Title+"' class='validate-dialog textarea ui-widget-content ui-corner-all'>"+((Action=="Edit")?RowData[i]:Tip)+"</textarea>";
         } else if(Type=="Date") {
            Tip=fnGetTodayDateString();
            //            el="<table><tr><td colspan=2 class='dialog-form-label'>"+Title+" data ir laikas</td></tr>";
            //            el+="<tr><td><input type='text' id='_"+FName+"_Date' title='Data' value='"+((Action=="Edit")?RowData[i]:Tip)+"' class='validate-dialog date ui-widget-content ui-corner-all'/></td><td><input type='text' id='_"+FName+"_Time' title='Laikas' value='09:00' class='validate-dialog time widelikeDate ui-widget-content ui-corner-all'/></td></tr></table>";
            el="<div><label class='dialog-form-label'>"+Title+"</label></div>";
            el+="<div><input type='text' id='_"+FName+"' title='Data' value='"+((Action=="Edit")?RowData[i]:Tip)+"' class='validate-dialog date ui-widget-content ui-corner-all'/></div>";

         } else if(Type=="List") {
            el="<div><label for='"+FName+"' class='dialog-form-label'>"+Title+"</label></div>"; var l=sd.Cols[i].List;
            el+=exec_GetOptionListHTML(oDATA.Get(l.Source).Data, "_"+FName, l.Val, l.Text, RowData[i]);
         } else {
            el="<div><label for='"+FName+"' class='dialog-form-label'>"+Title+"</label></div><input type='"+Type+"' id='_"+FName+"' title='"+Title+"' value='"+((Action=="Edit")?RowData[i]:Tip)+"' class='validate-dialog text ui-widget-content ui-corner-all'/>";
         }
         //HTML.replace(/ui-corner-all\'$/, 'ui-corner-all\''+' onblur="document.getElementById(\'btnSave\').focus()"')
         HTML+=el;
         HTML+="<script language='JavaScript'>$('input :last').blur(function(){$('button :first').focus();});</script>"
      }
      return HTML;
      //require()
   },
   fnServerUpdated: function (resp, updData) {
      var t=clsEditableList.prototype.Obj, d=t.clsOBJByName;
      $("#dialog-form-validate-editable legend").after("<div class='error-msg'>Nepavyko išsaugot įrašo. Klaida:\n"+resp.ErrorMsg+"</div>");
      if(resp.ErrorMsg) {
         var Msg="Nepavyko išsaugot įrašo."; if(updData.Action=="Delete") { Msg="Nepavyko ištrinti įrašo."; } if(updData.Action=="Edit") { Msg="Nepavyko pakeist įrašo."; }
         Msg+=" Klaida:\n"+resp.ErrorMsg; d.ShowInfo(Msg, true); return;
      }
      if(updData.Action=="Add") {
         updData.DataToSave.Data.unshift(resp.ResponseMsg.ID);
         d.AppendNewRow(updData.DataToSave.Data);
      }
      else if(updData.Action=="Edit") {
         d.ChangeSelRow(updData.DataToSave);
         //clsOBJByName.ShowInfo("Duomenys sėkmingai pakeisti..", false);
      }
      else {   d.DeleteSelRow(updData.DataToSave.id);  }
   },
   Init: function (dlg) {
      clsEditableList.prototype.Obj=this;
      setTimeout(function () {
         var d=dlg.parent(), l=parseFloat(d.css("left").replace("px", "")), w=parseFloat(d.css("width").replace("px", ""));  //oSIZES.height
         if(oSIZES.width-(w+2*l)<0) { l=(oSIZES.width>w)?(oSIZES.width-w)/2:0; d.css("left", l); }
      }, 300);
      $('.ui-dialog-buttonpane button:not(:eq(0),:eq(3))').addClass('ui-state-disabled'); //$(":button:contains('Authenticate')").attr("disabled","disabled");//$("#dialog ~ .ui-dialog-buttonpane").children("button:contains('Ok')").button("enable");//disable
   },
   Show: function () {
      var html='<form id="dialog-form-validate-list">';
      html+='<fieldset class="ui-corner-all"><legend>'+this.ListTitle+'</legend><div id="divEditableGrid">';
      html+='</div></fieldset>';
      html+='</form>';
      var Config=this.clsOBJByName.SD.Config, clsObj=this.clsOBJByName, eForm=this.LoadEditableForm, fnSUpd=this.fnServerUpdated;
      var dlgOpt={
         autoOpen: false, minWidth: 465, minHeight: 400, width: 'auto', modal: true, title: this.ListTitle,  //$(document).width()*0.6   width: auto, 
         buttons: {
            "Pridėti naują": function () { eForm(Config.Msg.AddNew, "Add"); },
            "Ištrinti pasirinktą": function () {
               DIALOG.Confirm("Ar tikrai norite ištrinti pasirinktą eilutę?", "Įrašo panaikinimas", function () { oGLOBAL.UpdateServer("Delete", { id: RowData[0] }, Config.tblUpdate, fnSUpd); });
            },
            "Redaguoti pasirinktą": function () { eForm(Config.Msg.Edit, "Edit"); },
            "Išeiti": function () { clsObj.DestroyGrid(); $(this).dialog("close"); }
         },
         close: function () {
            //if(DIALOG.result===1) { setTimeout("DIALOG.CallBack();"); }
            $(this).remove(); $(".validity-modal-msg").remove();
         }
      }
      this.clsOBJByName.Register_RowClickCallBack(this.RowClicked);
      this.clsOBJByName.RenderGrid(this.GridOpt, null);
      var dlg=$('<div></div>').html(html).dialog(dlgOpt).dialog('open');
      this.Init(dlg);
      return false;
   }
}











//function SetErrorMsg(Msg) {
//   if($("#dialog-form-validate-editable legend .error-msg").length==0) { $("#dialog-form-validate-editable legend").after("<div class='error-msg'></div>"); }; $("#dialog-form-validate-editable legend").html(Msg);
//   setTimeout('$("#dialog-form-validate-editable legend .error-msg").fadeOut(2000);', 5000);
//}
//function SetOKMsg(Msg) {
//   if($("#dialog-form-validate-editable legend .OK-msg").length==0) { $("#dialog-form-validate-editable legend").after("<div class='.OK-msg'></div>"); }; $("#dialog-form-validate-editable legend").html(Msg);
//   setTimeout('$("#dialog-form-validate-editable legend .OK-msg").fadeOut(2000);', 5000);
//}

//this.fnServerUpdated=_fnServerUpdated;
//   function IsUnique(arr, str, coli) {
//      for(var i=0; i<arr.length; i++) {
//         if(arr[i][coli]==str) return false; //yra tokia reiksme
//      }
//      return true;
//   }

//*******************************Redagavimo forma**************************************************************************



