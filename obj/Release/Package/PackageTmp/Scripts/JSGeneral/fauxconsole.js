/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/* Faux Console by Chris Heilmann http://wait-till-i.com */
//if(!window.CONSOLE) {
var CONSOLE={ init: function () {
   CONSOLE.d=document.createElement('div'); document.body.appendChild(CONSOLE.d);

   var a=document.createElement('a'); a.href='javascript:CONSOLE.hide()'; a.innerHTML='close'; CONSOLE.d.appendChild(a);
   var a=document.createElement('a'); a.href='javascript:CONSOLE.clear();'; a.innerHTML='clear'; CONSOLE.d.appendChild(a);
   var id='fauxconsole'; if(!document.getElementById(id)) { CONSOLE.d.id=id; } CONSOLE.hide();
},
   hide: function () { CONSOLE.d.style.display='none'; },
   show: function () { CONSOLE.d.style.display='block'; },
   log: function (o) {
      if(CONSOLE.d.style.display=='block') { CONSOLE.d.innerHTML+='<br/>'+o; CONSOLE.show(); }
      else if(window.console) { console.log(o); }
   },
   clear: function () { CONSOLE.d.parentNode.removeChild(CONSOLE.d); CONSOLE.init(); CONSOLE.show(); }
   /*Simon Willison rules*/
   //   ,addLoadEvent: function (func) {
   //      var oldonload=window.onload; if(typeof window.onload!='function') { window.onload=func; }
   //      else { window.onload=function () { if(oldonload) { oldonload(); } func(); } };
   //   }
};
//CONSOLE.addLoadEvent(CONSOLE.init);
//}
var log=function (o) { }, logf=function (o) { };
if(typeof console=="object"&&window['loadFirebugConsole']) {
   log=console.log;
}
else {
   if(!window.console) console={};
   console.log=console.log||function () { };
   console.warn=console.warn||function () { };
   console.error=console.error||function () { };
   console.info=console.info||function () { };

   $("body").append("<a href='javascript:void(0)' onclick='CallCONSOLE()'>Console</a>");
   function CallCONSOLE() { if(!CONSOLE.d) CONSOLE.init(); CONSOLE.show(); log=CONSOLE.log; }
   //   var console;
   //   console.log=logf; console.debug=logf;
}
log("fauxconsole uzkrauta");
//logf=function () {
//   log("caller:"+arguments.caller);
//   log("callee:"+arguments.callee);
//} 