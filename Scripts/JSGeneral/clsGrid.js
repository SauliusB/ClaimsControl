/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
/// <reference path="Server.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="Validation.js" />
var oDATA={
   Obj: {},
   Set: function(objName, oINST) {
      this.Obj[objName]=oINST;
   }, Get: function(objName) { return this.Obj[objName]; }
};
function clsGRID() {
   this.Render=_Render;
   function _Render(MyOpt, GridOpt, ServerData) {
      $.extend(true, this.MyOpt, ((MyOpt)?MyOpt:{})); //GridOpt.sScrollY=Height
      $.extend(true, this.GridOpt, ((GridOpt)?GridOpt:{}), { aaData: ServerData.Data }, ServerData.Grid);
      //MyOpt:  InDivID(buvo Dom.DivID), GridID
      $("#"+MyOpt.InDivID).html('<table '+((MyOpt.classes)?'class="'+MyOpt.classes+' "':'')+'id="'+MyOpt.GridID+'" cellpadding="0" cellspacing="0" width="auto"></table>');
      var oTable=$("#"+MyOpt.GridID).dataTable(this.GridOpt), GridID=MyOpt.GridID;
      if(typeof this.MyOpt.fnOnRowClicked!=='undefined') {
         var aRowData,fnRowClickEvent=function fnRowClickEvent(event) {
            $('#'+GridID+' tbody tr').removeClass('row_selected');
            //            var that; //kaip this tik uztikrinam, kad butu TR
            //            if(event.target.tagName==="TD") {
            //               $(event.target.parentNode).addClass('row_selected');
            //               that=event.target.parentNode;
            //            } else {
            //               $(event.target).addClass('row_selected');
            //               that=event.target;
            //            }
            aRowData=oTable.fnGetData(oTable.fnGetPosition(this));
            log('RowClicked, aRowData:['+aRowData+']');
            MyOpt.fnOnRowClicked(aRowData);
         }
         //$('#'+GridID+' tbody tr').live('click', fnRowClickEvent);//live neveikia po grido perpiesimo
         $('#'+GridID+' tbody tr').bind('click', fnRowClickEvent);
      }
      return oTable;
   }
   this.MyOpt={ InDivID: "divForGrid", GridID: "DataGrid", classes: "display" };
   this.GridOpt={
      oLanguage: { //GridOpt.sScrollY=Height
         "sLengthMenu": "Rodyti _MENU_ įr. psl.", "sZeroRecords": "Nerasta įrašų..", "sInfo": "Viso: _TOTAL_",           //"sInfo": "Rodomi _START_-_END_ įrašai iš _TOTAL_ ",
         "sInfoEmpty": "Rodoma: 0 - 0 iš 0 įrašų", "sInfoFiltered": "(Filtruota iš _MAX_ įrašų)", "sSearch": "Ieškoti:"
      }, "sProcessing": "Laukite..", "bJQueryUI": true, "bSortClasses": false, "bPaginate": false, "sScrollX": "100%", "bScrollCollapse": false,     //???????
      "clickEvtIsLive": 1, //Listams 1, accidentui 0
      "colorAfterNewInsert": 1
   };
}

//var oGRID={
//   Render: function (MyOpt, GridOpt) {
//      $.extend(true, this.MyOpt, ((MyOpt)?MyOpt:{})); //GridOpt.sScrollY=Height
//      $.extend(true, this.GridOpt, ((GridOpt)?GridOpt:{})); //GridOpt.sScrollY=Height
//      //MyOpt:  InDivID(buvo Dom.DivID), GridID
//      MyOpt.InDivID.html('<table '+((MyOpt.DataTable)?'class="'+MyOpt.DataTable+' "':'')+'id='+MyOpt.GridID+' cellpadding="0" cellspacing="0" border="0" class="display"></table>');
//      var oTable=$("#"+MyOpt.GridID).dataTable(GridOpt);
//      return oTable;
//   }, MyOpt: { InDivID: "divForGrid", GridID: "DataGrid", class: "DataTable"
//   }, GridOpt: {
//      oLanguage: {
//         "sLengthMenu": "Rodyti _MENU_ įr. psl.", "sZeroRecords": "Nerasta įrašų..", "sInfo": "Viso: _TOTAL_",           //"sInfo": "Rodomi _START_-_END_ įrašai iš _TOTAL_ ",
//         "sInfoEmpty": "Rodoma: 0 - 0 iš 0 įrašų", "sInfoFiltered": "(Filtruota iš _MAX_ įrašų)", "sSearch": "Ieškoti:"
//      }, "sProcessing": "Laukite..", "bJQueryUI": true, "bSortClasses": false, "bPaginate": false, "sScrollX": "100%", "bScrollCollapse": false,     //???????
//      "clickEvtIsLive": 1, //Listams 1, accidentui 0
//      "colorAfterNewInsert": 1
//   }
//}

