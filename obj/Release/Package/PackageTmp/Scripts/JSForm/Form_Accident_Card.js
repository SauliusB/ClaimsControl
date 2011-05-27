/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSGeneral/Server.js" />
/// <reference path="../JSGeneral/clsDialogUI.js" />
/*global alert:false, $: false, jQuery: false, oGLOBAL:false, oSIZES:false, DIALOG:false,console:false, document:false, setTimeout:false, location:false, address:false,GLatLng:false,GMarker:false,GEvent:false,GBrowserIsCompatible:false,GClientGeocoder:false,GMap2:false */

function LoadAccident_Card(AccidentNo) {
   "use strict"; var UpdateServer, DefaultTime, fnChangeCheck, fnChange, LoadScript;
   CallServer("{'AccidentNo':"+AccidentNo+"}", oGLOBAL.Start.fnSetNewData, { Ctrl: "tabAccidents", RenderNew: 1, fnCallBack: function() { LoadScript(); } }, "/Accident/GetAccident", "json");

   //oGLOBAL.temp=this;

   LoadScript=function() {
      //$('#divMap').width('100%').height(oSIZES.height-$("ul.ui-tabs-nav").height()*2-$("#Form-Accident-Card").height()-100);

      $("#btnMapTown").button({ disabled: true }).click(function() { oGLOBAL.mapFn.GetMapFromTown(); return false; });
      //$("#LongNote").autoResize();
      $("#LongNote").bind("keyup", function() {
         //$(this).autoResizeTextAreaQ({ "max_rows": 8 });
         //$(this).autoResize();
      });
      $("#btnSave").button().click(function() { UpdateServer("AccidentForm", "Save"); return false; });
      $("#btnCancel").click(function() { LoadAccident_Card(AccidentNo); return false; });
      $("#btnReturnToAccidents").click(function() {
         oGLOBAL.Start.fnSetNewData("", { Ctrl: "tabAccidents", RenderNew: 1, padding: 20 });
         return false;
      });

      //$('#Date').datetimepicker({ numberOfMonths: 2 });
      $("#inputChooseTown").bind("keypress", function() { if($(this).val().length>1) { $("#btnMapTown").button("enable"); } else { $("#btnMapTown").button("disable"); } });
      var eNr=oGLOBAL.GetPar(); eNr=(eNr>0)?("Įvykis Nr:"+eNr):"Naujas įvykis";
      $(".ui-tabs-nav li:last").after("<span class='RightSpanInTab'>"+eNr+"</span>");

      var addToTab=$(document).height()-$('#tabAccidents').outerHeight(true)-$('#divlogindisplay').outerHeight(true)-$('#ulMainMenu').outerHeight(true);
      if(addToTab>0) { $('#tabAccidents').height($('#tabAccidents').height()+addToTab); }
      var Dif=$('#tabAccidents').height()-$('h2').outerHeight(true)-$('#ulWhiteMenu').outerHeight(true)-$('#AccidentForm').outerHeight(true);
      if(Dif>0) { $('div.HalfDivleft1').height($('div.HalfDivleft1').height()+Dif); }
      var MapHeight=$('div.HalfDivleft1').outerHeight(false)-$('#divMapHead').outerHeight(false);
      $('#divMap').height(MapHeight).width('100%');
      oGLOBAL.FormData=$("#AccidentForm").data("ctrl"); //NewRec id Lat Lng
      oGLOBAL.mapFn.loadGoogleMapScript(oGLOBAL.mapFn.loadGMap);
   };
   return false;
   //*****************************************************************************************************************************************
   UpdateServer=function(frm, Action) {
      var cb=this.fnServerUpdated, DataToSave;
      if(Action==="Save") {
         DataToSave=oGLOBAL.ValidateForm(frm);
         if(DataToSave) {
            if(oGLOBAL.FormData.NewRec) {
               if(oGLOBAL.FormData.Lat===0) {
                  DIALOG.Alert("Pažymėkite įvykio vietą pelės spragtelėjimu žemėlapyje..", "Naujo įvykio įvedimas"); return;
               } else {
                  DataToSave.Data.push(oGLOBAL.FormData.Lat); DataToSave.Fields.push("Lat");
                  DataToSave.Data.push(oGLOBAL.FormData.Lng); DataToSave.Fields.push("Lng");
                  DataToSave.Data.push(oGLOBAL.FormData.Country); DataToSave.Fields.push("LocationCountry");
                  DataToSave.Data.push(oGLOBAL.FormData.District); DataToSave.Fields.push("LocationDistrict");
                  DataToSave.Data.push(oGLOBAL.FormData.Address); DataToSave.Fields.push("LocationAddress");
               }
            }
            oGLOBAL.UpdateServer((oGLOBAL.FormData.NewRec)?"Add":"Edit", DataToSave, "tblAccidents", cb);
         } //else alert("Nea");
      }
      if(Action==="Delete") { oGLOBAL.UpdateServer("Delete", { id: oGLOBAL.FormData.id }, "tblAccidents", cb); }
   };
   $("#btn3 a:eq(0)").click(function() { this.UpdateServer($("#Form-Accident-Card"), "Cancel"); });  //Atšaukti pakeitimus
   $("#btn3 a:eq(1)").click(function() {
      if(DefaultTime===$("#Date").val()&&oGLOBAL.FormData.NewRec) {
         DIALOG.Alert("Prašome įvesti tikslų įvykio laiką", "Naujo įvykio įvedimas"); $("#Date").focus(); DefaultTime=""; return;
      } else {
         this.UpdateServer($("#Form-Accident-Card"), "Save");
      }
   });     //Išsaugoti
   $("#btn3 a:eq(2)").click(function() { this.UpdateServer($("#Form-Accident-Card"), "Delete"); });  //Trinti

   this.fnServerUpdated=function(resp, updData) {  //updData["Action"]
      var t, i=oGLOBAL.GetPar(), Msg;
      t="Naujo įvykio išsaugojimas";
      if(resp.ErrorMsg) {
         Msg="Nepavyko išsaugot įrašo."; if(updData.Action==="Delete") { Msg="Nepavyko ištrinti įrašo."; } if(updData.Action==="Edit") { Msg="Nepavyko pakeist įrašo."; }
         Msg+=" Klaida:\n"+resp.ErrorMsg; DIALOG.Alert(Msg, t); return;
      } else {
         if(updData.Action==="Add") {
            Msg="Įvykis išsaugotas."; $.growlUI(t, Msg); setTimeout(function() { oGLOBAL.GetURL(resp.ResponseMsg.Ext); }, 2000);
         } else if(updData.Action==="Edit") {
            Msg="Įvykio duomenys pakeisti."; $.growlUI(t, Msg); // setTimeout("location.reload();", 2000);
         } else {
            Msg="Įvykis ištrintas."; $.growlUI(t, Msg); setTimeout(function() { oGLOBAL.GetURL(-1); }, 2000);
         }
      }
   };
}

