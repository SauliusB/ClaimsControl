/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="../JSGeneral/Server.js" />
/// <reference path="../JSGeneral/objData.js" />
/// <reference path="../JSGeneral/objFunc.js" />
/// <reference path="../JSGeneral/clsGrid.js" />

function Tab_Lists() {
   //   $('a.list').click(function () {
   //      LoadDriverList();
   //   });
   var HTML="<div><a class='tabList_lists' data-ctrl='{\"tblName\":\"tblDrivers\"}' href='#lstDrivers'><span>Vairuotojai</span></a></div>";
   HTML+="<div><a class='tabList_lists' data-ctrl='{\"tblName\":\"tblVehicles\"}' href='#lstVehicles'><span>Transporto priemonės</span></a></div>";
   HTML+="<div><a class='tabList_lists' data-ctrl='{\"tblName\":\"tblInsPolicies\"}' href='#lstInsuranceContracts'><span>Draudimo sutartys</span></a></div>";
   $("#tabLists").html(HTML);

   $('a.tabList_lists').bind("click", function () {
      var dr=new clsEditableList($(this).data('ctrl')); dr.Show($("#tabLists"), Tab_Lists);
   });
}
