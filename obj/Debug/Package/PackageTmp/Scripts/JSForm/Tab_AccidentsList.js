/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="../JSGeneral/Server.js" />
/// <reference path="../JSGeneral/objData.js" />
/// <reference path="../JSGeneral/objFunc.js" />
/// <reference path="../JSGeneral/clsGrid.js" />

function Tab_AccidentsList(Tab) {
   var UpdateClaims=0, oTable={}, Call_fnRowCallback="Append", RowData, pui_img, ptxt, pWraper, pbtn, HTML, fnRemoveColapsed;

   //--------------img in input----------------------------------------------------------
   pWraper={ classes: "ui-corner-all ui-widget-content", width: 250, style: "float:left;height:2em;" };
   ptxt={ id: "txtAccidentsSearch", classes: "yellow", title: "Įveskite frazę paieškai", notabstop: 1, floatLeft: 1 };
   pui_img={ name: "ui-icon-close", style: "float:right;cursor:pointer;vertical-align:middle;", onclickfn: "$(this).prev().val('');" };
   pbtn={ id: 'dialog_LoadAccident_Card', text: 'Naujas įvykis', classes: 'ui-state-green BtnFontBlue', icon: 'ui-icon-circle-plus', title: 'Registruoti naują įvykį', notabstop: 1, style: 'float:right;font-size:1.3em;' };

   HTML="<div class='CtrlPanel'>"+oCONTROLS.txt_imgINtxt(pWraper, ptxt, pui_img)+oCONTROLS.btnTextImg(pbtn)+"<div style='clear:both;'><h2 style='padding-top:20px;'>Paskutiniai įvykiai:</h2></div></div><div id='divGridAccidents'></div>";
   $("#"+Tab+"-center").html(HTML);
   $('#dialog_LoadAccident_Card').click(function() {
      $("#tabAccidents").empty();
      LoadAccident_Card(0);
   })

   var AccidentsGrid=new clsGRID();
   oTable=AccidentsGrid.Render({ InDivID: "divGridAccidents", GridID: "proc_AccidentsGrid", clickEvtIsLive: 0, colorAfterNewInsert: 0, classes: "display colapsable" },
   { sDom: "rt", fnRowCallback: _fnRowCallback, fnHeaderCallback: _fnHeaderCallback,
      fnInitComplete: function() { t=this; setTimeout(function() { t.fnAdjustColumnSizing(); }, 5); }
   }, oDATA.Get("proc_Accidents"));      //oTable

   Call_fnRowCallback=0; //Kad nesauktu ant fnFilter
   
   
   //$("div.dataTables_scrollHead").remove(); //panaikinam headerio likucius
   
   
   $("#txtAccidentsSearch").keyup(function() {
      oTable.fnFilter(this.value);
   });
   var Resize=function() { oGLOBAL.Start.Ctrl.CheckCtrlHeight({ CtrlName: "#tabAccidents", LayOutPanel: "#tabAccidents-center", FirstResize: false, padding: 20 }); }
   var CancelNewClaimHtml;

   //$('#proc_AccidentsGrid>tbody>tr').live('click', function(e) {
   $('#proc_AccidentsGrid>tbody').bind('click', function(e) {
      var t=(e.target.tagName==='SPAN')?$(e.target).parent()[0]:e.target, //nes chrome clickas ant buttono pataiko ant span'o
       tag=t.tagName, nTr=$(t).closest('tr')[0], trSelected; log(tag);
      if(tag==='LI') { Resize(); return false; }
      else if(tag==='DIV'||tag==='B'||tag==='TD'||tag==='TR') {     //Kazkuri is eiluciu
         if(nTr.id==='trNewClaimCard') { }
         //Ne pagrindine ir ne NewClaimCard, vadinasi ClaimCard row
         else if($(nTr).hasClass('rowHeight')) { fnSetClaimCard(0, $(nTr)); }  //Clickas ant Claim row
         else {//Pagrindine lenteles eilute
            //if($(nTr).hasClass('row_colapsed')) { Resize(); return false; }
            //1-jei clickas ant pasirinktos eilute panaikinam klase ir istrinam apatine eilute('.row_colapsed'),2-ieskom po visa tbl ir padarom ta pati, plius highlitinam ir colapsinam
            //if($(nTr).hasClass('row_selected')&&!UpdateClaims) { $(nTr).removeClass('row_selected ui-widget-header').next().remove(); } // Ant aktyvios - panaikinam
            if($(nTr).hasClass('row_selected')&&!UpdateClaims) { $(nTr).removeClass('row_selected ui-widget-header'); if(typeof fnRemoveColapsed==='function') { fnRemoveColapsed(); } } // Ant aktyvios - panaikinam

            else {
               if(UpdateClaims) {   //Click'as trigeriuotas updatint sitos eitlutes duomenis
                  var ArrData=UpdateClaims.split("|#|"); //, Cols=oDATA.Get("proc_Accidents").Grid.aoColumns, HTML="";
                  //for(var i=0; i<ArrData.length; i++) {  if(typeof Cols[i].bVisible==='undefined') { HTML+="<td>"+ArrData[i]+"</td>"; }  }
                  //var aData=oTable.fnGetData(oTable.fnGetPosition(nTr));
                  //var pos=oTable.fnGetPosition(nTr);
                  Call_fnRowCallback="Replace";
                  oTable.fnUpdate(ArrData, nTr); //just update not render
                  UpdateClaims=0; Call_fnRowCallback=0;
               } else {
                  $('#proc_AccidentsGrid>tbody>tr').removeClass('row_selected ui-widget-header').filter(".row_colapsed"); //.remove();
                  if(typeof fnRemoveColapsed==='function') { fnRemoveColapsed(); }
                  $(nTr).addClass("row_selected ui-widget-header");
               }
               //--------------------------------------------------
               //RowData=oTable.fnGetData(oTable.fnGetPosition(nTr));
               //--------------------------------------------------
               var trColapsed=oTable.fnOpen(nTr, fnGetClaimsTR(oTable, nTr), "td_inrow_colapsed"); //klase "row_colapsed" dedama fnGetClaimsTR(), kitas variantas imti ka pargrazina fnOpen(TR) ir dadet classe
               $(trColapsed).addClass("row_colapsed").find("td.td_inrow_colapsed").attr("colspan", "6").attr("id", "td_row_colapsed");
               //$(nTr).after("<tr class='row_colapsed'><td class='td_inrow_colapsed' colspan='6'>"+fnGetClaimsTable(oTable, nTr)+'</tr>');
               fnRemoveColapsed=function() { oTable.fnClose(nTr); }
            }
         }
      }
      else if(tag==='BUTTON'||tag==='A') {
         var id=(t.id)?t.id:0;
         if(id==='btnClaimTypes') {
            log("Tab_AccidentsList btnClaimTypes live click #114");
            $(t).replaceWith("<div id='divNewClaimCard' data-ctrl='{\"id\":\"0\",\"NewRec\":\"1\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\"0\"}'></div>"); //ClaimTypeID ikis selectas
            //d={ctrl:??,oDATA:??, opt:{text:??,val:??,FieldName:??,SelectText:??},fnAfterOptClick:?? }   style="background-color:white"
            d={ ctrl: $('#divNewClaimCard'), oDATA: oDATA.Get("tblClaimTypes"), opt: { val: 0, text: 1, FieldName: "ClaimTypeID", SelectText: "Pasirinkite žalos tipą:" },
               fnAfterOptClick: function(T) {
                  $('#trNewClaimCard').find('div.HalfDivleft,div.HalfDivright,div.frmbottom').remove();
                  fnSetClaimCard(1, T);

                  //if($('#trNewClaimCard td .frmbottom').length==0) { fnSetClaimCard(1, T); }
               },
               fnCancel: function() { $(nTr).find('td').html(CancelNewClaimHtml); }
            };
            oCONTROLS.Set_Updatable_HTML.mega_select_list(d);
            return false;
         }
         else if(id==='btnCancelClaim') {
            if($(t).hasClass("NewClaim")) {
               $(nTr).find('td').html(CancelNewClaimHtml); return false;
            } else { $("#trClaimCard").prev().removeClass("ClaimIsOpen").end().remove(); }
         }
         else if($(t).hasClass('btnSaveClaim')) {
            var cb=fnServerUpdated, frm, Action, Msg;
            if($(e.target).hasClass("NewClaim")) {
               frm=$('#divNewClaimCard'); Action='Add'; Msg={ Title: "Naujos žalos sukūrimas", Success: "Nauja žala sukurta.", Error: "Nepavyko išsaugot naujos žalos." }
            } else { frm=$('#divClaimCard'); Action='Edit'; Msg={ Title: "Žalos redagavimas", Success: "Žalos duomenys pakeisti.", Error: "Nepavyko pakeisti žalos duomenų." }; }
            var DataToSave=oGLOBAL.ValidateForm(frm, [{ Fields: "AccidentID", Data: $('#tblClaims').data('ctrl').AccidentID }, { Fields: "ClaimTypeID", Data: frm.data("ctrl").ClaimTypeID}]);
            if(DataToSave) {
               DataToSave["Ext"]=$('#tblClaims').data('ctrl').AccidentID;
               var opt={ Action: Action, DataToSave: DataToSave,
                  CallBack: {
                     Success: function(resp) { UpdateClaims=resp.ResponseMsg.Ext; $("tr.row_selected").trigger("click"); }
                  }, Msg: Msg
               };
               oGLOBAL.UpdateServer(opt);
            }
         }
         else if(id==='btnDelete') {
            DIALOG.Confirm("Ar tikrai norite ištrinti pasirinktą žalą?", "Žalos pašalinimas", function() {
               var ClaimNo=$('tr.ClaimIsOpen').find('td:eq(1)').html();
               //Action, DataToSave:{}, callBack:{Success:??,Error:??}, Msg:{Title:??,Success:??,Error:??}
               var opt={ Action: "Delete",
                  DataToSave: { id: $('#divClaimCard').data('ctrl').id, DataTable: "tblClaims", Ext: $('#tblClaims').data('ctrl').AccidentID },
                  CallBack: {
                     Success: function(resp) { UpdateClaims=resp.ResponseMsg.Ext; $("tr.row_selected").trigger("click"); }
                  }, //{ Success: { DeleteRow: nTr, oTable: oTable} },
                  Msg: { Title: "Žalos pašalinimas", Success: "Žala Nr.:"+ClaimNo+" sėkmingai ištrinta.", Error: "Žalos Nr.:"+ClaimNo+" nepavyko ištrinti." }
               };
               oGLOBAL.UpdateServer(opt);
            });
         }
      }
      Resize(); //return false;
   });
   //-------------Grid rendering---End----------------------------------------------------------------------------------------------------
   function fnGetClaimsTR(oTable, nTr) {
      var Complete="<span class='ui-state-green'><span title='Ši žala baigta reguliuoti' class='ui-icon ui-icon-check'></span></span>";
      var NotComplete=""; //"<span title='Ši žala dar nebaigta reguliuoti' class='ui-icon ui-icon-alert'></span>";

      var aData=oTable.fnGetData(nTr);
      var Claims=aData[13].replace(new RegExp('{{(.*?)}}', 'gm'), ''); //Iskertam nenaudojamus tarp{{ ir}}//?-kad nebutu greedy
      var Claims2=eval('('+aData[14]+')');
      //"{#CMR|ZZ998|Lietuvos Draudimas|{:0:}|60000#}{#KASCO|ZZ998|Ergo Lietuva|{:2:}|120000#}"
      Claims=Claims.replace(/{#/g, '<tr><td>')
                  .replace(/#}/g, "</td><td><a href='javascript:void(0);' class='aClaimRegulation' style='float: right;'>Reguliavimas</a></td></tr>")
                  .replace(/\|/g, "</td><td>").replace(/\{:2:\}/g, Complete).replace(/\{:0:\}/g, NotComplete);
      var ArrClaims=Claims.split('<tr><td>'), ClaimsHTML="";
      for(var i=0; i<ArrClaims.length-1; i++) {
         ClaimsHTML+="<tr class='rowHeight' data-ctrl='{\"ID\":"+Claims2[i][0]+",\"VehicleID\":"+Claims2[i][1]+",\"InsPolicyID\":"+Claims2[i][2]+",\"InsuranceClaimAmount\":"+Claims2[i][3]+",\"InsurerClaimID\":\""+Claims2[i][4]+"\",\"IsTotalLoss\":"+Claims2[i][5]+",\"IsInjuredPersons\":"+Claims2[i][6]+",\"Days\":"+Claims2[i][7]+",\"PerDay\":"+Claims2[i][8]+"}'><td>";
         ClaimsHTML+=ArrClaims[i+1];
      }
      var sOut="<table id='tblClaims' class='tblcolapsable' data-ctrl='{\"AccidentID\":\""+aData[0]+"\"}'><tbody>";
      sOut+=ClaimsHTML;
      sOut+="<tr id='trNewClaimCard'><td colspan='7' >"; // class='tblcolapsable'
      var pbtn={ id: 'btnClaimTypes', text: 'Nauja žala', classes: 'BtnFontBlue ui-state-green', icon: 'ui-icon-circle-plus', title: 'Registruoti naują žalą', notabstop: 1 }
      CancelNewClaimHtml=oCONTROLS.btnTextImg(pbtn);
      sOut+=CancelNewClaimHtml;
      sOut+="</td</tr></tbody></table>";
      //return "<tr class='row_colapsed'><td colspan='6' id='td_row_colapsed'>"+sOut+"</td></tr>";
      return sOut;
   }

   //      var pbtn={ id: 'dialog_NewEventWindow', text: 'Naujas įvykis', icon: 'ui-icon-circle-plus', title: 'Registruoti naują įvykį', notabstop: 1, floatRight: 1 }
   //oCONTROLS.btnTextImgGreen(pbtn)
   //Naujas ivykis
   //<button class="BtnClassGreen ui-button ui-corner-all ui-button-text-icon-primary" title="Registruoti naują įvykį" tabindex="-1" style="float: right;" id="dialog_NewEventWindow"><span class="ui-button-icon-primary ui-icon ui-icon-circle-plus"></span><span class="ui-button-text">Naujas įvykis</span></button>
   //Atsaukti ir issaugoti buttonai
   //<button class="btnSaveClaim ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right" role="button" aria-disabled="false"><span class="ui-button-text">Išsaugoti</span></button>

   function fnSetClaimCard(NewRec, T) { //T, NewRec
      var Claim;
      if(NewRec) {
         Claim={ TypeText: T.text(), TypeID: T.data('val'), VehicleID: 0, InsPolicyID: 0, InsurerClaimID: "", InsuranceClaimAmount: 0, IsTotalLoss: 0, IsInjuredPersons: 0, Days: 5, PerDay: 500, LossAmount: ((T.data('ctrl')===6)?2500:0) };
         $('#divNewClaimCard').append(fnGetClaimCard(NewRec, Claim));
      } else {
         if(T.hasClass("ClaimIsOpen")) { T.removeClass("ClaimIsOpen"); T.next().remove(); return; } else { T.parent().find("tr").removeClass("ClaimIsOpen"); T.addClass("ClaimIsOpen"); }
         tds=T.find('td'),
           txt=tds[2].innerHTML,
            TypeID=oDATA.Get("tblClaimTypes").Data.findColValByColVal(txt, 1, 0);
         var dt=T.data('ctrl');
         Claim={ ID: dt.ID, TypeID: TypeID, LossAmount: tds[5].innerHTML, VehicleID: dt.VehicleID, InsPolicyID: dt.InsPolicyID,
            InsuranceClaimAmount: dt.InsuranceClaimAmount, InsurerClaimID: dt.InsurerClaimID, IsTotalLoss: dt.IsTotalLoss,
            IsInjuredPersons: dt.IsInjuredPersons, Days: dt.Days, PerDay: dt.PerDay
         };
         $('#trClaimCard').remove();
         T.after("<tr id='trClaimCard' style='background-color:"+(T.css('background-color'))+"'><td colspan='7'>"+fnGetClaimCard(0, Claim)+"</td</tr>");
      }
      //oCONTROLS.AppendFuncToForm.ComboBox('#divClaimCard');
      oCONTROLS.UpdatableForm((NewRec)?'#divNewClaimCard':'#divClaimCard');
      //$("#inputDays").numeric(); $("#inputDays,#inputPerDay").numeric({ allow: ".," });
      $("#inputDays").ValidateOnBlur({ Allow: 'Integer' }); $("#inputPerDay,.LossAmount,.InsuranceClaimAmount").ValidateOnBlur({ Allow: 'Decimal' });
      $("#inputDays,#inputPerDay").live('keyup change', function(e) {
         var t=$(this); t.val(t.val().replace(',', '.'));
         var Days=$("#inputDays").val(), PerDay=$("#inputPerDay").val(), v=(Math.round((Days*PerDay*100))/100);
         if(oGLOBAL.Validate.IsNumeric(v)) $("#inputSum").val(v); else $("#inputSum").val("??");
      });
   }
   function fnGetClaimCard(NewRec, Claim) {
      var HTML=""; // ArrVehicles=oDATA.Get("tblVehicles").Data;
      //var lstVehicles=exec_GetOptionListHTML(ArrVehicles, "lstVehicles", 0, [1, 5, 3, 4], Claim.VehicleID); lstVehicles=lstVehicles.replace("<select", "<select data-ctrl='{\"UpdateField\":\"VehicleID\",\"Value\":\""+Claim.VehicleID+"\"}'").replace("</select>", "<option value=\"-1\">Redaguoti sąrašą..</option></select>");

      //      var lstVehicles=oCONTROLS.OptionList(
      //      { Arr: ArrVehicles, id: "lstVehicles", ValI: 0, TextI: [1, 2, 3, 4], SelectedID: Claim.VehicleID, ReplaceArr: [{ Ix: 1, txtIx: 1, obj: oDATA.Get("tblVehicleMakes")}] }
      //      ); //2 - MakeID replacinam tblVehicleMakes.Name
      //      lstVehicles=lstVehicles.replace("<select", "<select data-ctrl='{\"UpdateField\":\"VehicleID\",\"Value\":\""+Claim.VehicleID+"\"}'");

      //if(NewRec) HTML="<div id='divNewClaimCard' data-ctrl=\'{\"id\":\"0\",\"NewRec\":\"1\",\"ClaimTypeID\":\""+Claim.TypeID+"\"}\'><div>Naujos žalos įvedimas, žalos tipas: '"+Claim.TypeText+"'</div>";
      //else

      var lstVehicles="<div class='ExtendIt' data-ctrl='{\"Value\":"+Claim.VehicleID+",\"Field\":\"VehicleID\",\"classes\":\"UpdateField\",\"id\":\"lstVehicles\",\"labelType\":\"Top\"}'></div>";
      var lstInsPolicies="<div class='ExtendIt' data-ctrl='{\"Value\":"+Claim.InsPolicyID+",\"Field\":\"InsPolicyID\",\"classes\":\"UpdateField\",\"id\":\"lstInsPolicies\",\"labelType\":\"Top\"}'></div>";

      if(!NewRec) HTML="<div id='divClaimCard' data-ctrl='{\"id\":\""+Claim.ID+"\",\"NewRec\":\"0\",\"Source\":\"tblClaims\",\"ClaimTypeID\":\""+Claim.TypeID+"\"}'>";
      if(Claim.TypeID==6) {
         HTML+="<div class='HalfDivleft'>";
         HTML+="<div class='ExtendIt' data-ctrl='{\"Value\":"+Claim.Days+",\"Field\":\"Days\",\"classes\":\"UpdateField\",\"id\":\"inputDays\",\"labelType\":\"Top\"}'></div>";
         HTML+="<div class='ExtendIt' data-ctrl='{\"Value\":"+Claim.PerDay+",\"Field\":\"PerDay\",\"classes\":\"UpdateField\",\"id\":\"inputPerDay\",\"labelType\":\"Top\"}'></div>";

         //HTML+="<div class='ExtendIt' data-ctrl='{\"Value\":"+Claim.LossAmount+",\"id\":\"inputSum\",\"attr\":\"DISABLED\",\"labelType\":\"Top\"}'></div>"; //(Math.round((Claim.Days*Claim.PerDay*100))/100)
         HTML+="<div>"+oCONTROLS.txt({ "text": 2500, "title": "Nuostolio suma", "classes": 'text', "id": "inputSum", "attr": "DISABLED", "label": { "txt": "Nuostolio suma", "type": "Top"} })+"</div>";

         HTML+="</div><div class='HalfDivright'>";
         HTML+=lstVehicles;
      } else {
         HTML+="<div class='HalfDivleft'>";
         HTML+=lstVehicles+lstInsPolicies;
         HTML+="<div class='ExtendIt' a='1' data-ctrl='{\"Value\":\""+Claim.InsurerClaimID+"\",\"Field\":\"InsurerClaimID\",\"classes\":\"UpdateField\",\"labelType\":\"Top\"}'></div>";

         HTML+="</div><div class='HalfDivright'>";
         HTML+="<div class='ExtendIt' a='2' data-ctrl='{\"Value\":"+Claim.LossAmount+",\"Field\":\"LossAmount\",\"classes\":\"LossAmount UpdateField\",\"labelType\":\"Top\"}'></div>";
         HTML+="<div class='ExtendIt' a='3' data-ctrl='{\"Value\":"+Claim.InsuranceClaimAmount+",\"Field\":\"InsuranceClaimAmount\",\"classes\":\"InsuranceClaimAmount UpdateField\",\"labelType\":\"Top\"}'></div>";
         if(Claim.TypeID==1) {
            HTML+="<div class='ExtendIt' data-ctrl='{\"Value\":"+Claim.IsTotalLoss+",\"Field\":\"IsTotalLoss\",\"classes\":\"UpdateField\",\"labelType\":\"Top\"}'></div>";
            //HTML+="<div><span class='dialog-form-label divLeft'>Visiškas praradimas:</span><input type='checkbox' class='UpdateField' tabindex=-1 "+((Claim.IsTotalLoss)?"checked":"")+" id='chkTotalLoss' data-ctrl='{\"UpdateField\":\"IsTotalLoss\",\"Value\":\""+Claim.IsTotalLoss+"\"}'></div>";
         } else if(Claim.TypeID==2) {
            HTML+="<div class='ExtendIt' a='4' data-ctrl='{\"Value\":"+Claim.IsInjuredPersons+",\"Field\":\"IsInjuredPersons\",\"classes\":\"UpdateField\",\"labelType\":\"Top\"}'></div>";
            //HTML+="<div><span class='dialog-form-label divLeft'>Įvykio metu buvo sužaloti žmonės:</span><input class='UpdateField' type='checkbox' tabindex=-1 "+((Claim.IsInjuredPersons)?"checked":"")+" id='chkTotalLoss' data-ctrl='{\"UpdateField\":\"IsInjuredPersons\",\"Value\":\""+Claim.IsInjuredPersons+"\"}'></div>";
         }
      }
      HTML+="</div><div class='frmbottom'>";
      if(!NewRec) { HTML+=oCONTROLS.btnImgOnly({ id: "btnDelete", icon: "ui-icon-trash", classes: "floatleft", title: "ištrinti žalą" }); }
      HTML+="<div class='floatright'>"+oCONTROLS.btnTextOnly({ classes: ("BtnBackGreen btnSaveClaim"+((NewRec)?" NewClaim":"")), title: "Išsaugoti pakeitimus", text: "IŠSAUGOTI" });
      HTML+=oCONTROLS.a({ id: "btnCancelClaim", classes: ((NewRec)?" NewClaim":""), title: "Atšaukti pakeitimus", value: "Atšaukti" });
      HTML+="</div></div></div>";
      return HTML;
   }
   //   function fnServerUpdated(resp, updData) {  //updData["Action"]
   //      var i=oGLOBAL.GetPar();
   //      var t="Žalų redagavimas", Msg;
   //      if(resp.ErrorMsg) {
   //         Msg="Nepavyko išsaugot naujos žalos."; if(updData.Action=="Delete") { Msg="Nepavyko ištrinti žalos."; } if(updData.Action=="Edit") { Msg="Nepavyko pakeist žalos duomenų."; }
   //         Msg+=" Klaida:\n"+resp.ErrorMsg; DIALOG.Alert(Msg, t); return false;
   //      } else {
   //         UpdateClaims=resp.ResponseMsg.Ext; //Padedu naujus duomenis
   //         $('table tbody tr.row_selected').trigger("click"); //Po clicko pats atsirefresins
   //         if(updData.Action=="Add") {
   //            Msg="Nauja žala išsaugota."; $.growlUI(t, Msg);
   //         } else if(

   //            updData.Action=="Edit") {
   //            Msg="Žalos duomenys pakeisti."; $.growlUI(t, Msg);
   //         } else {
   //            Msg="Žala ištrinta."; $.growlUI(t, Msg);
   //         }
   //      }
   //   }
   //------------RowClicked---End----------------------------------------------------------------------------------------------------------------

   function _fnRowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      // function _fnRowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
      if(!Call_fnRowCallback) return nRow;
      else {
         //var p="<a href='/Cards/Accident/"+aData[1]+"' class='dialog_OpenAccidentWindow ui-corner-all ui-widget' title='Atidaryti šį įvykį'><span class='ui-icon ui-icon-pencil'></span></a>",
         //var p="<a href='/Accident/GetAccident/"+aData[1]+"' class='dialog_OpenAccidentWindow' title='Atidaryti šį įvykį'><img style='border:none;' src='/Content/images/mono_edit.png' alt='Redaguoti įvykį'/></a>",
         var p="<a href='#' onclick=\"$('#tabAccidents').empty();LoadAccident_Card("+aData[1]+");return false;\"' class='dialog_OpenAccidentWindow' title='Atidaryti šį įvykį'><img style='border:none;' src='/Content/images/mono_edit.png' alt='Redaguoti įvykį'/></a>",

         html=('<td ><b>'+aData[2]+'</b></td><td><div><b>'   //Data
               +aData[3]+'</b></div>'+aData[4]+'</td><td><div><b>'    //Place ir AccType
               +aData[9]+'</b></div>'+aData[7]+'</td><td align="right"><div style="width:8em;">Visos žalos: <b>'  //ShortNote ir LossSum
               +aData[5]+'</b></div>Atviros: <b>'+aData[6]+'</b></td><td>'+p+'</td>');  //CNo_All ir CNo_NotF ir pav.
         if(Call_fnRowCallback==="Append") { $(nRow).append(html); } else {
            $(nRow).html("<td>"+aData[1]+"</td>"+html);
         }
      }
      return nRow;
      //      $(nRow).append('<td ><b>'+aData[2]+'</b></td><td><div><b>'   //Data
      //               +aData[3]+'</b></div>'+aData[4]+'</td><td><div><b>'    //Place ir AccType
      //               +aData[9]+'</b></div>'+aData[7]+'</td><td align="right"><div>Visos žalos: <b>'  //ShortNote ir LossSum
      //               +aData[5]+'</b></div>Atviros: <b>'+aData[6]+'</b></td><td>'+p+'</td>');  //CNo_All ir CNo_NotF ir pav.
   }




   function _fnHeaderCallback(nHead, aasData, iStart, iEnd, aiDisplay) {
      //$(nHead).append('<th class="ui-state-default">Kas atsitiko22</th>');
      //$(nHead).html("<th width='15%'><th width='20%'><th width='20%'><th width='30%'><th width='10%'>");
      $(nHead).html("");
      //$(nHead).html("<th width='15%'></th><th width='20%'></th><th width='20%'></th><th width='30%'></th><th width='10%'></th>");

      return nHead;
   }
   //   -------------------------------------------------------------------------------------------------------------------------------------------
   //   window.setTimeout('$("#rdPeriodGroup").buttonset().find("#rdAll").trigger("click");', 0); //clickas ant grido, kuris paleidzia koda
   return oTable;
}