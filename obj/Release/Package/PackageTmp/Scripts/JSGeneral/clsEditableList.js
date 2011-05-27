/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
/// <reference path="Server.js" />
/// <reference path="clsGrid.js" />
/// <reference path="objFunc.js" />

//function clsEDITABLE_LIST(oGrid) {
//   if(oGrid.Opt===undefined) {                 //GridOpt
//      oGrid.Opt={}; oGrid.Opt.RENDER_OPT={};
//      oGrid.Opt.Dom={ gHead: "", GridID: oGrid.tblName, DivID: "div"+oGrid.tblName }
//   }
//   //var MyOpt={ Dom: { gHead: "<span id='barChosenPeriod'></span>", GridID: "proc_Accidents", DivID: "GridAccidents" }, RENDER_OPT: { fnRowCallback: _fnRowCallback, clickEvtIsLive: 0, colorAfterNewInsert: 0} };    //
//   //GridOpt.RENDER_OPT.sScrollX="99%";            this.GridOpt.Dom.DivID
//   this.GridOpt=oGrid.Opt;
//   this.odata=oDATA.Get(oGrid.tblName);
//   this.Config=this.odata.Config;
//   this.ListTitle=this.Config.Msg.ListName;
//   this.GenNameWhat=this.Config.Msg.GenNameWhat;
//   this.RowClicked=_RowClicked;
//   this.RowData;
//   function _RowClicked(RowData) {
//      $('#tabLists button').removeClass('ui-state-disabled');
//      clsEDITABLE_LIST.prototype.Obj.RowData=RowData;
//      this.RowData=RowData;
//      //alert(this.RowData); //veikia
//      //alert(clsEDITABLE_LIST.RowData); //neveikia
//   }
//}

function clsEDITABLE_LIST(ListOpt) {
   ///<summary>Generic Editable list (use prototype clsEDITABLE_PROTOTYPE)</summary>
   ///<param name="ListOpt">{objName:[name of cls object],id:[id of record, if 0 or less actyvate empty form],fnCallBackAfter:[fn to call after unload]}</param>
   ///<returns type="??"/>
   this.id=(parseInt(ListOpt.id)==ListOpt.id)?parseInt(ListOpt.id):0;
   this.odata=oDATA.Get(ListOpt.objName);
   this.Config=this.odata.Config;
   this.ListTitle=this.Config.Msg.ListName;
   this.GenNameWhat=this.Config.Msg.GenNameWhat;
   if(this.id>0) { this.Row=GetRow(this.odata, this.id); }
   function GetRow(odata, id) {
      for(var i=0; i<odata.Data.length; i++) { if(odata.Data[i][0]===id) { return { Data: odata.Data[i], Cols: odata.Cols, Grid: odata.Grid} } }
   }
}
//*******************************Redagavimo forma**************************************************************************

