/// <reference path="../JSForm/Main.js" />
//$(document).ready(function () {
//  oLOGIN.curTab=@Tabs;
//});
//var oLOGIN=new clsLogin();
//var Arr=@(new HtmlString(View.Tabs));
//
function clsLogin(Data) {
   var _Tabs = Data.Tabs; //[TabID, Name]//Ikisam uzkrovimo metu
   var _Control = Data.Controls; //[ID, Name, CaptionHTML]
   var _curTabID, _curMenuID, _curGroupID, _curDataObject, _curFilter;
   this.curTabID = _curTabID; this.curMenuID = _curMenuID; this.curGroupID = _curGroupID; this.curDataObject = _curDataObject; this.curFilter = _curFilter;
   var _Menu = []; //ID, Name, MenuFrom(tbl), DataTable, Filter, FilterValue, GroupID
   var _MenuGroup = []//ID, Name, TabID
   var _CtrInMenu = []//TabID, MenuID, ControlID
   this.CtrInMenu = _CtrInMenu;
   this.fnTabClick = _fnTabClick;
   this.fnSetNewMenuData = _fnSetNewMenuData;
   this.fnMenuClick = _fnMenuClick;
   this.fnTimeOutMenuClick = _fnTimeOutMenuClick;

   fnFillTabs();
   function fnFillTabs() {
      var HTML = "";
      for (var i = 0; i < _Tabs.length; i++) {
         HTML += "<li class='lact'><a href='#' class='Tab' id='Tab" + _Tabs[i][0] + "' onclick='oLOGIN.fnTabClick(" + _Tabs[i][0] + ");return false;'>" + _Tabs[i][1] + "</a></li>";
      }
      $("#tabs").html(HTML);
   }
   //**********Pradzia***********************_fnTabClick**************************************************************************************
   function _fnTabClick(TabID) {
      //$("#tabs").find("a").removeClass("selectedTab").filter("#Tab"+TabID).addClass("selectedTab");
      $("#tabs a").removeClass("selectedTab").addClass("Tab").filter("#Tab" + TabID).removeClass("Tab").addClass("selectedTab");
      _curTabID = TabID;
      //Ar turiu duomenis sitam Tabui? Jei ne atsisiunciu
      if (_MenuGroup.IndexOfFunc(function (ArrRow) { return ArrRow.TabID === TabID; }) === -1) {
         //if(_Menu.findRowByColValue(TabID, 1)=="") {
         //alert("Nera");
         CallServer("{TabID:" + "'" + TabID + "'}", oLOGIN.fnSetNewMenuData, TabID, "/Tab/GetTab", 'json')
      }
      else { _fnSetNewMenuData(null, TabID) }  //alert("Yra");
   }
   function _fnSetNewMenuData(JsonRes, TabID) {
      if (JsonRes !== null) {
         _Menu.AddArray(JsonRes.Menu.proc_Action_Menu);
         _MenuGroup.AddArray(JsonRes.Menu.proc_Action_MenuGroup);
         _CtrInMenu.AddArray(JsonRes.Menu.proc_Action_ControlsInMenu);
         for (property in JsonRes) {
            if (property !== "Menu") {
               oDATA[property] = new clsGrid(JsonRes[property], property); //Antras param - isiminti varda
            }
         }
      }
      $("#Master_left").html(RenderMenu(TabID));
      $("#Master_left .lact a:eq(0)").trigger("click");
   }
   //*******Pabaiga _fnTabClick********************Pradzia******Menu renderinimas**************************************************************************************
   function RenderMenu(TabID) {
      var HTML = "";
      for (var i = 0; i < _MenuGroup.length; i++) {
         if (_MenuGroup[i].TabID === TabID) {
            HTML += "<li class=\"ltitle\"><a>" + _MenuGroup[i].Name + "</a><ul>" + RenderMenuItems(_MenuGroup[i].ID) + "</ul></li>";
         }
      }
      return "<ul>" + HTML + "</ul>";
   }
   function RenderMenuItems(GroupID) {
      var HMTLItems = "", RunCmd; ;
      for (var i = 0; i < _Menu.length; i++) {
         if (_Menu[i].GroupID === GroupID) {
            if (_Menu[i].MenuFrom) {
               HMTLItems += RenderMenuFromTable(_Menu[i]); //Menu items from table
            } else {
               RunCmd = "oLOGIN.fnMenuClick(\"" + _Menu[i].DataTable + "\"," + Enclose(_Menu[i].Filter) + "," + Enclose(_Menu[i].FilterValue) + "," + GroupID + ",this.id);return false;"
               HMTLItems += "<li class='lact' id='limnu_" + _Menu[i].ID + "'><a id='amnu_" + _Menu[i].ID + "' href='#' onclick='" + RunCmd + "'>" + _Menu[i].Name + "</a></li>";
            }
         }
      }
      return HMTLItems;
   }
   function RenderMenuFromTable(Menu) {
      var HMTLGroup = "", FilterVal, RunCmd;
      //Lentelė iš kurios renderinsim menu itemsus
      var tbl = oDATA.Get(Menu.MenuFrom).Data;
      for (var Row = 0; Row < tbl.length; Row++) {
         //Gridas bus filtruojamas pagal sita, jei yra MenuFrom tai jos ID, kitu atveju jei null reiskia visi
         FilterVal = tbl[Row][0];
         RunCmd = "oLOGIN.fnMenuClick(\"" + Menu.DataTable + "\"," + Enclose(Menu.Filter) + "," + Enclose(FilterVal) + "," + Menu.GroupID + ", this.id); return false";
         //MenuClick(tblData to render grid, Grid filter col, Grid filter value, control ID)
         HMTLGroup += "<li class='lact' id='limnu_" + Menu.ID + "_" + FilterVal + "'><a href='#' id='amnu_" + Menu.ID + "_" + FilterVal + "' onclick='" + RunCmd + "'>" + tbl[Row][1] + "</a></li>";
      }
      return HMTLGroup;
   }
   function Enclose(variable) {
      if (typeof (variable) === "string") { return "\"" + variable + "\""; }
      else return variable;
   }
   //*******Pabaiga-menu renderinimas************Pradzia-grido renderinimas***********************************************************************************
   function _fnMenuClick(DataTable, Filter, FilterVal, GroupID, CID) {
      setTimeout('Wait.Show(3000)', 0);
      _curMenuID = parseInt(CID.replace("amnu_", ""));
      _curGroupID = GroupID; _curDataObject = DataTable; _curFilter = Filter;
      var RunFunction = "oLOGIN.fnTimeOutMenuClick('" + DataTable + "'," + Enclose(Filter) + "," + Enclose(FilterVal) + ",'" + CID + "')";
      setTimeout(RunFunction, 0);
   }
   function _fnTimeOutMenuClick(DataTable, Filter, FilterVal, CID) {
      var Item = $("#Master_left li[id^=limnu_]").filter(".selectedMenu").removeClass("selectedMenu").addClass("lact").end().filter("[id=" + CID.replace("amnu_", "limnu_") + "]").removeClass("lact").addClass("selectedMenu");
      //_curMenu=Item.text();
      var MyOpt = { Filter: { ColName: Filter, ColValue: FilterVal }, Dom: { GridID: DataTable, gHead: _fnGetControlsHtml(), DivID: "MainDiv", ParentID: "Master_right"} };
      var Height = $("#Master_right").height() - 105 + "px"
      oDATA.Get(DataTable).RenderGrid(MyOpt, Height);
   }
   //*******Pabaiga-grido renderinimas**************Pradzia controlsu renderinimas*********************************************************************************************
   function _fnGetControlsHtml() {
      var Html = "";
      for (var i = 0; i < _CtrInMenu.length; i++) {
         if (_CtrInMenu[i][0] === _curTabID) {
            if (_CtrInMenu[i][1] === null || _CtrInMenu[i][1] === _curMenuID) {
               Html += _Control.findColValByColVal(_CtrInMenu[i][2], 0, 2);
            }
         }
      }
      return Html;
   }
   //   *******Pabaiga controlsu renderinimas**************Pradzia _fnShowRowData*********************************************************************************************
   this.fnShowRowData = _fnShowRowData;
   function _fnShowRowData(Action) {
      var obj = oDATA.Get(_curDataObject);
      var curRowData = obj.RowData;
      var Controler = obj.SD.Config.Controler;
      CallServer(JSON.stringify({ id: curRowData[0], DataObject: _curDataObject }), oLOGIN.fnShowData_render, curRowData, '/' + Controler + '/' + Action, 'json');
   }
   this.fnShowData_render = _fnShowData_render;
   function _fnShowData_render(json, curRow) {
      if (json.ErrorMsg === "") {
         $('#gridHead').html(_fnSetHead(json.Head.HeadTemplate, json.Head.HeadColsFromGrid, curRow));
         oDATA["Temp"] = new clsGrid(json.Grid, "Temp");
         var gOpt = { Filter: { "ColName": null, ColValue: null }, Dom: { GridID: "Temp", gHead: _fnSetHead(json.Head.HeadTemplate, json.Head.HeadColsFromGrid, curRow), DivID: "MainDiv", ParentID: "Master_right"} };
         var Height = $("#Master_right").height() - 105 + "px"
         oDATA.Get("Temp").RenderGrid(gOpt, Height);
      }
      else { }
   }
   function _fnSetHead(Template, ArrInd, curRow) {
      for (var i = 0; i < ArrInd.length; i++) {
         if ($.trim(curRow[ArrInd[i]]) === "") {
            Template = Template.replace(new RegExp('<tr><td>.*</td><td>\\{' + i + '\\}</td></tr>', 'gm'), curRow[ArrInd[i]]);
            Template = Template.replace(new RegExp('\\{' + i + '\\},\\s*', 'gm'), curRow[ArrInd[i]]);
         } else {
            Template = Template.replace(new RegExp('\\{' + i + '\\}', 'gm'), curRow[ArrInd[i]]);
         }
      }
      return Template;
   }
}