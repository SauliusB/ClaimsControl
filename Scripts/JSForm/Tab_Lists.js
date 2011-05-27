/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="../JSGeneral/Server.js" />
/// <reference path="../JSGeneral/objData.js" />
/// <reference path="../JSGeneral/objFunc.js" />
/// <reference path="../JSGeneral/clsGrid.js" />

function Tab_Lists() {
   function FillList(obj, oName) {
      var pWraper, ptxt, pui_img, HTML;
      //      pWraper={ classes: "ui-corner-all ui-widget-content", width: 250, style: "float:left;" };
      //      ptxt={ id: "txtListsSearch", classes: "yellow", title: "Įveskite frazę paieškai", notabstop: 1, floatLeft: 1 };
      //      pui_img={ name: "ui-icon-close", style: "float:right;cursor:pointer;vertical-align:middle;", onclickfn: "$(this).prev().val('');" };

      //      HTML="<div class='CtrlPanel'><h2 style='padding-top:20px;'>"+obj.Config.Msg.ListName;
      //      HTML+="</h2><a id='btnReturnToLists' href='javascript:void(0);return false;'>(Atgal į sąrašus)</a></div>";
      //      HTML+=oCONTROLS.txt_imgINtxt(pWraper, ptxt, pui_img)+"<div id='divGridList'></div><>";

      pWraper={ classes: "ui-corner-all ui-widget-content", width: 250, style: "float:right;height:2em;" };
      ptxt={ id: "txtListsSearch", classes: "yellow", title: "Įveskite frazę paieškai", notabstop: 1, floatLeft: 1 };
      pui_img={ name: "ui-icon-close", style: "float:right;cursor:pointer;vertical-align:middle;", onclickfn: "$(this).prev().val('');" };

      HTML="<div class='CtrlPanel'><span style='float:left;'><h2 style='display:inline;margin-right:20px;'>"+obj.Config.Msg.ListName;
      HTML+="</h2><a id='btnReturnToLists' href='#'>(Atgal į sąrašus)</a></span>";
      HTML+=oCONTROLS.txt_imgINtxt(pWraper, ptxt, pui_img)+"<div style='clear:both;'></div></div>";

      HTML+="<a style='float:right;width:10em;margin:1em;' class='btnAddNewListItmem' title="+obj.Config.Msg.AddNew+" href='#'>Pridėti naują</a><div style='clear:both;'></div>";
      HTML+="<div id='divGridLists'></div><a class='btnAddNewListItmem' style='float:right;width:10em;margin:1em;' title="+obj.Config.Msg.AddNew+" href='#'>Pridėti naują</a><div style='clear:both;'></div>";
      $("#tabLists").html(HTML);

      $('#btnReturnToLists').bind("click", function() { ResetLists(); return false; });
      var ListGrid=new clsGRID(), MyOpt={ InDivID: "divGridLists", GridID: "ListGrid", clickEvtIsLive: 0, colorAfterNewInsert: 0, classes: "display",
         fnOnRowClicked: function(aRowData) {
            fnEDITFORM({ objName: oName, id: aRowData[0], aRowData: aRowData });
         }
      }, GridOpt={ sDom: "rt" };

      //if(TwoGrids) { GridOpt.fnRowCallback=TwoGrids.fnAddClass; }
      var oTable=ListGrid.Render(MyOpt, GridOpt, obj);

      if(oName==="proc_Vehicles"||oName==="proc_Drivers") {
         var Tabs='<div id="ListWhiteMenu" style="border:none;">';
         Tabs+='<ul class="ulWhiteMenu"><li><a href="#tabs-1-lists">'+((oName==="proc_Vehicles")?"Eksploatuojamos":"Dirbantys")+'</a></li><li><a href="#tabs-2-lists">'+((oName==="proc_Vehicles")?"Ne eksploatuojamos":"Nedirbantys")+'</a></li></ul>';
         Tabs+='<div id="tabs-1-lists"></div>';
         Tabs+='<div id="tabs-2-lists"></div></div>';
         $(Tabs).insertBefore('#divGridLists').tabs({
            select: function(event, ui) {
               log(ui.index);
               if(ui.index===0) { oTable.fnFilter('^(-)$', 7, true, false); }
               else { oTable.fnFilter('^(.{10})$', 7, true, false); } //data iš 10 skaičiu
            }
         });
         oTable.fnFilter('^(-)$', 7, true, false); //Surusiuojam pradzioj
         //var oSettings=oTable.fnSettings();
         //var iTotalRecords=oSettings.fnRecordsTotal();
         //fnRecordsDisplay() - records in the 'display' (i.e. after filtering)
         //fnDisplayEnd() - End point of the current 'page'
         //_iDisplayStart - Start point of the current 'page'
         //_iDisplayLength - Length of records for the current 'page'.
      }

      $("a.btnAddNewListItmem").button().click(function() {
         alert("opa");
      });

      $("#txtListsSearch").keyup(function() {
         oTable.fnFilter(this.value);
      });
   }

   function ResetLists() {
      var HTML="<div class='CtrlPanel'><div><a class='tabList_lists' data-ctrl='{\"oName\":\"proc_Drivers\"}' href='#'><span>Vairuotojai</span></a></div>";
      HTML+="<div><a class='tabList_lists' data-ctrl='{\"oName\":\"proc_Vehicles\"}' href='#'><span>Transporto priemonės</span></a></div>";
      HTML+="<div><a class='tabList_lists' data-ctrl='{\"oName\":\"proc_InsPolicies\"}' href='#'><span>Draudimo sutartys</span></a></div></div>";
      $("#tabLists").empty().html(HTML);
      $('a.tabList_lists').bind("click", function() {
         //var dr=new clsEditableList($(this).data('ctrl')); dr.Show($("#tabLists"), Tab_Lists);
         var oName=($(this).data('ctrl').oName)?$(this).data('ctrl').oName:"", obj=oDATA.Get(oName)?oDATA.Get(oName):"";
         if(obj) { FillList(obj, oName); }
         else { alert("Neradau objekto"+oName); }
         return false;
      });
   }
   ResetLists();
}