//clsEDITABLE_LIST.prototype={
var clsEDITABLE_LIST_PROTOTYPE={
   Obj: {},
   fnGetEditableOpt: function (Action) {
      var t=clsEDITABLE_LIST.prototype.Obj;
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
   fnLoadEditableForm: function (id) {
      var t=clsEDITABLE_LIST.prototype.Obj;
      var Action=(id>0)?"Edit":"Add", LoadTitle=(id>0)?t.odata.Config.Msg.Edit:t.odata.Config.Msg.AddNew;
      var html='<form class="dialog-form-validate-editable">';
      html+='<fieldset class="ui-corner-all"><legend>'+LoadTitle+'</legend>';
      var dlgEditableOpt=t.fnGetEditableOpt(Action);
      html+=t.fnGenerateHTML(t.Row, Action);
      html+='</fieldset>';
      html+='</form>';
      $('<div></div>').html(html).dialog(dlgEditableOpt).dialog('open'); //LoadFormAccidentsScript();
      t.fnAddFieldControls(t.odata.Cols);
      return false;
   },
   fnAddFieldControls: function (c) {
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
      setTimeout(js, 200);
   },
   fnCheckAndSave: function (Action) {
      var t=clsEDITABLE_LIST.prototype.Obj;
      var reNumber=new RegExp("'number'"), reDate=new RegExp("'date'");
      var Data=t.odata.Data, DataToSave={ Data: [], Fields: [] }, IsUniqueArr=0;
      //reNumber.test(text)
      $.validity.setup({ outputMode: "modal" });
      $.validity.start();
      $("form.dialog-form-validate-editable .validate-dialog").each(function () {
         var child=$(this), FName=child.attr("id").substring(1), ColI=t.odata.Cols.FNameIndex(FName); //col=clsOJJByName.SD.Cols;
         var Col=t.odata.Cols[ColI];

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
         var resIsNotUn=IsNotUnique(IsUniqueArr, DataToSave, t.odata);
         if(resIsNotUn&&$("form.dialog-form-validate-editable legend .error-msg").length==0) {
            //<Vairuotojas> <Petras Petraitis> jau yra įvestas.
            $("form.dialog-form-validate-editable legend").after("<div class='error-msg'>"+t.odata.Config.Msg.GenName+" "+resIsNotUn+" jau yra įvestas.</div>");
         }
         if(resIsNotUn) ValRes.valid=false;
      }
      //if(ValRes.valid) DIALOG.result=1; else { DIALOG.result=0; }
      if(ValRes.valid) {
         if(Action=="Edit") { DataToSave["id"]=RowData[0]; }
         if(DataToSave.Data.length>0) oGLOBAL.UpdateServer(Action, DataToSave, t.odata.Config.tblUpdate, t.fnServerUpdated);
      }
      return ValRes.valid;
      //-------------------------------------------------------
      function IsNotUnique(IsUniqueArr, DataToSave, Row) {
         var GetValueToSave=function (i) {
            var UniqueF=Row.Cols[i].FName, ix=DataToSave.Fields.findIndexByVal(UniqueF);
            return DataToSave.Data[ix];
         }
         var UniqueV=GetValueToSave(IsUniqueArr[0]), NotUniqVals=UniqueV, NotUnique=false;
         for(var i=0; i<Row.Data.length; i++) {
            if(Row.Data[i][IsUniqueArr[0]]==UniqueV) {
               NotUnique=true;
               for(var iU=1; iU<IsUniqueArr.length; iU++) {
                  var UniqueV=GetValueToSave(IsUniqueArr[iU]);
                  NotUniqVals+=' '+UniqueV;
                  if(UniqueV!=Row.Data[i][IsUniqueArr[iU]]) { NotUnique=false; break; }
               } if(NotUnique) break;
            }
         }
         return NotUnique?NotUniqVals:false;
      }
   },
   fnGenerateHTML: function (Row, Action) {
      var HTML="", FName, Title, Type, el;
      for(var i=0; i<Row.Cols.length; i++) {
         if(Row.Grid.aoColumns[i].bVisible!==undefined) continue;
         FName=Row.Cols[i].FName;
         Title=Row.Grid.aoColumns[i].sTitle?Row.Grid.aoColumns[i].sTitle:"Be pavadinimo";
         Type="text"; Tip=Row.Cols[i].Tip?Row.Cols[i].Tip:"";

         if(Row.Cols[i].Valid) {
            ModelType=Row.Cols[i].Valid;
            if(ModelType.Type==="boolean") { Type="checkbox" }
            else if(ModelType.Type.substring(0, 4)==="Date") { Type="Date" } //DateNotLessCtr ir pan
            else if(ModelType.LenMax) { if(ModelType.LenMax>100) { Type="textarea" } }
         } else { if(Row.Cols[i].List) { Type="List"; } }

         if(Type=="checkbox") {
            el="<input type='checkbox'  id='_"+FName+"' name='"+FName+"' value='"+FName+"'><label class='dialog-form-label label-forChk' for='_"+FName+"'>"+Title+"</label>";
         } else if(Type=="textarea") {
            el="<div><label for='"+FName+"' class='dialog-form-label'>"+Title+"</label></div><textarea rows=2 cols=60 id='_"+FName+"' title='"+Title+"' class='validate-dialog textarea ui-widget-content ui-corner-all'>"+((Action=="Edit")?Row.Data[i]:Tip)+"</textarea>";
         } else if(Type=="Date") {
            Tip=fnGetTodayDateString();
            //            el="<table><tr><td colspan=2 class='dialog-form-label'>"+Title+" data ir laikas</td></tr>";
            //            el+="<tr><td><input type='text' id='_"+FName+"_Date' title='Data' value='"+((Action=="Edit")?Row.Data[i]:Tip)+"' class='validate-dialog date ui-widget-content ui-corner-all'/></td><td><input type='text' id='_"+FName+"_Time' title='Laikas' value='09:00' class='validate-dialog time widelikeDate ui-widget-content ui-corner-all'/></td></tr></table>";
            el="<div><label class='dialog-form-label'>"+Title+"</label></div>";
            el+="<div><input type='text' id='_"+FName+"' title='Data' value='"+((Action=="Edit")?Row.Data[i]:Tip)+"' class='validate-dialog date ui-widget-content ui-corner-all'/></div>";
         } else if(Type=="List") {
            el="<div><label for='"+FName+"' class='dialog-form-label'>"+Title+"</label></div>"; var l=Row.Cols[i].List;

////////////            //var lstVehicles=exec_GetOptionListHTML(ArrVehicles, "lstVehicles", 0, [1, 5, 3, 4], Claim.VehicleID); lstVehicles=lstVehicles.replace("<select", "<select data-ctrl='{\"UpdateField\":\"VehicleID\",\"Value\":\""+Claim.VehicleID+"\"}'").replace("</select>", "<option value=\"-1\">Redaguoti sąrašą..</option></select>");

////////////            var lstVehicles=oCONTROLS.OptionList(
////////////      { Arr: ArrVehicles, id: "lstVehicles", ValI: 0, TextI: [1, 2, 3, 4], SelectedID: Claim.VehicleID, ReplaceArr: [{ Ix: 1, txtIx: 1, obj: oDATA.Get("tblVehicleMakes")}] }
////////////      ); //2 - MakeID replacinam tblVehicleMakes.Name




            el+=exec_GetOptionListHTML(oDATA.Get(l.Source).Data, "_"+FName, l.Val, l.Text, Row.Data[i]);
         } else {
            el="<div><label for='"+FName+"' class='dialog-form-label'>"+Title+"</label></div><input type='"+Type+"' id='_"+FName+"' title='"+Title+"' value='"+((Action=="Edit")?Row.Data[i]:Tip)+"' class='validate-dialog text ui-widget-content ui-corner-all'/>";
         }
         //HTML.replace(/ui-corner-all\'$/, 'ui-corner-all\''+' onblur="document.getElementById(\'btnSave\').focus()"')
         HTML+=el;
         HTML+="<script language='JavaScript'>$('input :last').blur(function(){$('button :first').focus();});</script>"
      }
      return HTML;
      //require()
   },
   fnServerUpdated: function (resp, updData) {
      var t=clsEDITABLE_LIST.prototype.Obj, d=t.odata;
      $("form.dialog-form-validate-editable legend").after("<div class='error-msg'>Nepavyko išsaugot įrašo. Klaida:\n"+resp.ErrorMsg+"</div>");
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
         //odata.ShowInfo("Duomenys sėkmingai pakeisti..", false);
      }
      else { d.DeleteSelRow(updData.DataToSave.id); }
   },
   fnShow: function (CTRL, fnBack) {
      clsEDITABLE_LIST.prototype.Obj=this;
      var Config=this.odata.Config, clsObj=this.odata; //, fnSUpd=this.fnServerUpdated;
      this.fnLoadEditableForm(this.id);
      return false;
   }
}
//*******************************Redagavimo forma**************************************************************************
//fnShow: function (CTRL, fnBack) {
//   clsEDITABLE_LIST.prototype.Obj=this;
//   var html='<form id="dialog-form-validate-list">';
//   html+='<fieldset class="ui-corner-all"><legend>'+this.ListTitle+'</legend><div id="'+this.GridOpt.Dom.DivID+'">';
//   html+='</div></fieldset>';
//   html+='</form>';
//   var Config=this.odata.Config, clsObj=this.odata, eForm=this.fnLoadEditableForm, fnSUpd=this.fnServerUpdated;
//   html+="<div class='FloatContainer'>"+oCONTROLS.btnTextImg({ id: "btnAddNewItem", text: "Pridėti naują", icon: "ui-icon-circle-plus", title: "Pridėti naują "+this.GenNameWhat, disabled: 0, notabstop: 1, floatRight: 1 });
//   html+=oCONTROLS.btnTextImg({ id: "btnDeleteItem", text: "Ištrinti pasirinktą", icon: "ui-icon-trash", title: "Ištrinti pasirinktą "+this.GenNameWhat, disabled: 1, notabstop: 1, floatRight: 1 });
//   html+=oCONTROLS.btnTextImg({ id: "btnEditItem", text: "Redaguoti pasirinktą", icon: "ui-icon-pencil", title: "Redaguoti pasirinktą "+this.GenNameWhat, disabled: 1, notabstop: 1, floatRight: 1 });
//   html+=oCONTROLS.btnTextImg({ id: "btnGoBack", text: "Grįžti", icon: "ui-icon-arrowreturnthick-1-w", title: "Grįžti į sąrašus", disabled: 0, notabstop: 1, floatLeft: 1 })+"</div>";

//   CTRL.html(html);
//   $('button').click(function () {
//      var id=$(this).attr("id");
//      if(id==="btnGoBack") { clsObj.DestroyGrid(); fnBack(); }
//      else if(id==="btnDeleteItem") { DIALOG.Confirm("Ar tikrai norite ištrinti pasirinktą "+clsEDITABLE_LIST.prototype.Obj.GenNameWhat+"?", "Įrašo panaikinimas", function () { oGLOBAL.UpdateServer("Delete", { id: RowData[0] }, Config.tblUpdate, fnSUpd); }); }
//      else if(id==="btnEditItem") { eForm(Config.Msg.Edit, "Edit"); }
//      else if(id==="btnAddNewItem") { eForm(Config.Msg.AddNew, "Add"); }
//   })
//   this.odata.Register_RowClickCallBack(this.RowClicked);
//   this.odata.RenderGrid(this.GridOpt, null);
//   //this.Init(CTRL, fnBack);
//   return false;
//}