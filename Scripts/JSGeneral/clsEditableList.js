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
function fnEDITFORM(p) {
   //{objName:??,id:??,aRowData:??}
   var f=new clsEDITABLE_LIST(p);
   //f.prototype=$.extend({}, clsEDITABLE_LIST_PROTOTYPE);
   f=$.extend(f, clsEDITABLE_LIST_PROTOTYPE);
   f.fnShow();
}
function clsEDITABLE_LIST(ListOpt) {
   ///<summary>Generic Editable list (use prototype clsEDITABLE_PROTOTYPE)</summary>
   ///<param name="ListOpt">{objName:[name of cls object],id:[id of record, if 0 or less actyvate empty form],aRowData:??,fnCallBackAfter:[fn to call after unload]}</param>
   ///<returns type="??"/>
   this.id=(parseInt(ListOpt.id)==ListOpt.id)?parseInt(ListOpt.id):0;

   this.objName=ListOpt.objName; //is combobox plugino padaryt, kad irgi tik varda cia paduotu !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
   this.odata=(typeof ListOpt.objName==='object')?ListOpt.objName:oDATA.Get(ListOpt.objName);
   this.Config=this.odata.Config;
   this.GenNameWhat=this.Config.Msg.GenNameWhat;
   this.Row={ Cols: this.odata.Cols, Grid: this.odata.Grid };
   if(this.id) { this.Row.Data=(ListOpt.aRowData)?ListOpt.aRowData:GetRow(this.odata, this.id); }
   function GetRow(odata, id) {
      for(var i=0; i<odata.Data.length; i++) { if(odata.Data[i][0]===id) { return odata.Data[i] } }
   }
   this.ListTitle=this.Config.Msg.GenName;
   if(ListOpt.id) {
      this.ListTitle=this.Config.Msg.GenName+'   '+this.Row.Data[1]+', '+this.Row.Data[2];
      if(this.objName==='proc_Vehicles') { this.ListTitle+=', '+this.Row.Data[3]+', '+this.Row.Data[4]; }
      else if(this.objName==='proc_InsPolicies') { this.ListTitle+=', '+this.Row.Data[3]; }
   }
}
//*******************************Redagavimo forma**************************************************************************

