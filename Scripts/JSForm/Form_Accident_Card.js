/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSGeneral/Server.js" />
/// <reference path="../JSGeneral/clsDialogUI.js" />
/// <reference path="../JSGeneral/objFunc.js" />

/*global alert:false, $: false, jQuery: false, oGLOBAL:false, oSIZES:false, DIALOG:false,console:false, document:false, setTimeout:false, location:false, address:false,GLatLng:false,GMarker:false,GEvent:false,GBrowserIsCompatible:false,GClientGeocoder:false,GMap2:false */

function LoadAccident_Card(AccidentNo) {
   "use strict"; var UpdateServer, DefaultTime, fnChangeCheck, fnChange, LoadScript;
   CallServer("{'AccidentNo':"+AccidentNo+"}", oGLOBAL.Start.fnSetNewData, { Ctrl: "tabAccidents", RenderNew: 1, fnCallBack: function() { LoadScript(); } }, "/Accident/GetAccident", "json");

   //oGLOBAL.temp=this;

   LoadScript=function() {
      $("#btnMapTown").button({ disabled: true }).click(function() { oGLOBAL.mapFn.GetMapFromTown(); return false; });

      //$("#LongNote").autoResize();
      $("#LongNote").bind("keyup", function() {
         //$(this).autoResizeTextAreaQ({ "max_rows": 8 });
         //$(this).autoResize();
      });

      //??
      $("#btnSave").button().click(function() {
         var DataToSave=oGLOBAL.ValidateForm($("#AccidentForm")), Action, Msg;
         if(DataToSave) {
            if(oGLOBAL.AccidentForm.NewRec) {
               if(!(oGLOBAL.AccidentForm.Lat)?1:0) {
                  DIALOG.Alert("Pažymėkite įvykio vietą pelės spragtelėjimu žemėlapyje..", "Naujo įvykio įvedimas"); return;
               } else {
                  DataToSave.Data.push(oGLOBAL.AccidentForm.Lat); DataToSave.Fields.push("Lat");
                  DataToSave.Data.push(oGLOBAL.AccidentForm.Lng); DataToSave.Fields.push("Lng");
                  DataToSave.Data.push(oGLOBAL.AccidentForm.Country); DataToSave.Fields.push("LocationCountry");
                  DataToSave.Data.push(oGLOBAL.AccidentForm.District); DataToSave.Fields.push("LocationDistrict");
                  DataToSave.Data.push(oGLOBAL.AccidentForm.Address); DataToSave.Fields.push("LocationAddress");
               }
               Msg={ Title: "Naujo įvykio įvedimas", Success: "Naujas įvykis pridėtas", Error: "Nepavyko pridėti naujo įvykio." };
               Action="Add";
            }
            else {
               Msg={ Title: "Įvykio duomenų keitimas", Success: "Duomenys sėkmingai pakeisti", Error: "Nepavyko pakeisti duomenų." };
               Action="Edit";
            }

            oGLOBAL.UpdateServer({ Action: Action, DataToSave: DataToSave,
               CallBack: { Success: function(resp) {
                  //CallServer("", oGLOBAL.Start.fnSetNewData, { "Ctrl": "tabAccidents" }, "/Main/tabAccidents", "json");
                  CallServer("", oGLOBAL.Start.fnSetNewData, {}, "/Accident/AccidentsList", "json"); //Atsisiunciam atnaujinta lista
                  if(oGLOBAL.AccidentForm.NewRec) { $('#tabAccidents').empty(); LoadAccident_Card(resp.ResponseMsg.Ext); return false; }
               }
               }, Msg: Msg
            });
         }
         return false;
      });

      $("#btnCancel").click(function() { LoadAccident_Card(AccidentNo); return false; });
      $("#btnReturnToAccidents").click(function() {
         oGLOBAL.Start.fnSetNewData("", { Ctrl: "tabAccidents", RenderNew: 1, padding: 20 });
         return false;
      });

      //$('#Date').datetimepicker({ numberOfMonths: 2 });
      $("#inputChooseTown").bind("keypress", function() { if($(this).val().length>1) { $("#btnMapTown").button("enable"); } else { $("#btnMapTown").button("disable"); } });
      //var eNr=oGLOBAL.GetPar(); eNr=(eNr>0)?("Įvykis Nr:"+eNr):"Naujas įvykis";
      //$(".ui-tabs-nav li:last").after("<span class='RightSpanInTab'>"+eNr+"</span>");

      var addToTab=$(document).height()-$('#tabAccidents').outerHeight(true)-$('#divlogindisplay').outerHeight(true)-$('#ulMainMenu').outerHeight(true);
      if(addToTab>0) { $('#tabAccidents').height($('#tabAccidents').height()+addToTab); }
      var Dif=$('#tabAccidents').height()-$('h2').outerHeight(true)-$('#ulWhiteMenu').outerHeight(true)-$('#AccidentForm').outerHeight(true);
      if(Dif>0) { $('div.HalfDivleft1').height($('div.HalfDivleft1').height()+Dif); }
      var MapHeight=$('div.HalfDivleft1').outerHeight(false)-$('#divMapHead').outerHeight(false);
      $('#divMap').height(MapHeight).width('100%');
      oGLOBAL.AccidentForm=$("#AccidentForm").data("ctrl"); //NewRec id Lat Lng
      oGLOBAL.mapFn.loadGoogleMapScript(oGLOBAL.mapFn.loadGMap);
   };
   return false;
   //*****************************************************************************************************************************************
}
oGLOBAL.map=null; //Gmap
oGLOBAL.Ggeocoder=null;
oGLOBAL.AccidentForm={};
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
               oGLOBAL.map.SetAddress=oGLOBAL.mapFn.fnGetAddress(addresses.Placemark);
               //var address=addresses.Placemark[0];
               //oGLOBAL.map.SetAddress=address.address;
               oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress);
            }
         });
      }
   },
   fnGetAddress: function(p) {
      var len=p.length, btn;
      var address=p[0].address, district=(len>3)?p[3].address:"", address1=(len>1)?p[1].address:"", address2=(len>2)?p[2].address:"";
      var ArrAddr=address.split(', '), ArrDistr=district.split(', '), ArrAddr1=address1.split(', '), ArrAddr2=address2.split(', '), Last=(ArrAddr.length>1)?ArrAddr.length-2:0;
      oGLOBAL.AccidentForm.Country=ArrAddr[ArrAddr.length-1];
      oGLOBAL.AccidentForm.District=(ArrDistr[0])?ArrDistr[0]:((ArrAddr.length>1)?ArrAddr[ArrAddr.length-2]:"");

      if(ArrAddr[Last].search(ArrDistr[0])> -1) { Last--; } //Neimam paskutinio, nes jis jau yra apskrities pavadinime
      if(Last=== -1) { oGLOBAL.AccidentForm.Address=""; } else {
         if(ArrAddr[Last].search(ArrAddr1[0])=== -1) { ArrAddr[Last]+=", "+ArrAddr1[0]; } //Pridedu prie paskutinio Addr1 jei jo nera
         if(ArrAddr[Last].search(ArrAddr2[0])=== -1) { ArrAddr[Last]+=", "+ArrAddr2[0]; } //Pridedu prie paskutinio Addr2 jei jo nera
         address=ArrAddr.splice(0, Last+1);
         oGLOBAL.AccidentForm.Address=address.join(', ');
      }
      return ((oGLOBAL.AccidentForm.Address)?(oGLOBAL.AccidentForm.Address+', '):"")+oGLOBAL.AccidentForm.District+', '+oGLOBAL.AccidentForm.Country;
   },
   Mapclicked: function(overlay, latlng) {
      "use strict";
      if(latlng) {
         oGLOBAL.AccidentForm.Lat=latlng.y;
         oGLOBAL.AccidentForm.Lng=latlng.x;
         oGLOBAL.Ggeocoder.getLocations(latlng, function(addresses) {
            if(addresses.Status.code!==200) {
               DIALOG.Alert("Nepavyko rasti šios vietos adreso - "+latlng.toUrlValue(), "Nepavyko rasti adreso", 2000);
            } else {
               var place=oGLOBAL.mapFn.fnGetAddress(addresses.Placemark);
               oGLOBAL.map.openInfoWindow(latlng, place);
               $('#txtPlace').html(place);

               if(!oGLOBAL.AccidentForm.NewRec) {//.css('display', 'inline')
                  if(!$('#ConfirmNewMapData').length) {
                     //btn=$('#btnEditMap').clone(); //.attr("display", "inline-block");
                     //btn.attr("id", "ConfirmNewMapData").attr("title", "Patvirtinti įvykio vietą").html("Patvirtinti");
                     //$('#btnEditMap').after(btn);
                     $('<a id="ConfirmNewMapData" href="javascript:void(0);return false;">Patvirtinti</a>').insertAfter('#btnEditMap').button();
                     $('#ConfirmNewMapData').click(function() {
                        var DataToSave={ Data: [], Fields: [], DataTable: $("#AccidentForm").data("ctrl").Source };
                        DataToSave.Data.push(oGLOBAL.AccidentForm.Lat); DataToSave.Fields.push("Lat");
                        DataToSave.Data.push(oGLOBAL.AccidentForm.Lng); DataToSave.Fields.push("Lng");
                        DataToSave.Data.push(oGLOBAL.AccidentForm.Country); DataToSave.Fields.push("LocationCountry");
                        DataToSave.Data.push(oGLOBAL.AccidentForm.District); DataToSave.Fields.push("LocationDistrict");
                        DataToSave.Data.push(oGLOBAL.AccidentForm.Address); DataToSave.Fields.push("LocationAddress");
                        DataToSave.id=$("#AccidentForm").data("ctrl").id;

                        oGLOBAL.UpdateServer({ Action: "Edit", DataToSave: DataToSave,
                           CallBack: { Success: function(resp) {
                              oGLOBAL.map.clearOverlays();
                              latlng=new GLatLng(oGLOBAL.AccidentForm.Lat, oGLOBAL.AccidentForm.Lng);  //ignore jslint
                              oGLOBAL.map.setCenter(latlng, 8);
                              var marker=new GMarker(latlng);  //ignore jslint
                              oGLOBAL.map.addOverlay(marker);
                              oGLOBAL.mapFn.SetAddress(latlng);  //Ikisa i oGlobal.map.SetAddress
                              var M=GEvent.addListener(marker, "click", function() { oGLOBAL.map.openInfoWindow(latlng, oGLOBAL.map.SetAddress); }); //ignore jslint
                              $('#btnEditMap').attr('title', 'Keisti įvykio vietą').html('Keisti').data("Caption", "Change");
                              $('#ConfirmNewMapData').remove();
                           }
                           }, Msg: { Title: "Įvykio vietos keitimas", Success: "Įvykio vieta pakeista.", Error: "Nepavyko pakeist įvykio vietos." }
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
      if(typeof GMap2==='function') { callback(); return; }
      var script=document.createElement('script');
      script.setAttribute('src', 'http://maps.google.com/maps?file=api&v=2.133d&key=ABQIAAAAPnON2Rz9y3X5Mqknkx6ddhT2CXUl8nztVe9hJc_0UrwHdCv9pRR14Z_ti-1Z_5Dj_pUHY7QnFqoatQ&async=2&callback=oGLOBAL.mapFn.loadGMap');
      script.setAttribute('type', 'text/javascript');
      document.documentElement.firstChild.appendChild(script);
   },
   addAddressToMap: function(response) {//Naudojamas vietovardžių paieškai
      oGLOBAL.map.clearOverlays();
      if(response&&response.Status.code!==200) {
         alert("Neradau tokios vietovės - "+decodeURIComponent(response.name));
      } else {
         //var place=oGLOBAL.mapFn.fnGetAddress(response.Placemark);
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
         //alert(oGLOBAL.AccidentForm.NewRec); alert(oGLOBAL.AccidentForm.Lat); alert(oGLOBAL.AccidentForm.Lng);
         oGLOBAL.map=new GMap2(document.getElementById("divMap"));
         if(!oGLOBAL.AccidentForm.NewRec) {
            var latlng=new GLatLng(oGLOBAL.AccidentForm.Lat, oGLOBAL.AccidentForm.Lng);
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