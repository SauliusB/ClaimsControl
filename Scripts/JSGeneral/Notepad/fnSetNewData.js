fnSetNewData: function(JsonRes,{Tab:Tab,StartNew:0/1,renderView:HTMLstring})

oGLOBAL.Start.fnSetNewData, { Render: [{ctrl:View}], UpdatableForm: "AccidentForm", fn:[ctrl:fn], fnAfter: fn } 

JsonRes:.....,Render: {ctrl:View},ExecFn:{ctrl:Fn},
APar:{Ctrl:??,RenderNew:0/1,fnCallBack:??}



oGLOBAL.Start.fnSetNewData, { Ctrl: "tabAccidents", Form: "AccidentForm", Tabs: "tabAccidents", fnAfter: function() { LoadScript(); } 


   fnSetNewData: function(jsResp, APar) {
      //APar:{Ctrl:IKUR,Form:KurSediNustatymai,Tabs: "tabAccidents" }
      for(var property in jsResp) { oDATA.Set(property, jsResp[property]); }
      if(typeof jsResp.renderView!=='undefined') {
         $('#'+APar.Ctrl).html(jsResp.renderView);
         oCONTROLS.UpdatableForm($('#'+APar.Form));
         if(typeof APar.Tabs!=='undefined') { $('#'+APar.Tabs).tabs(); }
      }
      if(typeof APar.fnAfter!=='undefined') { APar.fnAfter(); }
   }
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
    CallServer("{'AccidentNo':"+AccidentNo+"}", oGLOBAL.Start.fnSetNewData, { Ctrl: "tabAccidents", Form: "AccidentForm", Tabs: "tabAccidents", fnAfter: function() { LoadScript(); } }, "/Accident/GetAccident", "json");
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
PANAUDOJIMAI
1. Gauti ið servo duomenis ir renderinti á tabAccidents:
	CallServer("{'AccidentNo':"+AccidentNo+"}", oGLOBAL.Start.fnSetNewData, { Ctrl: "tabAccidents", RenderNew: 1, fnCallBack: function() { LoadScript(); } }, "/Accident/GetAccident", "json");
	CallServer([Parametras servui], [duomenys grazinami i sia fn], [i fn pareina ka atidave servas plius sie duomenys kaip APar])
2. Renderinti controlsa is esamu duomenø:
	oGLOBAL.Start.fnSetNewData("", { Ctrl: "tabAccidents", RenderNew: 1 });
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
	
	
	
	
	
	
	
	
	
	Trinti:
	   fnSetPostLoadedData: function(js, APar) {
      if(APar!==undefined) {
         if(APar.Lists!==undefined) {
            for(var property in js) {
               //oDATA[property]=new clsGrid(js[property], property);
               oDATA.Set(property, js[property]);

               var i=APar.Lists.FNameIndex(property);
               if(i!=="") {
                  var CCONTR=$("#lst-lbl-"+property); if(!CCONTR.length) { alert("Klaida 'Start.js, oGLOBAL.Start.fnSetPostLoadedData'. Neradau ctrl - 'lst-lbl-"+property+"'"); }
                  var Name=APar.Lists[i].FName;
                  var ValI=APar.Lists[i].ValI;
                  var ArrTextI=APar.Lists[i].ArrTextI;
                  var SelID=(CCONTR.data("ctrl").Value?CCONTR.data("ctrl").Value:0);
                  //var CtrlID=APar.Lists[i].CtrlID;
                  CCONTR.after(exec_GetOptionListHTML(js[property].Data, "lst-"+property, ValI, ArrTextI, SelID));
                  //Lists[{FName:'tblAccidentTypes',ValI:0,ArrTextI:[1],Sel:0},..]
                  //exec_GetOptionListHTML(Arr, ListBoxid, ValI, ArrTextI, SelectedID)
               } else { alert("Klaida 'Start.js, oGLOBAL.Start.fnSetPostLoadedData'. Neradau Lists properèiui "+property+"'"); }
            }
         }
         if(APar.CallBack!==undefined) { setTimeout(APar.CallBack, 0); }
      }
   }
   
   
      MakeSizes: function() {
      function scrollbarWidth() {
         var b=document.body; b.style.overflow='hidden'; b.style.overflow='scroll';
         var width=b.clientWidth; width-=b.clientWidth;
         if(!width) width=b.offsetWidth-b.clientWidth;
         b.style.overflow='';
         return width;
      }
      if(oSIZES.DoneSizes) return;
      oSIZES={ width: $(document).width()-scrollbarWidth(), height: $(document).height(), scr: scrollbarWidth, DoneSizes: 1 };
      window.setTimeout(function() { oSIZES.DoneSizes=0; }, 1000);

      //      window.setTimeout(function() {
      //         alert("Append");
      //         $('div.pane>div').last().append('<div id="last" class="clearfix"></div>');
      //         $('#divGridAccidents').append('<div id="append" class="clearfix"></div>');
      //         $('#divGridAccidents').after('<div id="after" class="clearfix"></div>');
      //       }, 2000);

      //      $('#ulMainMenu').bind('resize', function(e) {
      //         $('#divMainTabMenu>div').height($(document).height()-$('#ulMainMenu').height()-$('#divlogindisplay').height());
      //         $('#divMainTabMenu>div').unbind('resize');
      //      });
   },

      //   if(Tab!=undefined) {
      //      var p=$("#"+Tab);
      //      //alert(p.height());  //17
      //      //alert($("#"+Tab+"-center").height());
      //      alert(p.outerHeight()); //+pading+border 46
      //      //alert(p.outerHeight(true));//46 su marginais
      //      //p.css("height", p.outerHeight(true));
      //      //setTimeout('$("#'+Tab+'").layout({ applyDefaultStyles: true });', 5000);
      //      //      setTimeout('alert($("#'+Tab+'").outerHeight());', 5);
      //      //      setTimeout('$("#'+Tab+'").css("height",$("#'+Tab+'").height());', 5);
      //      setTimeout(function () {
      //         $("#"+Tab).css("height", $("#"+Tab).children("eq:0").outerHeight(true));
      //      }, 5);
      //   }