//clsEDITABLE_LIST.prototype={
var clsEDITABLE_LIST_PROTOTYPE={
   Obj: {},
   fnGetEditableOpt: function(Action) {
      var t=clsEDITABLE_LIST.prototype.Obj;
      return dlgEditableOpt={
         autoOpen: false, minWidth: 650, width: 800, modal: true, title: t.ListTitle, draggable: true,
         //         buttons: {
         //            "Išsaugoti": function() { if(t.fnCheckAndSave(Action)) { DIALOG.result=1; $(this).dialog("close"); } },
         //            "Atšaukti": function() { DIALOG.result=0; $(this).dialog("close");   }
         //         },
         close: function() {
            //if(DIALOG.result===1) { }  //setTimeout("DIALOG.CallBack();");
            $(this).remove(); $(".validity-modal-msg").remove();
         }
      }
   },
   fnLoadEditableForm: function(id) {
      var t=clsEDITABLE_LIST.prototype.Obj;
      var Action=(id)?"Edit":"Add", LoadTitle=(id)?t.odata.Config.Msg.Edit:t.odata.Config.Msg.AddNew;

      //var html='<form class="dialog-form-validate-editable">';
      //html+='<fieldset class="ui-corner-all"><legend>'+LoadTitle+'</legend>';
      var dlgEditableOpt=t.fnGetEditableOpt(Action);
      //html+=t.fnGenerateHTML(t.Row, Action);
      //html+='</fieldset>';
      //html+='</form>';
      $('<div id="divEditableForm" style="background:none; background-color:#f8f7f2"></div>').html('').dialog(dlgEditableOpt).dialog('open'); //LoadFormAccidentsScript();
      CallServer(JSON.stringify({ id: id, tbl: this.Config.tblUpdate, GetAll: ((oDATA.Get('tblDocs'))?false:true) }), oGLOBAL.Start.fnSetNewData,
      { Ctrl: "divEditableForm", RenderNew: 0, fnCallBack: function(jsResp) {
         $('#btnListRecordSave').button().click(function() {
            alert('save');
         })
         $('#btnListRecordCancel').click(function() { $('#divEditableForm').dialog('close'); })
         var DatePanel=$('#divStatusPanel');
         var fnSetRetirePanel=function() {
            var EndDate=DatePanel.data("EndDate"), End=DatePanel.data("End");
            var fnEditDate=function(ShowToWorking) {
               DatePanel.empty().html("<div><input type='text'></input><a href='#'>Išsaugoti</a><a href='#'>Atšaukti</a></div>"+((ShowToWorking)?"<a href='#'>"+End.ToUsed+"</a>":""))
               .find('input').datepicker({ minDate: '-3y', maxDate: '0' }).ValidateOnBlur({ Allow: 'date' }).labelify({ labelledClass: " inputTip ", text: function() { return End.Tip; } })
               .next().click(function() { var val=DatePanel.find('input').val(); if(!val) { return false; } $.data(DatePanel[0], "EndDate", val); alert("Atseit išsaugau"); fnSetRetirePanel(); })//issaugojimas
               .next().click(function() { fnSetRetirePanel(); })//atsaukimas
               .parent().parent().children(':eq(1)').click(function() { $.data(DatePanel[0], "EndDate", ""); alert("Grąžinau prie dirbančių"); fnSetRetirePanel(); }) //gryzimas prie dirbanciu
            };
            log("Atsistatydinimo data:"+EndDate);
            if(EndDate) { DatePanel.removeClass("IsNow").addClass("WasBefore").html("Nedirba nuo "+EndDate+"<a href='#'>Keisti<a>"); }
            else { DatePanel.removeClass("WasBefore").addClass("IsNow").html("<a href='#'>"+End.ToNotUsed+"<a>"); }
            DatePanel.find('a').click(function() { if(EndDate) { fnEditDate(true); } else { fnEditDate(false); } });
         }
         if(DatePanel.length) {//Jei yra panelis, kad jau nebedirba/ neeksplotuojama pridedam funkcionaluma
            fnSetRetirePanel();
            $('#ListRecordChangeStatus').click(function() {
               //var Status=(this.objName=)
            })
         }
      }
      }, "/Lists/GetListItem", "json"); //RenderNew: 0 - tik nutrina kas buvo pries tai
      t.fnAddFieldControls(t.odata.Cols);
      return false;
   },
   fnAddFieldControls: function(c) {
      //--------------------pridedami controlai redagavimo formai-------------------------------------------------------------------------
      //--------------------kontroliuoja MyPlugins.js
      //default   minDate: "-3Y", maxDate: 0  dateFormat: 'yy-mm-dd', constrainInput: true,
      //$("#_EndDate").datepicker({ minDate: '-0', maxDate: '+3y' }).ValidateOnBlur({ Allow: 'date' }); // currentText:'Now'
      //ValidateOnBlur({ Allow: 'float' })
      var js='';
      for(var i=0; i<c.length; i++) {
         if(c[i].Type!=undefined) {
            var ctrl="$('#_"+c[i].FName+"')";
            if(c[i].Type=='DateCtrl') { js+=ctrl+".datepicker();"; }
            else if(c[i].Type=='DateNotLessCtrl') { js+=ctrl+".datepicker({minDate:'-0',maxDate:'+5y'});"; }
            else if(c[i].Type=='DateNotMoreCtrl') { js+=ctrl+".datepicker({minDate:'-5y',maxDate:'+0'});"; }
            if(c[i].Type=='Year'||c[i].Type=='YearNotMore'||c[i].Type=='YearNotLess'||c[i].Type=='Date'
               ||c[i].Type=='Integer'||c[i].Type=='Decimal') { js+=ctrl+".ValidateOnBlur({ Allow: '"+c[i].Type+"' });"; }
         }
      }
      //eval(js);
      setTimeout(js, 200);
   },
   fnCheckAndSave: function(Action) {
      var t=clsEDITABLE_LIST.prototype.Obj;
      var reNumber=new RegExp("'number'"), reDate=new RegExp("'date'");
      var Data=t.odata.Data, DataToSave={ Data: [], Fields: [] }, IsUniqueArr=0;
      //reNumber.test(text)
      $.validity.setup({ outputMode: "modal" });
      $.validity.start();
      $("form.dialog-form-validate-editable .validate-dialog").each(function() {
         var child=$(this), FName=child.attr("id").substring(1), ColI=t.odata.Cols.FNameIndex(FName); //col=clsOJJByName.SD.Cols;
         var Col=t.odata.Cols[ColI];

         FUnique=(Col.IsUnique)?Col.IsUnique:0; Type=(Col.Type)?Col.Type:0;
         var Validity=Col.Validity;

         if(Type==="decimal") { child.val(child.val().replace(/,/g, ".")); }
         eval("child."+Validity);
         IsUniqueArr=(Col.IsUnique)?Col.IsUnique:IsUniqueArr;
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
         var GetValueToSave=function(i) {
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
   fnGenerateHTML: function(Row, Action) {
      var HTML="", FName, Title, Type, el;
      for(var i=0; i<Row.Cols.length; i++) {
         if(Row.Grid.aoColumns[i].bVisible!==undefined) continue;
         FName=Row.Cols[i].FName;
         Title=Row.Grid.aoColumns[i].sTitle?Row.Grid.aoColumns[i].sTitle:"Be pavadinimo";
         Type="text"; Tip=Row.Cols[i].Tip?Row.Cols[i].Tip:"";

         if(Row.Cols[i].List) { Type="List"; }
         else {
            ModelType=Row.Cols[i].Type;
            if(ModelType.Type==="Boolean") { Type="checkbox" }
            else if(ModelType.Type.substring(0, 4)==="Date") { Type="Date" } //DateNotLessCtr ir pan
            else if(Row.Cols[i].LenMax) { if(ModelType.LenMax>100) { Type="textarea" } }
         }

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
   fnServerUpdated: function(resp, updData) {
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
   fnShow: function(CTRL, fnBack) {
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