/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="../JSGeneral/Server.js" />
/// <reference path="../JSGeneral/objData.js" />
/// <reference path="../JSGeneral/objFunc.js" />
/// <reference path="Main_Render_MainDiv.js" />
/// <reference path="../JSGeneral/clsGrid.js" />

/*global $: false, jQuery: false, oGLOBAL:false, DIALOG:false,console:false, document:false, setTimeout:false, location:false*/
/*jshint boss: false */

var oSIZES={ DoneSizes: 0 };
oGLOBAL.Start={
   fnSetNewData: function(jsResp, APar) { //jsResp:{jsonai,Render: {ctrl:View},ExecFn:{ctrl:Fn}}, APar:{Ctrl:pvzTab,StartNew:0/1,fnCallBack:fn}
      var ExecFn=0;
      //Jeigu reikia ir esam isimine pakeiciam ctrl nauju, priesingu atveju isimenam jo outerHTML
      var Replace=(APar.RenderNew&&oGLOBAL.Start[APar.Ctrl])?oGLOBAL.Start[APar.Ctrl]:"";
      if(Replace) {
         $('#'+APar.Ctrl).empty();
         $('#'+APar.Ctrl).replaceWith(oGLOBAL.Start[APar.Ctrl]);
      }
      else if(!oGLOBAL.Start[APar.Ctrl]) { oGLOBAL.Start[APar.Ctrl]=$('#'+APar.Ctrl).attr('outerHTML'); } //Jei dar neisiminem

      for(var p in jsResp) {
         if(p==="Render") {
            var Render=jsResp[p]; for(var pR in Render) {
               //var ctrl=(pR.search("cls")===0)?pR.replace("."):"#"+pR; cia jeigu naudot klase
               $('#'+pR).html(Render[pR]); var inputForm=$('#'+pR+' div.inputForm');
               if(inputForm) { oCONTROLS.UpdatableForm(inputForm); }
            } //ikisam nauja view ir prasukam duomenu papildytoja controlso pirmam div vaike
         } else if(p==="ExecFn") {
            ExecFn=jsResp[p];
         } else { oDATA.Set(p, jsResp[p]); }
      }
      if(ExecFn) {
         for(var pFn in ExecFn) {
            $('#'+pFn)[ExecFn[pFn]]();
         }
      }
      if(APar.Ctrl=="tabMessages") { }
      else if(APar.Ctrl=="tabAccidents") {
         var oTable=Tab_AccidentsList(APar.Ctrl);
         oGLOBAL.Start.fnApplyLayout(APar.Ctrl, oTable, 20);
      } // $("#tabAccidents").height($("#tabAccidents-center"));

      else if(APar.Ctrl=="tabClaims") { }
      else if(APar.Ctrl=="tabMap") { }
      else if(APar.Ctrl=="tabReports") { }
      else if(APar.Ctrl=="tabLists") { }
      if(typeof APar.fnCallBack!=='undefined') { APar.fnCallBack(); }
      oGLOBAL.Start.FormLoaded(undefined, APar.Ctrl);
      log("oGLOBAL.Start.fnSetNewData,"+"#"+APar.Ctrl+" height:"+$("#"+APar.Ctrl).height());
   },
   Ctrl: {
      CtrlHeight: {},
      GetMinCtrlHeight: function(CtrlName) {
         this.CtrlHeight[CtrlName]=$(document).height()-$('#ulMainMenu').outerHeight(true)-$('#divlogindisplay').outerHeight(true);
         return this.CtrlHeight[CtrlName];
      },
      InnerHeight: function(ChildToFit) {
         var h=0;
         $.each($(ChildToFit).children(), function(index, child) {
            h+=parseInt($(child).outerHeight(true));
         });
         return h;
      },
      ResizeChilds: function(CtrlName) {
         var h=this.CtrlHeight[CtrlName], t=$(CtrlName); t.height(h);
         $.each(t.children(), function(index, child) { $(child).height(h); });
      },
      CheckCtrlHeight: function(p) {//CtrlName, ChildToFit, ToSetCtrlHeight
         //{ CtrlName: "#"+Ctrl, LayOutPanel: "#"+Ctrl+"-center",FirstResize:true };
         var inner=this.InnerHeight((p.LayOutPanel)?p.LayOutPanel:p.CtrlName); //Jei yra Layoutas matuojam layouto paneli, priesingu atveju MainCtrl
         var container=((this.CtrlHeight[p.CtrlName])?(this.CtrlHeight[p.CtrlName]):this.GetMinCtrlHeight(p.CtrlName));
         var Resize=((container<(inner+p.padding))?(inner+p.padding):0);

         if(Resize) {
            this.CtrlHeight[p.CtrlName]=Resize;
            if(typeof p.LayOutPanel!=='undefined') { this.ResizeChilds(p.CtrlName) }
            else { $(p.CtrlName).height(Resize); }
         } else if(p.FirstResize) { $(p.CtrlName).height(this.CtrlHeight[p.CtrlName]); }
      }
   },
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
   },
   fnApplyLayout: function(Ctrl, oTable, padding) {
      var t=$("#"+Ctrl);
      if($("#"+Ctrl+"-center").length) {
         setTimeout(function() {
            var p={ CtrlName: "#"+Ctrl, LayOutPanel: "#"+Ctrl+"-center", FirstResize: true, padding: (padding)?padding:0 }; //FirstResize-butina resizint, bet tik Ctrla (ne jo vaikus)
            $('#divMainPage').fadeIn(); oGLOBAL.Start.Ctrl.CheckCtrlHeight(p);
            t.layout({ East: { size: '500px' }, //applyDefaultStyles: true, t.children(":first").outerHeight(true)
               onresize_end: function() { oTable.fnAdjustColumnSizing(false); }
            }); oTable.fnAdjustColumnSizing(false);
         }, 5);
      }
   },
   FormLoaded: function(Server, Ctrl) {
      //if(Server!==undefined) { CallServer(Server.SPar, oGLOBAL.Start.fnSetPostLoadedData, Server.APar, Server.url, "json"); }
      //Wait.Hide();
      $.unblockUI();
      $('#divMainPage').fadeIn();
   }
}