function clsGrid1(ServerData, objName) {
   var oINST=this;
   var _SD={ Cols: [], Config: {}, Grid: { aaSorting: [], aoColumns: [] }, Data: [] };
   var RENDER_OPT={}, GridID, infoText, gaiSelected, _fnCallBack=""; //????????????????

   _SD=ServerData;
   oINST.objName=objName;
   oINST.SD=_SD;
   oINST.SD.GetDataByFName=_GetDataByFName;
   oINST.RenderGrid=_fnRenderGrid;
   oINST.ShowInfo=fnShowInfo;
   oINST.DestroyGrid=function() { oINST.oTable.fnDestroy(); _fnCallBack=null; };
   oINST.Register_RowClickCallBack=function(NewFunction) { _fnCallBack=NewFunction; };
   //oINST.RowData;
   //oINST.oTable=function () { return oINST.oTable };
   //oINST.Table=oINST.oTable;

   //
   /************Object initialization***************************************************************************************************/
   function initialize() {
      //if(_SD.Config.toNo) ApplyFn(_SD.Data, _SD.Config.toNo, function (a) { return parseFloat(a); }); //stulpeliams su id toNo pritaikau funkcija parseFloat
      if(_SD.Grid) CopySettings(_SD.Grid, RENDER_OPT); //Copying options, which came from server
      //RENDER_OPT=_SD.Grid;
      oDATA.SetObject(objName, oINST);
   }
   /************Object Metods****************Begining***********************************************************************************/
   //this.RenderGrid=function (MyOptions) {
   function _fnRenderGrid(MyOpt, Height) {
      //CopySettings(MyOptions, RENDER_OPT); //Copying options, if no such option will be left default
      MyOpt=(MyOpt)?MyOpt:{};
      RENDER_OPT.MyOpt=MyOpt;
      if(Height) { RENDER_OPT.sScrollY=Height; }  //Size of grid
      if(RENDER_OPT.MyOpt.Filter===undefined) { RENDER_OPT.MyOpt.Filter={ ColName: null, ColValue: null, Expr: null }; }
      if(RENDER_OPT.MyOpt.Dom===undefined) { RENDER_OPT.MyOpt.Dom={ gHead: "", GridID: "EditableGrid", DivID: "divEditableGrid" }; }
      if(RENDER_OPT.MyOpt.Filter.ColName&&(typeof (RENDER_OPT.MyOpt.Filter.ColValue))!='undefined') {
         var DataArr=fnMyFilter(RENDER_OPT.MyOpt.Filter.ColName, RENDER_OPT.MyOpt.Filter.ColValue, RENDER_OPT.MyOpt.Filter.Expr);
         RENDER_OPT.aaData=DataArr;
      } else { RENDER_OPT.aaData=_SD.Data; }
      if(MyOpt.RENDER_OPT) { CopySettings(MyOpt.RENDER_OPT, RENDER_OPT); }  //Grido opcijos kopijuojamos
      GridID=RENDER_OPT.MyOpt.Dom.GridID;
      _fnSetGrid();

      //-------------------------------------------------------------------------------------------------------------------------------------------
      //$("#"+GridID+"_wrapper div:first").attr("id", "divAction").prepend("<span id='divDataModBtn'><a href='#' id='btnEdit' onclick='fnClickEdit()';return false;'>Redaguoti</a><a href='#' id='btnAddNew' onclick='fnClickAdd()';return false;'>Pridėti naują</a><a href='#' id='btnDelete' onclick='fnClickDelete()';return false;'>Ištrinti</a></span><span style='display:none;' id='divDataAddBtn'><a href='#' id='btnSaveNew' onclick='fnSaveNew()';return false;'>Išsaugot naują</a><a href='#' id='btnCancel' onclick='fnCancelNew()';return false;'>Atšaukti</a></span>");
   }
   /*************Object Metods****************End*********************************************************************************
   *************Private functions*************Beggining*********************************************************************************
   *Private functions
   *ApplyFn(ids, Data, CallFunc)-converts Data to other type as per CallFunc
   *fnMyFilter(ColName,ColValue)-returnse filtered data array
   *CopySettings(From, To) - copy settings from one object to another
   */
   function ApplyFn(ArrToApplyOn, ArrSettings, CallFunc) {
      var col;
      for(var row=0; row<ArrToApplyOn.length; row++) {
         for(var i=0; i<ArrSettings.length; i++) {
            col=ArrSettings[i];
            try { ArrToApplyOn[row][col]=CallFunc(ArrToApplyOn[row][col]) } catch(e) { }
         }
      }
   }
   function fnMyFilter(ColName, ColValue, Expr) {
      var ind=_SD.Cols.FNameIndex(ColName), FilteredArr; //Randam to pavadinimo stulpelio indexa
      if(typeof (Expr)==='undefined'||Expr==='IsEqual') { FilteredArr=$.grep(_SD.Data, function(val, i) { return (val[ind]===ColValue); }); }
      else if(Expr==='IsNotEqual') { FilteredArr=$.grep(_SD.Data, function(val, i) { return (val[ind]!=ColValue); }); }
      else if(Expr==='IsLess') { FilteredArr=$.grep(_SD.Data, function(val, i) { return (val[ind]<ColValue); }); }
      else if(Expr==='IsMore') { FilteredArr=$.grep(_SD.Data, function(val, i) { return (val[ind]>ColValue); }); }
      else if(Expr==='IsLessOrNull') { FilteredArr=$.grep(_SD.Data, function(val, i) { return (val[ind]<ColValue||val[ind]===null); }); }
      else if(Expr==='IsMoreOrNull') { FilteredArr=$.grep(_SD.Data, function(val, i) { return (val[ind]>ColValue||val[ind]===null); }); }
      else alert("Netinkama grido 'expr' "+Expr);
      return FilteredArr;
   }
   function CopySettings(From, To) {
      $.each(From, function(k, v) {//Permetami settingai
         if(k==="genDom") {
            CopySettings(v, To[k])//Atskirai kiekvienam properciui
         } else {
            To[k]=v;
         }
      });
   }
   function _GetDataByFName(FName, row) {
      var x;
      for(var i=0; i<_SD.Cols.length; i++)
      { if(_SD.Cols[i].FName===FName) return _SD.Data[row][i]; }
   }
   //   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   //----------------------------------------------------Grid actions---------------------------------------------------------------------------------------------------------
   //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
   function SetGrid() {
      var DivContainer=$("#"+RENDER_OPT.MyOpt.Dom.DivID);
      DivContainer.html('<table cellpadding="0" cellspacing="0" border="0" class="display" id='+GridID+'></table>');
      oINST.oTable=DivContainer.find("#"+GridID).dataTable(RENDER_OPT);

      log("SetGrid - "+objName+", _SD: "+_SD);
      log("SetGrid - "+objName+", oINST.oTable: "+oINST.oTable);

      //aoData.push({ "name": "my_field", "value": "my_value" });
      _fnRowClick();
      //Renderinami controlsai
      DivContainer.find("#"+RENDER_OPT.MyOpt.Dom.GridID+"_wrapper div:first").prepend('<span id="gridHead">'+RENDER_OPT.MyOpt.Dom.gHead+'</span>')
         .find(".GridRowSel").css("display", "none");
      //$("button").button();
      //$("#divDataModBtn,#divDataAddBtn").buttonset();
      //alert($("#"+RENDER_OPT.MyOpt.Dom.GridID+"_filter").length);
      if(typeof (RENDER_OPT.fnAfterInit)!='undefined') {
         if(typeof (RENDER_OPT.fnAfterInit)==='string') eval(RENDER_OPT.fnAfterInit); else RENDER_OPT.fnAfterInit();
      }
      $("#"+RENDER_OPT.MyOpt.Dom.GridID+"_filter input").focus();
   }
   function _fnSetGrid() {
      window.setTimeout(SetGrid, 0);
      this.fnPreview=_fnPreview;
      //if(!$.browser.msie) { setTimeout('this.fnPreview()', 0); }    //ie ilgai generuoja
      //-------------------------------------------------------
      //setTimeout('Wait.Hide()', 0);
   }

   this.AppendNewRow=function(NewData) {
      if(_SD.Grid.aoColumns.length>NewData.length) { //Jeigu nauju duomenu stulpeliu skaicius nesutampa su lenteles sk. patikrinam ir jei reikia pridedam trukstamus st
         var c=_SD.Grid.aoColumns, NewData2=[NewData[0]], nd2;
         for(var i=1; i<c.length; i++) {
            if(typeof (c[i].bVisible)!='undefined') {
               if(typeof _SD.Cols[i].Default!='undefined') {//ikisam trukstama
                  nd2=""; if(_SD.Cols[i].Default==='Today') nd2=fnGetTodayDateString();
                  NewData2.push(nd2);
               }
            }
            if(i>(NewData.length-1)) break;
            NewData2.push(NewData[i]);
         }
         NewData=NewData2;
      }
      _SD.Data[_SD.Data.length]=NewData;
      //$("#"+GridID).dataTable().fnAddData(NewData);
      var a=oINST.oTable.fnAddData(NewData);
      var nTr=oINST.oTable.fnSettings().aoData[a[0]].nTr;
      //_fnRowClick(); //Ivykiu pririsimas
      if(!RENDER_OPT.clickEvtIsLive) { addEvent(); } //Jei live nereikia papildomai evento prikabint
      if(RENDER_OPT.colorAfterNewInsert) {
         var color=$(nTr).css("background-color");
         $(nTr).css("background-color", "#84FF7D"); //#84FF7D
         fnShowInfo("Naujas įrašas sėkmingai pridėtas..", false);
         setTimeout(function() { $(nTr).animate({ backgroundColor: color }, 2000).removeAttr("background-color"); }, 2000);
      }
   }
   this.ChangeSelRow=function(DataToSave, DoShowInfo, fnApplyAfter) {
      var anSelected=fnGetSelected(oINST.oTable);
      var aPos=oINST.oTable.fnGetPosition(anSelected[0]);
      var aData=oINST.oTable.fnGetData(aPos); //Šita eilutė
      var RowToSave=[];
      for(var i=0; i<_SD.Cols.length; i++) {
         var iFound=0;
         for(var ids=0; ids<DataToSave.Fields.length; ids++) {
            if(_SD.Cols[i].FName===DataToSave.Fields[ids]) { RowToSave.push(DataToSave.Data[ids]); iFound=1; }
         }
         if(iFound===0) { RowToSave.push(aData[i]); }
      }
      oINST.oTable.fnUpdate(RowToSave, aPos);
      for(var i=0; i<_SD.Data.length; i++) { if(_SD.Data[i][0]===aData[0]) { _SD.Data[i]=RowToSave; break } }
      if(typeof (DoShowInfo)==='undefined') { fnShowInfo("Pakeitimai išsaugoti..", false); }
      if(typeof fnApplyAfter!='undefined') { if(typeof fnApplyAfter==='function') fnApplyAfter(); else eval(fnApplyAfter); }
   }
   this.DeleteSelRow=function(id) {
      var anSelected=fnGetSelected(oINST.oTable);
      _SD.Data=$.grep(_SD.Data, function(row) { return row[0]!=id; }); //Istrinam eilute is masyvo
      //var aData=oINST.oTable.fnGetData(anSelected[0]) Duomenis gauna
      if(anSelected[0]) oINST.oTable.fnDeleteRow(anSelected[0]);
      fnShowInfo("Įrašas ištrintas..", false);
   }
   //   $('.clickme').live('click', function () {
   //      // Live handler called.
   //   });

   function addEvent() {
      $('#'+GridID+' tbody tr').each(
      		function() {
      		   if(!this.hasEventHander)
      		      $(this).click(function(event) { _fnRowClickEvent(event) });
      		   this.hasEventHander=true;
      		});
   }  //.unbind('click')

   function _fnRowClick() {
      if(RENDER_OPT.clickEvtIsLive)
      { $('#'+GridID+' tbody tr').live('click', _fnRowClickEvent); }
      else { $('#'+GridID+' tbody tr').bind('click', _fnRowClickEvent); }
   }
   //   function _UpdateData(td,Pos,Val) {
   //      var aPos=oINST.oTable.fnGetPosition(td);
   //      var aData=oINST.oTable.fnGetData(aPos[0]);
   //      aData[aPos[Pos]]=Val;
   //      td.innerHTML=Val;
   //   }
   function _fnRowClickEvent(event) {
      this.hasEventHander=true;
      //$('#'+GridID+' tbody tr').live('click', function (event) {
      $('#'+GridID+' tbody tr').removeClass('row_selected');
      //$('#'+GridID+' tbody tr.row_colapsed').remove();
      var that; //kaip this tik uztikrinam, kad butu TR
      if(event.target.tagName==="TD") {
         $(event.target.parentNode).addClass('row_selected');
         that=event.target.parentNode;
      } else {
         $(event.target).addClass('row_selected');
         that=event.target;
      }
      this.RowData=oINST.oTable.fnGetData(oINST.oTable.fnGetPosition(this));
      log('RowClicked, data:'+this.RowData);

      _fnCallBack(this.RowData, that, oINST.oTable, $(event.target)); // _fnCallBack(RowData,nTr,oINST.oTable)
      //         if(typeof (_fnCallBack)!="undefined") {
      //            _fnCallBack(this.RowData);
      //         }
   }
   function _fnPreview() { $('td', oINST.oTable.fnGetNodes()).unbind("click"); }
   //-------------------------------------------------------

   //if($("#btnDelete[class='disabled']").length>0) alert("disabled"); else alert("no");
   //-------------------------------------------------------
   //    $('#DataGrid tbody td').hover(function () { Ciotkai highlitina cele
   //        $(this).addClass('highlighted');
   //    }, function () {
   //        var nTrs=oINST.oTable.fnGetNodes();
   //        $('td.highlighted', nTrs).removeClass('highlighted');
   //    });
   //-------------------------------------------------------
   function fnShowInfo(Msg, Err) {
      ///<summary>Show message</summary>
      ///<param name="Msg">Message to show</param>
      ///<param name="Err">If it is error:true|false</param>
      infoText=$("#"+GridID+"_info").text();
      if(Err) { $("#"+GridID+"_info").css("color", "#990000").text(Msg); }
      else { $("#"+GridID+"_info").css("color", "#008000").text(Msg); }
      window.setTimeout(ClearInfo, 6000);
      //setTimeout('Wait.Hide()', 0);
      //$("#"+GridID+"_info").delay(6000).text(infoText).css("color", "#000000");
   }
   function ClearInfo() { $("#"+GridID+"_info").text(infoText).css("color", "#000000"); }
   function _fnClickAdd() {
      //Wait.Show();
      window.setTimeout("fnClickAddTimeOut();", 10) // Wait.Hide()
   }
   function _fnClickAddTimeOut() {
      //Wait.Show();
      $("#divDataModBtn").hide(); $("#divDataAddBtn").show();
      $(oINST.oTable.fnSettings().aoData).each(function() { $(this.nTr).removeClass('row_selected'); });
      $('td', oINST.oTable.fnGetNodes()).unbind("click");
      var oSettings=oINST.oTable.fnSettings(); var tr=[], w, List, tVal="";
      for(var i=0; i<oSettings.aoColumns.length; i++) {
         if(oSettings.aoColumns[i].bVisible===false) { tr[tr.length]=0; } else {//&&oSettings.aoColumns[i].bSortable==true
            w=(oSettings.aoColumns[i].sWidth>80)?oSettings.aoColumns[i].sWidth:80;
            ListData=(_SD.Cols[i]["List"]!==undefined)?_SD.Cols[i]["List"]:"";
            if(ListData==="") {
               if((_SD.Cols[i]["Default"]!==undefined)) { //Defaultiniu reiksmiu irasymas
                  var Def=_SD.Cols[i]["Default"];
                  if(Def==="Today") tVal=" value='"+fnGetTodayDateString()+"'";
               } else { tVal=""; }
               tr[tr.length]="<input type='text'"+tVal+"/>";
            }  //style='width:"+w+"'
            else {//Listas
               tr[tr.length]=GetListFromObj(ListData);
               //$('#whatever_select').change(function () {
               //   alert($(this).val());
               //   //oINST.oTable.fnFilter($(this).val()); // perhaps add the required column?
               //});
            }
         }
      }
      var ai=$('#'+GridID).dataTable().fnAddData(tr);
      var n=oINST.oTable.fnSettings().aoData[ai[0]].nTr;
      n.id="NewRow"; n.childNodes[0].childNodes[0].focus();
      //Wait.Hide();
   }
   function GetListFromObj(ListData) {
      var ListObjName=ListData.FromObj;
      var ListObj=oDATA.Get(ListObjName).Data; //0-Id, 1-Name, 2-Filter
      var ListValueIndex=(ListData.FromField===undefined)?"":oDATA.Get(ListObjName).SD.Cols.FNameIndex(ListData.FromField);
      var ListFilter=(ListData.ListFilter===undefined)?"":{ FieldToFilter: oDATA.Get(ListObjName).SD.Cols.FNameIndex(ListData.ListFilter.FieldToFilter), Filter: ListData.ListFilter.Filter };
      //Filtruojam tik nurodytom grupem
      var FilterMenuGroupID=(ListData.FilterMenuGroupID===undefined)?"":((ListData.FilterMenuGroupID.ValueInMe(oLOGIN.curGroup)?RENDER_OPT.MyOpt.Filter.ColValue:""));
      var NewSelect="<select class='NewSelect'>"; //size="1"
      for(var i=0; i<ListObj.length; i++) {
         if(FilterMenuGroupID===""||ListObj[i][2]===FilterMenuGroupID)
            if(ListFilter===undefined&&ListObj[i][ListValueIndex]!==null) {
               NewSelect+="<option value='"+ListObj[i][0]+"'>"+ListObj[i][ListValueIndex]+"</option>";
            } else if(ListObj[i][ListFilter.FieldToFilter]===ListFilter.Filter) {
               NewSelect+="<option value='"+ListObj[i][0]+"'>"+ListObj[i][ListValueIndex]+"</option>";
            }
      }
      //NewSelect.substring(0, NewSelect.lastIndexOf(","))
      NewSelect+="</select>";
      return NewSelect;
   }
   function _fnSaveNew() {
      var DControl=$("#"+GridID+"_info"), ListBox=0, TextBox=0, control, Value, FieldName;
      var txtControls=$("#NewRow input"); var DataToSave={}, DataToGrid={}, FieldName, Val;
      var oSettings=oINST.oTable.fnSettings();
      //for(var Coli=0; Coli<oSettings.aoColumns.length; Coli++) {
      for(var Coli=1; Coli<_SD.Cols.length; Coli++) {
         FieldName=_SD.Cols[Coli].FName;
         if(_SD.Cols[Coli]["DefaultUpdate"]!==undefined) { Val=_SD.Cols[Coli]["DefaultUpdate"]; DataToSave[FieldName]=Val; }
         else if(RENDER_OPT.MyOpt.Filter.ColName===_SD.Cols[Coli].FName) {//Filtras - issaugojam visur
            Val=RENDER_OPT.MyOpt.Filter.ColValue;
            SaveAll(DataToGrid, DataToSave, FieldName, Val, Val);
         }
         else if(oSettings.aoColumns[Coli].bVisible) {
            if(_SD.Cols[Coli]["List"]!==undefined) {//Listas jo validuoti nereikia, value yra id kuris issaugojamas i lauka nurodyta updateField
               DataToGrid[FieldName]=$("#NewRow select").eq(ListBox).find('option:selected').text();
               FieldName=_SD.Cols[Coli]["List"].UpdateField; Val=$("#NewRow select").eq(ListBox).find('option:selected').val();
               SaveAll(DataToGrid, DataToSave, FieldName, parseInt(Val), Val); //id listo
               ListBox++;
            }
            else {//Kita
               control=txtControls.eq(TextBox);
               //Validate() Paskutinis param.("") yra iraso id, unikalumo tikrinimui, taciau siuo atveju jis nesvarbus, kadangi nauja irasas neturi dar id
               if(!Validate(_SD, Coli, control, DControl, "")) return;
               Val=control.val();
               SaveAll(DataToGrid, DataToSave, FieldName, Val, Val);
               TextBox++;
            }
         }
      }
      //CopySettings(DataToSave, DataInCols); //Perkopijuojami ir kt laukai (DataInCols turės visus laukus kurie yra gride)
      DControl.text("Siunčiami duomenys..");
      var obj=this, AddNewAction=(_SD.Config.AddNewAction===undefined)?"AddNew":_SD.Config.AddNewAction;
      CallServer(JSON.stringify({ Data: DataToSave, DataObject: _SD.Config.tblUpdate }), obj.fnResponse_SaveNew, DataToGrid, '/'+_SD.Config.Controler+'/'+AddNewAction, 'json');
      var NewRow=document.getElementById('NewRow');
      if(NewRow) oINST.oTable.fnDeleteRow(NewRow);
      $("#divDataModBtn").show(); $("#divDataAddBtn").hide();
      function SaveAll(DataToGrid, DataToSave, FieldName, ValToGrid, ValToSave) {
         DataToGrid[FieldName]=ValToGrid;
         DataToSave[FieldName]=ValToSave;
      }
   }
   function _fnResponse_SaveNew(json, DataToGrid) {
      if(json.ErrorMsg.length===0) {
         var NewData=[]; // NewData[0]=json.ResponseMsg; //[0] kad panaudot ApplyFn
         //Pridedam naujus duomenis i Grida ir i masyva
         NewData[0]=parseInt(json.ResponseMsg);
         for(var i=1; i<_SD.Grid.aoColumns.length; i++) {
            if(_SD.Grid.aoColumns[i].DefaultUpdate!==undefined) { NewData[i]=_SD.Grid.aoColumns[i].DefaultUpdate; } else {
               NewData[i]=DataToGrid[_SD.Cols[i].FName];
               if(NewData[i]===undefined) { alert("Stulpelis "+_SD.Cols[i].FName+" - undefined, gal reikia nurodyti 'DefaultUpdate'?"); }
            }
         }
         _SD.Data[_SD.Data.length]=NewData;
         $("#"+GridID).dataTable().fnAddData(NewData);
         fnShowInfo("Naujas įrašas sėkmingai pridėtas..", false);
      } else {
         fnShowInfo("Nepavyko išsaugoti įrašo. Klaida:"+json.ErrorMsg, true);
      }
   }
   function _fnCancelNew() {
      var NewRow=document.getElementById('NewRow');
      if(NewRow) oINST.oTable.fnDeleteRow(NewRow);
      $("#divDataModBtn").show(); $("#divDataAddBtn").hide();
      $("#"+GridID+"_info").css("color", "#000000"); //atstatom info langa, istrynus eilute, tekstas pats atsistatis
   }
   function _fnClickEdit() {
      // Wait.Show();
      window.setTimeout("fnClickEditTimeOut();", 10)  // Wait.Hide()
   }
   function _fnClickEditTimeOut() {
      if($("#btnEdit").text()==="Redaguoti") {  //Redagavimo rezimas
         $("#btnEdit").text("Peržiūrėti");
         $("#btnAddNew").removeAttr("onclick").addClass("disabled"); //.click(function () { return false; });
         $("#btnDelete").removeAttr("onclick").addClass("disabled");
         var NewRow=document.getElementById('NewRow');
         if(NewRow) oINST.oTable.fnDeleteRow(NewRow);
         $(oINST.oTable.fnSettings().aoData).each(function() { $(this.nTr).removeClass('row_selected'); });
         $('#'+GridID+' tbody').unbind("click");
         //$('#'+GridID+' tbody tr').die("click");
         //-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
         //----------------------------------------------------------------------------------------------------------------------------
         var ListHandlerSettings={
            indicator: 'Minutėlę...',
            data: "{'Lorem ipsum':'Lorem val','Ipsum dolor':'Ipsum val','Dolor sit':'Dolor val'}",
            type: "select", //,
            submit: "Gerai"
            //style: "inherit",
            //style:'display: inline; width: 200px',
            //submitdata: function (value, settings) { return { id: 2 }; }
         }
         function GetListFromObj_Edit(ListData) {
            var ListObjName=ListData.FromObj;
            var ListObj=oDATA.Get(ListObjName).Data; //0-Id, 1-Name, 2-Filter
            var ListValueIndex=(ListData.FromField===undefined)?"":oDATA.Get(ListObjName).SD.Cols.FNameIndex(ListData.FromField);
            var ListFilter=(ListData.ListFilter===undefined)?"":{ FieldToFilter: oDATA.Get(ListObjName).SD.Cols.FNameIndex(ListData.ListFilter.FieldToFilter), Filter: ListData.ListFilter.Filter };
            //Filtruojam tik nurodytom grupem
            var FilterMenuGroupID=(ListData.FilterMenuGroupID===undefined)?"":((ListData.FilterMenuGroupID.ValueInMe(oLOGIN.curGroup)?RENDER_OPT.MyOpt.Filter.ColValue:""));
            var NewSelect="";
            for(var i=0; i<ListObj.length; i++) {
               if(FilterMenuGroupID===""||ListObj[i][2]===FilterMenuGroupID)
                  if(ListFilter===undefined&&ListObj[i][ListValueIndex]!==null) {
                     NewSelect+="'"+ListObj[i][0]+"':'"+ListObj[i][ListValueIndex]+"',";
                  } else if(ListObj[i][ListFilter.FieldToFilter]===ListFilter.Filter) {
                     NewSelect+="'"+ListObj[i][0]+"':'"+ListObj[i][ListValueIndex]+"',";
                  }
            }
            return '{'+NewSelect.substring(0, NewSelect.lastIndexOf(","))+'}';
         }
         function GetListDataFromObj(obj, Filter) {//0-Id, 1-Name, 2-Filter
            var data="";
            if(!Filter||obj[0][2]===undefined) { //Nefiltruojam
               for(var i=0; i<obj.length; i++) { data+=(data.length>0)?",":""; data+="'"+obj[i][0]+"':'"+obj[i][1]+"'"; }
            }
            else { //Filtruojam
               for(var i=0; i<obj.length; i++) {
                  if(Filter===obj[i][2]) { data+=(data.length>0)?",":""; data+="'"+obj[i][0]+"':'"+obj[i][1]+"'"; }
               }
            }
            return '{'+data+'}'; 1
         }

         //Listu sudejimas pagal _SD.Cols nustatymus. Pvz.:
         //new { FName = "Installer", List=new{FromObj="oSIMS.tblSim_Installers", FromField="Name",UpdateField="InstallerID"}}
         function SetListToColumns(Cols) {
            var Ids=[], VisibleCol= -1, ListSelector="";
            //for(var i=0; i<Cols.length; i++) {
            for(var i=0; i<_SD.Grid.aoColumns.length; i++) {
               if(_SD.Grid.aoColumns[i].bVisible===undefined) { VisibleCol++; } //Skaiciuojam tik matomus stulpelius
               $.each(Cols[i], function(k, v) {
                  if(k==="List") {
                     var ListSet=ListHandlerSettings;
                     //Ar reikia filtruot pagal menu?
                     //Filter=(Cols[i].List.FilterMenuGroupID===undefined)?"":((Cols[i].List.FilterMenuGroupID.ValueInMe(oLOGIN.curGroup))?RENDER_OPT.MyOpt.Filter.ColValue:"");
                     //Filter=(ListData.FilterMenuGroupID==undefined)?"":((List.FilterMenuGroupID.ValueInMe(oLOGIN.curGroup))?RENDER_OPT.MyOpt.Filter.ColValue:"");
                     //ListSet.data=GetListDataFromObj(oDATA.Get(v["FromObj"]).Data, Filter);
                     ListSet.data=GetListFromObj_Edit(v);
                     ListSet.submitdata=function(value, settings) { return fnUpdateField_submitdata(value, settings, this, v["UpdateField"]); } //Paskutinis ID kuris bus updatinamas DB
                     ListSet.callback=function(sValue, y) { fnUpdateField_callback(sValue, y, this, v["UpdateField"]); }
                     $('td:nth-child('+(VisibleCol+1)+')', oINST.oTable.fnGetNodes()).editable('/'+_SD.Config.Controler+'/EditField', ListSet);
                     ListSelector+="td:nth-child("+(i+1)+")"; ///1 based
                     return;
                  }
               });
            }
            return ListSelector;
         }
         var ListSelector=SetListToColumns(_SD.Cols);
         //-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
         //OK//$('td:nth-child(6),td:nth-child(9)', oINST.oTable.fnGetNodes()).editable('/'+_SD.Config.Controler+'/EditField', ListHandlerSettings);
         //$('td:nth-child(9)', oINST.oTable.fnGetNodes()).editable('/'+_SD.Config.Controler+'/EditField', ListHandlerSettings); ///1 based

         //$('td.List', oINST.oTable.fnGetNodes()).editable('/'+_SD.Config.Controler+'/EditField', ListHandlerSettings);
         //$('td.List', oINST.oTable.fnGetNodes()).bind('click.editable', { target: '/'+_SD.Config.Controler+'/EditField', options: ListHandlerSettings }, fnClickEdit);
         //$('td.List', oINST.oTable.fnGetNodes()).bind('click.editable', { target: '/'+_SD.Config.Controler+'/EditField', options: ListHandlerSettings }, $.fn.editable);
         //----------------------------------------------------------------------------------------------------------------------------
         $('td', oINST.oTable.fnGetNodes()).not(ListSelector).editable('/'+_SD.Config.Controler+'/EditField', {
            callback: function(sValue, y) { fnUpdateField_callback(sValue, y, this); },
            submitdata: function(value, settings) { return fnUpdateField_submitdata(value, settings, this); },
            onsubmit: function(settings, original) { return fnUpdateField_validation(settings, original, this) },
            height: "14px",
            submit: "Gerai",
            tooltip: ""//,
            //"type": "validate"
         });
      } else {                        //Is redagavimo pereinu i perziura
         $("#btnEdit").text("Redaguoti");
         $("#btnAddNew").removeClass("disabled").click(function() { fnClickAdd(); return false; });
         $("#btnDelete").removeClass("disabled").click(function() { fnClickDelete(); return false; });
         this.fnPreview();
      }
   }
   function fnUpdateField_validation(settings, original, This) {
      var aPos=oINST.oTable.fnGetPosition(original);  //original-td
      if(!Validate(_SD, aPos[2], This.find("input"), $("#"+GridID+"_info"), oINST.oTable.fnGetData(aPos[0])[0])) return false; //paskutinis id
      return true;
   }
   function fnUpdateField_callback(sValue, settings, This, FieldToUpdate) {
      if(sValue) var jsonResp=JSON.parse(sValue);
      var aPos=oINST.oTable.fnGetPosition(This);
      if(jsonResp.ErrorMsg) { alert(jsonResp.ErrorMsg); oINST.oTable.fnUpdate(jsonResp.ResponseMsg.OldValue, aPos[0], aPos[2]); } else {
         if(FieldToUpdate===undefined) {
            RENDER_OPT.aaData[aPos[0]][aPos[2]]=jsonResp.ResponseMsg.NewValue; //Isimenam pakeitima ir i masyva - updatina ir _SD
            oINST.oTable.fnUpdate(jsonResp.ResponseMsg.NewValue, aPos[0], aPos[2]); //0-Eilute,1-St atemus pakavotus,2-St su pakavotais
         } else {  //Listas - masyvas updatinamas ir i kita stulpeli
            var IndexToUpdate=_SD.Cols.FNameIndex(FieldToUpdate); var NewVal;
            $.each(eval('('+settings.data+')'), function(k, v) {
               if(k===jsonResp.ResponseMsg.NewValue) { NewVal=v; } //Surandam pagal rakta properti tos eilutes
            });
            oINST.oTable.fnUpdate(NewVal, aPos[0], aPos[2]); //Updatinam lentele i nauja reiksme
            RENDER_OPT.aaData[aPos[0]][IndexToUpdate]=jsonResp.ResponseMsg.NewValue; //Masyvas - updatinam ID i nauja
            RENDER_OPT.aaData[aPos[0]][aPos[2]]=NewVal; //Masyvas - updatinam langeli i nauja listo reiksme
         }
      }
   }
   function fnUpdateField_submitdata(value, settings, This, FieldToUpdate) {
      var aPos=oINST.oTable.fnGetPosition(This);
      var Field=(FieldToUpdate===undefined)?_SD.Cols[aPos[2]].FName:FieldToUpdate; //Lauko pavadinimo suradimas pagal st indeksa
      var aData=oINST.oTable.fnGetData(aPos[0]); //Visų tos eilutės reikšmių suradimas
      var id=aData[0]//id suradimas. Id visada rasomi pirmam stulpelyje [0]
      return { "FieldName": Field, "id": id, "NewValue": value, "OldValue": aData[aPos[2]], "DataObject": _SD.Config.tblUpdate };
   }
   //-----End of fnClickEdit function

   function _fnClickDelete() {
      if(!confirm("Ar tikrai norite ištrinti pasirinktą eilutę?")) return;
      var anSelected=fnGetSelected(oINST.oTable);
      //Duomenu gavimas pagal pasirinkta eilute - oINST.oTable.fnGetData(anSelected[0]) - eilutes masyvas, tame tarpe pasleptu duomenu
      oINST.oTable.fnGetData(anSelected[0])
      var id=oINST.oTable.fnGetData(anSelected[0])[0];
      var obj=this;
      CallServer(JSON.stringify({ id: id, DataObject: _SD.Config.tblUpdate }), obj.fnResponse_DeleteUser, anSelected, '/'+_SD.Config.Controler+'/Delete', 'json');
   }
   //this.fnResponse_DeleteUser=function (json, anSelected) {
   function _fnResponse_DeleteUser(json, anSelected) {
      if(json.ErrorMsg.length===0) {
         var id=json.ResponseMsg;
         _SD.Data=$.grep(_SD.Data, function(row) { return row[0]!=id; }); //Istrinam eilute is masyvo
         if(anSelected[0]) oINST.oTable.fnDeleteRow(anSelected[0]);
         fnShowInfo("Įrašas ištrintas..", false);
      } else {
         fnShowInfo("Nepavyko ištrinti. Klaida:"+json.ErrorMsg, true);
      }
   }
   function fnGetSelected(oTableLocal) {
      var aReturn=new Array();
      var aTrs=oTableLocal.fnGetNodes();

      for(var i=0; i<aTrs.length; i++) {
         if($(aTrs[i]).hasClass('row_selected')) {
            aReturn.push(aTrs[i]);
         }
      }
      return aReturn;
   }
   /*************Private functions*************End*********************************************************************************
   *************Private variables*************Start*********************************************************************************
   *Private functions
   *ConvertTo(ids, Data, CallFunc)-converts Data to other type as per CallFunc
   *
   */
   RENDER_OPT={
      //---------Grid render options--------------------------------
      "oLanguage": {
         "sLengthMenu": "Rodyti _MENU_ įr. psl.",
         "sZeroRecords": "Nerasta įrašų..",
         //"sInfo": "Rodomi _START_-_END_ įrašai iš _TOTAL_ ",
         "sInfo": "Viso: _TOTAL_",
         "sInfoEmpty": "Rodoma: 0 - 0 iš 0 įrašų",
         "sInfoFiltered": "(Filtruota iš _MAX_ įrašų)",
         "sSearch": "Ieškoti:"
      },
      "sProcessing": "Laukite..",
      "bJQueryUI": true,
      //"bStateSave": true, - isimena ir sortiravima, kas nevisada etiska
      "bSortClasses": false,
      //"aLengthMenu": [[25, 50, -1], [25, 50, "Visi"]],
      "bPaginate": false,
      "sScrollX": "100%",
      //"sScrollXInner": "110%",    -to force scrooling
      "bScrollCollapse": false,     //???????
      //--------------------------------------------------------------------------------------------------
      "clickEvtIsLive": 1, //Listams 1, accidentui 0
      "colorAfterNewInsert": 1
      //--------------------------------------------------------------------------------------------------
      //"aaSorting": [[0, 'asc'], [3, 'asc']]
      //"sDom": 'T<"clear">lfrtip', - kad veiktu kliboardas etc..
      //"fnRowCallback": function( nRow, aData, iDisplayIndex ) {
      //if ( jQuery.inArray(aData[0], gaiSelected) !==:b-1 )
      //{$(nRow).addClass('row_selected');}
      //return nRow;
      //},
      //--------Other options-----------------------
      //"Dom": { "GridID": "dtGrid", "DivID": "MainDiv", "ParentID": "Master_right" }
   };
   //*************Private variables*************End*********************************************************************************
   initialize();
}