oGLOBAL.map=null; //Gmap
oGLOBAL.Ggeocoder=null;
oGLOBAL.FormData={};
oGLOBAL.mapFn={
   GetMapFromTown: function() {
      "use strict"; var Town=$("#inputChooseTown").val();
      oGLOBAL.Ggeocoder.getLocations(Town, oGLOBAL.mapFn.addAddressToMap);
   },
   SetAddress: function(latlng) {
      if(latlng) {
         oGLOBAL.Ggeocoder.getLocations(latlng, function(addresses) {
            if(addresses.Status.code!==200) {
               oGLOBAL.map.SetAddress="Adresas nerastas";
            } else {
               var address=addresses.Placemark[0];
               oGLOBAL.map.SetAddress=address.address;
               oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
            }
         });
      }
   },
   Mapclicked: function(overlay, latlng) {
      "use strict";
      if(latlng) {
         oGLOBAL.FormData.Lat=latlng.y;
         oGLOBAL.FormData.Lng=latlng.x;
         oGLOBAL.Ggeocoder.getLocations(latlng, function(addresses) {
            if(addresses.Status.code!==200) {
               alert("Nepavyko rasti šios vietos adreso - "+latlng.toUrlValue());
            } else {
               var address=addresses.Placemark[0].address;
               var arr=address.split(", "), D1, D2, myHtml, btn;
               oGLOBAL.FormData.Country=arr[arr.length-1];
               try {
                  D1=(addresses.Placemark[2].AddressDetails.Country.AdministrativeArea)?addresses.Placemark[2].AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName:"";  //ignore jslint
               } catch(e) { } //ignore jslint //addresses.Placemark[2].AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.SubAdministrativeAreaName
               D1=(D1)?D1:"";
               D2=arr[(arr.length>1)?(arr.length-2):0];
               oGLOBAL.FormData.District=(D1.length>D2.length)?D1:D2;
               oGLOBAL.FormData.Address=arr[0];
               myHtml=oGLOBAL.FormData.Address+', '+oGLOBAL.FormData.District+', '+oGLOBAL.FormData.Country;
               oGLOBAL.map.openInfoWindow(latlng, myHtml);
               $('#txtPlace').html(oGLOBAL.FormData.Address+', '+oGLOBAL.FormData.District+', '+oGLOBAL.FormData.Country);

               if(!oGLOBAL.FormData.NewRec) {//.css('display', 'inline')
                  if(!$('#ConfirmNewMapData').length) {
                     btn=$('#btnEditMap').clone();
                     btn.attr("id", "ConfirmNewMapData").attr("title", "Patvirtinti įvykio vietą").html("Patvirtinti");
                     //$('#btnEditMap').css('display', 'none').after(btn);
                     $('#btnEditMap').after(btn);
                     $('#ConfirmNewMapData').click(function() {
                        var DataToSave={ Data: [], Fields: [] };
                        DataToSave.Data.push(oGLOBAL.FormData.Lat); DataToSave.Fields.push("Lat");
                        DataToSave.Data.push(oGLOBAL.FormData.Lng); DataToSave.Fields.push("Lng");
                        DataToSave.Data.push(oGLOBAL.FormData.Country); DataToSave.Fields.push("LocationCountry");
                        DataToSave.Data.push(oGLOBAL.FormData.District); DataToSave.Fields.push("LocationDistrict");
                        DataToSave.Data.push(oGLOBAL.FormData.Address); DataToSave.Fields.push("LocationAddress");
                        DataToSave.id=$("#Form-Accident-Card").data("ctrl").id;
                        oGLOBAL.UpdateServer((oGLOBAL.FormData.NewRec)?"Add":"Edit", DataToSave, "tblAccidents", function() {
                           $.growlUI("Duomenų išsaugojimas", "Nauja įvykio vieta išsaugota");
                           oGLOBAL.map.clearOverlays();
                           latlng=new GLatLng(oGLOBAL.FormData.Lat, oGLOBAL.FormData.Lng);  //ignore jslint
                           oGLOBAL.map.setCenter(latlng, 8);
                           var marker=new GMarker(latlng);  //ignore jslint
                           oGLOBAL.map.addOverlay(marker);
                           oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
                           var M=GEvent.addListener(marker, "click", function() { oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress); }); //ignore jslint
                           $('#btnEditMap').attr('title', 'Keisti įvykio vietą').html('Keisti').data("Caption", "Change");
                           $('#ConfirmNewMapData').remove();
                        });
                     });
                  }
               }
            }
         });
      }
   },
   loadGoogleMapScript: function(callback) {
      "use strict";
      //if(typeof GMap2==='function') { return; }     nes antra kart neuzsikrauna
      var script=document.createElement('script');
      //script.setAttribute('src', 'http://maps.google.com/maps?file=api&v=2.133d&key=ABQIAAAAPnON2Rz9y3X5Mqknkx6ddhT2yXp_ZAY8_ufC3CFXhHIE1NvwkxQrQPtphs4ZtOGY_XZ5MXJhHplVBA&async=2&callback=oGLOBAL.mapFn.loadGMap');
      script.setAttribute('src', 'http://maps.google.com/maps?file=api&v=2.133d&key=ABQIAAAAPnON2Rz9y3X5Mqknkx6ddhT2CXUl8nztVe9hJc_0UrwHdCv9pRR14Z_ti-1Z_5Dj_pUHY7QnFqoatQ&async=2&callback=oGLOBAL.mapFn.loadGMap');
      script.setAttribute('type', 'text/javascript');
      document.documentElement.firstChild.appendChild(script);
   },
   addAddressToMap: function(response) {
      oGLOBAL.map.clearOverlays();
      if(response&&response.Status.code!==200) {
         alert("Neradau tokios vietovės - "+decodeURIComponent(response.name));
      } else {
         var place=response.Placemark[0];
         var point=new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
         var Address=place.address.split(", ");
         var Sub=(typeof place.AddressDetails.Country.SubAdministrativeArea==='undefined')?"":"<b>Apskritis:</b> "+place.AddressDetails.Country.SubAdministrativeArea.SubAdministrativeAreaName+"<br>";
         var Adm=(Address.length<3)?"":"<b>Adm. centras:</b> "+Address[1]+"<br>";
         oGLOBAL.map.setCenter(point, 5);
         oGLOBAL.map.openInfoWindowHtml(point, "<b>Vietovardis:</b> "+Address[0]+"<br>"+Adm+Sub+"<b>Šalis:</b> "+place.AddressDetails.Country.CountryName+" ("+place.AddressDetails.Country.CountryNameCode+")");
      }
   },
   loadGMap: function() {
      var EditMap=function() {
         oGLOBAL.map.EventMapclicked=GEvent.addListener(oGLOBAL.map, "click", oGLOBAL.mapFn.Mapclicked);
         oGLOBAL.map.openInfoWindow(oGLOBAL.map.getCenter(), "Spragtelėkit žemėlapyje pažymėti įvykio vietą!");
      };
      if(GBrowserIsCompatible()) {
         //alert(oGLOBAL.FormData.NewRec); alert(oGLOBAL.FormData.Lat); alert(oGLOBAL.FormData.Lng);
         oGLOBAL.map=new GMap2(document.getElementById("divMap"));
         if(!oGLOBAL.FormData.NewRec) {
            var latlng=new GLatLng(oGLOBAL.FormData.Lat, oGLOBAL.FormData.Lng);
            oGLOBAL.map.setCenter(latlng, 8);
            oGLOBAL.map.setUIToDefault(); //oGLOBAL.map.addControl(new GSmallZoomControl());
            oGLOBAL.Ggeocoder=new GClientGeocoder();
            var marker=new GMarker(latlng);
            oGLOBAL.map.addOverlay(marker);
            oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
            var M=GEvent.addListener(marker, "click", function() { oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress); });
            $('#btnEditMap').click(function() {
               var t=$(this);
               if(t.data("Caption")==="Change") {
                  EditMap();
                  t.attr('title', 'Atšaukti įvykio vietos keitimą').html('Atšaukti').data("Caption", "Cancel");
               }
               else {
                  GEvent.removeListener(oGLOBAL.map.EventMapclicked);
                  t.attr('title', 'Keisti įvykio vietą').html('Keisti').data("Caption", "Change");
                  $('#txtPlace').val(oGLOBAL.map.SetAddress);
                  if($('#ConfirmNewMapData').length) { $('#ConfirmNewMapData').remove(); }
                  oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
               }
            });
         } else {
            oGLOBAL.map.setCenter(new GLatLng(54.682961, 25.2740478), 4);
            oGLOBAL.map.setUIToDefault(); //oGLOBAL.map.addControl(new GSmallZoomControl());
            oGLOBAL.Ggeocoder=new GClientGeocoder();
            EditMap();
         }
      }
   }
};