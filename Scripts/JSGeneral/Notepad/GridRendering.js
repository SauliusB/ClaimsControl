   pWraper={ classes: "ui-corner-all ui-widget-content", width: 250, style: "float:left;" };
   ptxt={ id: "txtAccidentsSearch", classes: "yellow", title: "Áveskite frazæ paieðkai", notabstop: 1, floatLeft: 1 };
   pui_img={ name: "ui-icon-close", style: "float:right;cursor:pointer;vertical-align:middle;", onclickfn: "$(this).prev().val('');" };
   pbtn={ id: 'dialog_LoadAccident_Card', text: 'Naujas ávykis', classes: 'ui-state-green BtnFontBlue', icon: 'ui-icon-circle-plus', title: 'Registruoti naujà ávyká', notabstop: 1, style: 'float:right;font-size:1.3em;' };

   HTML="<div id='AccidentsPanel'>"+oCONTROLS.txt_imgINtxt(pWraper, ptxt, pui_img)+oCONTROLS.btnTextImg(pbtn);
   HTML+="<div style='clear:both;'><h2 style='padding-top:20px;'>Paskutiniai ávykiai:</h2></div></div><div id='divGridAccidents'></div>";
   $("#"+Tab+"-center").html(HTML);
   
   //-------------------------------
   
      var AccidentsGrid=new clsGRID();
   oTable=AccidentsGrid.Render({ InDivID: "divGridAccidents", GridID: "proc_AccidentsGrid", clickEvtIsLive: 0, colorAfterNewInsert: 0, classes: "display colapsable" },
   { sDom: "rt", fnRowCallback: _fnRowCallback, fnHeaderCallback: _fnHeaderCallback,
      fnInitComplete: function() { t=this; setTimeout(function() { t.fnAdjustColumnSizing(); }, 5); }
   }, oDATA.Get("proc_Accidents"));      //oTable

      $("#txtAccidentsSearch").keyup(function() {
      oTable.fnFilter(this.value);
   });
   
   
   <ul id='ulWhiteMenu'>
   <li><a href="#AccidentForm"><span>Ávykio kortelë</span></a></li>
   <li><a href="#AccDocs"><span>Ávykio dokumentai</span></a></li>
</ul>
<div id="AccidentForm" style="-moz-border-radius: 0 0 0 0; border-width: 0.8px; border-color: #C0C0C0 #FFFFFF #C0C0C0 #FFFFFF; border-style: ridge;"
   class="inputform" data-ctrl='{"NewRec":1,"Source":"tblAccidents"}'>