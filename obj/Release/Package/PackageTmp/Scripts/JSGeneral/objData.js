/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
/// <reference path="General.js" />
//--------------Menu Object------------------------------------------------------------------------------------------------
var clGridObjects = function () {
   var Obj = [];
   this.SetObject = function (objName, objInstance) {
      var NewObject = { Name: objName, Instance: objInstance }
      Obj[Obj.length] = NewObject;
   }
   thisGetObjectByName = function (objName) {
      for (var i = 0; i < Obj.length; i++) {
         if (objName == Obj[i].Name) return Obj[i].Instance;
      }
   }
}

//--------------DataObject with Grid support----------------------------Start---------------------------------------------
function Dataobject(ServerData) {
   this.Head = ServerData.Head;
   this.Data = ServerData.Data;
   this.Config = ServerData.Config; //toNo-Arr indexes
   this.Grid = ServerData.Grid;

   //------------------------------------------------------------------------------------------------------------------
   //--------------------Object converters------------------------------------------------------------------------------
   //----------------------------------------------------------------------------------------------------------------
}
//--------------DataObject with Grid support----------------------------End---------------------------------------------
//--------------------------Grid rendering----------------------------Start---------------------------------------------
//------------------------Grid Filling Functions--------------------------------------------------------------------------------------------------
/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
function RenderGrid(gridSettings) {
   $('#MainDiv').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="DataGrid"></table>');
   oTable = $('#DataGrid').dataTable(gridSettings);
   $('td', oTable.fnGetNodes()).editable('/EditTable/' + objGrid_Main.Config.tblToUpdate, {
      "callback": function (sValue, y) {
         if (sValue) var jsonResp = JSON.parse(sValue);
         if (jsonResp.ErrorMsg) { alert(jsonResp.ErrorMsg) } else {
            var aPos = oTable.fnGetPosition(this);
            oTable.fnUpdate(jsonResp.NewValue, aPos[0], aPos[2]); //0-Eilute,1-St atemus pakavotus,2-St su pakavotais
            gridSettings.aaData[aPos[0]][aPos[2]] = jsonResp.NewValue; //Isimenam pakeitima ir i masyva
         }
      },
      "submitdata": function (value, settings) {
         var aPos = oTable.fnGetPosition(this);
         var Col = objGrid_Main.Head[aPos[2]]; //Stulpelio pavadinimo suradimas pagal st indeksa
         //            /* Visų tos eilutės reikšmių suradimas */
         var aData = oTable.fnGetData(aPos[0]);
         var id = aData[0]//id suradimas. Id visada rasomi pirmam stulpelyje [0]
         var NewValue = aData[aPos[2]]
         return { "FieldName": Col, "id": id, "NewValue": value };
      },
      "height": "14px"
      //        "cancel": "No",
      //        "submit": "Ok",
      //        "tooltip": "Spragtelėti norint keisti",
      //        "onblur": "submit"
   });

   //-------------------------------------------------------
   //    $('#DataGrid tbody td').hover(function () { Ciotkai highlitina cele
   //        $(this).addClass('highlighted');
   //    }, function () {
   //        var nTrs=oTable.fnGetNodes();
   //        $('td.highlighted', nTrs).removeClass('highlighted');
   //    });
   //-------------------------------------------------------
   //    $('#DataGrid tbody tr').hover(function () {
   //        //alert("Here we go!");
   //        //$(this).toggleClass('row_selected');
   //        $(this).addClass('highlighted');
   //    }, function () {
   //        var nTrs=oTable.fnGetNodes();
   //        $('td.highlighted', nTrs).removeClass('highlighted');
   //    });
   //    //-------------------------------------------------------
   $('#DataGrid tbody tr').live('click', function () {
      var aData = oTable.fnGetData(this);
      var iId = aData[2];
      $('tr.row_selected').removeClass('row_selected');
      //gaiSelected[gaiSelected.length++]=iId;
      //        if(jQuery.inArray(iId, gaiSelected)===-1) {
      //            gaiSelected[gaiSelected.length++]=iId;
      //        }
      //        else {
      //            gaiSelected=jQuery.grep(gaiSelected, function (val) {
      //                return val!=iId;
      //            });
      //alert(gaiSelected);
      //        }
      //        // $(this).removeClass('row_selected');
      $(this).toggleClass('row_selected');
   });
   //-------------------------------------------------------
   $("#DataGrid_filter input[type=text]")[0].focus();
   //-------------------------------------------------------
}
//var aPos=oTable.fnGetPosition(this);
//var aData=oTable.fnGetData(this);

//--------------------------Grid rendering----------------------------End---------------------------------------------
var giCount = 1;
function fnClickAdd() {
   //        $('#DataGrid').dataTable().fnAddData(
   //    		[giCount+".1",
   //    		giCount+".2",
   //    		giCount+".3",
   //    		giCount+".4",
   //    		giCount+".5",
   //    		giCount+".6",
   //    		giCount+".7",
   //    		giCount+".8",
   //    		giCount+".9"]
   //            );
   ////        var Clone=$(".dataTables_scrollBody tbody tr:first").clone();
   //    //    $(".dataTables_scrollBody tbody tr:first").before(Clone);
   var cols = objGrid_Main.Head.length; var tr = [];
   for (var i = 0; i < cols; i++) {
      if (i == 8) { tr[tr.length] = 0; } else {
         tr[tr.length] = "<INPUT TYPE=text>";
         //tr[tr.length]=giCount+".1";
      } //giCount+".1";
   }
   var ai = $('#DataGrid').dataTable().fnAddData(tr);
   var n = oTable.fnSettings().aoData[ai[0]].nTr;
}

function getPerson() {
   var name = $("#Name").val();
   var age = $("#Age").val();
   // poor man's validation
   return (name == "") ? null : { Name: name, Age: age };
}