﻿/*
jquery.layout 1.3.0 - Release Candidate 29.14
$Date: 2011-02-13 08:00:00 (Sun, 13 Feb 2011) $
$Rev: 302914 $

Copyright (c) 2010
Fabrizio Balliano (http://www.fabrizioballiano.net)
Kevin Dalman (http://allpro.net)

Dual licensed under the GPL (http://www.gnu.org/licenses/gpl.html)
and MIT (http://www.opensource.org/licenses/mit-license.php) licenses.

Changelog: http://layout.jquery-dev.net/changelog.cfm#1.3.0.rc29.13

Docs: http://layout.jquery-dev.net/documentation.html
Tips: http://layout.jquery-dev.net/tips.html
Help: http://groups.google.com/group/jquery-ui-layout
*/
(function(i) {
   var na=i.browser; i.layout={ browser: { mozilla: !!na.mozilla, webkit: !!na.webkit||!!na.safari, msie: !!na.msie, isIE6: !!na.msie&&na.version==6, boxModel: false }, scrollbarWidth: function() { return window.scrollbarWidth||i.layout.getScrollbarSize("width") }, scrollbarHeight: function() { return window.scrollbarHeight||i.layout.getScrollbarSize("height") }, getScrollbarSize: function(p) {
      var v=i('<div style="position: absolute; top: -10000px; left: -10000px; width: 100px; height: 100px; overflow: scroll;"></div>').appendTo("body"),
u={ width: v.width()-v[0].clientWidth, height: v.height()-v[0].clientHeight }; v.remove(); window.scrollbarWidth=u.width; window.scrollbarHeight=u.height; return p.match(/^(width|height)$/i)?u[p]:u
   }, showInvisibly: function(p, v) { if(!p) return {}; p.jquery||(p=i(p)); var u={ display: p.css("display"), visibility: p.css("visibility") }; if(v||u.display=="none") { p.css({ display: "block", visibility: "hidden" }); return u } else return {} }, getElemDims: function(p) {
      var v={}, u=v.css={}, z={}, L, T, N=p.offset(); v.offsetLeft=N.left; v.offsetTop=
N.top; i.each("Left,Right,Top,Bottom".split(","), function(D, I) { L=u["border"+I]=i.layout.borderWidth(p, I); T=u["padding"+I]=i.layout.cssNum(p, "padding"+I); z[I]=L+T; v["inset"+I]=T }); v.offsetWidth=p.innerWidth(); v.offsetHeight=p.innerHeight(); v.outerWidth=p.outerWidth(); v.outerHeight=p.outerHeight(); v.innerWidth=v.outerWidth-z.Left-z.Right; v.innerHeight=v.outerHeight-z.Top-z.Bottom; u.width=p.width(); u.height=p.height(); return v
   }, getElemCSS: function(p, v) {
      var u={}, z=p[0].style, L=v.split(","), T="Top,Bottom,Left,Right".split(","),
N="Color,Style,Width".split(","), D, I, oa, ba, ca, ga; for(ba=0; ba<L.length; ba++) { D=L[ba]; if(D.match(/(border|padding|margin)$/)) for(ca=0; ca<4; ca++) { I=T[ca]; if(D=="border") for(ga=0; ga<3; ga++) { oa=N[ga]; u[D+I+oa]=z[D+I+oa] } else u[D+I]=z[D+I] } else u[D]=z[D] } return u
   }, cssWidth: function(p, v) { var u=i.layout.borderWidth, z=i.layout.cssNum; if(v<=0) return 0; if(!i.layout.browser.boxModel) return v; u=v-u(p, "Left")-u(p, "Right")-z(p, "paddingLeft")-z(p, "paddingRight"); return Math.max(0, u) }, cssHeight: function(p, v) {
      var u=
i.layout.borderWidth, z=i.layout.cssNum; if(v<=0) return 0; if(!i.layout.browser.boxModel) return v; u=v-u(p, "Top")-u(p, "Bottom")-z(p, "paddingTop")-z(p, "paddingBottom"); return Math.max(0, u)
   }, cssNum: function(p, v) { p.jquery||(p=i(p)); var u=i.layout.showInvisibly(p), z=parseInt(i.curCSS(p[0], v, true), 10)||0; p.css(u); return z }, borderWidth: function(p, v) {
      if(p.jquery) p=p[0]; var u="border"+v.substr(0, 1).toUpperCase()+v.substr(1); return i.curCSS(p, u+"Style", true)=="none"?0:parseInt(i.curCSS(p, u+"Width", true), 10)||
0
   }, isMouseOverElem: function(p, v) { var u=i(v||this), z=u.offset(), L=z.top; z=z.left; var T=z+u.outerWidth(); u=L+u.outerHeight(); var N=p.pageX, D=p.pageY; return i.layout.browser.msie&&N<0&&D<0||N>=z&&N<=T&&D>=L&&D<=u }
   }; i.fn.layout=function(p) {
      function v(a) {
         if(!a) return true; var b=a.keyCode; if(b<33) return true; var c={ 38: "north", 40: "south", 37: "west", 39: "east" }, d=a.shiftKey, e=a.ctrlKey, h, f, g, j; if(e&&b>=37&&b<=40&&m[c[b]].enableCursorHotkey) j=c[b]; else if(e||d) i.each(k.borderPanes.split(","), function(o, n) {
            h=
m[n]; f=h.customHotkey; g=h.customHotkeyModifier; if(d&&g=="SHIFT"||e&&g=="CTRL"||e&&d) if(f&&b==(isNaN(f)||f<=9?f.toUpperCase().charCodeAt(0):f)) { j=n; return false }
         }); if(!j||!q[j]||!m[j].closable||l[j].isHidden) return true; pa(j); a.stopPropagation(); return a.returnValue=false
      } function u(a) {
         if(this&&this.tagName) a=this; var b; if(O(a)) b=q[a]; else if(i(a).data("layoutRole")) b=i(a); else i(a).parents().each(function() { if(i(this).data("layoutRole")) { b=i(this); return false } }); if(b&&b.length) {
            var c=b.data("layoutEdge");
            a=l[c]; a.cssSaved&&z(c); if(a.isSliding||a.isResizing||a.isClosed) a.cssSaved=false; else { var d={ zIndex: k.zIndex.pane_normal+2 }, e={}, h=b.css("overflow"), f=b.css("overflowX"), g=b.css("overflowY"); if(h!="visible") { e.overflow=h; d.overflow="visible" } if(f&&!f.match(/visible|auto/)) { e.overflowX=f; d.overflowX="visible" } if(g&&!g.match(/visible|auto/)) { e.overflowY=f; d.overflowY="visible" } a.cssSaved=e; b.css(d); i.each(k.allPanes.split(","), function(j, o) { o!=c&&z(o) }) }
         }
      } function z(a) {
         if(this&&this.tagName) a=this;
         var b; if(O(a)) b=q[a]; else if(i(a).data("layoutRole")) b=i(a); else i(a).parents().each(function() { if(i(this).data("layoutRole")) { b=i(this); return false } }); if(b&&b.length) { a=b.data("layoutEdge"); a=l[a]; var c=a.cssSaved||{}; !a.isSliding&&!a.isResizing&&b.css("zIndex", k.zIndex.pane_normal); b.css(c); a.cssSaved=false }
      } function L(a, b, c) {
         var d=i(a); if(d.length) if(k.borderPanes.indexOf(b)=== -1) alert(F.errButton+F.Pane.toLowerCase()+": "+b); else {
            a=m[b].buttonClass+"-"+c; d.addClass(a+" "+a+"-"+b).data("layoutName",
m.name); return d
         } else alert(F.errButton+F.selector+": "+a); return null
      } function T(a, b, c) { switch(b.toLowerCase()) { case "toggle": N(a, c); break; case "open": D(a, c); break; case "close": I(a, c); break; case "pin": oa(a, c); break; case "toggle-slide": N(a, c, true); break; case "open-slide": D(a, c, true) } } function N(a, b, c) { (a=L(a, b, "toggle"))&&a.click(function(d) { pa(b, !!c); d.stopPropagation() }) } function D(a, b, c) { (a=L(a, b, "open"))&&a.attr("title", F.Open).click(function(d) { U(b, !!c); d.stopPropagation() }) } function I(a, b) {
         var c=
L(a, b, "close"); c&&c.attr("title", F.Close).click(function(d) { P(b); d.stopPropagation() })
      } function oa(a, b) { var c=L(a, b, "pin"); if(c) { var d=l[b]; c.click(function(e) { ca(i(this), b, d.isSliding||d.isClosed); d.isSliding||d.isClosed?U(b):P(b); e.stopPropagation() }); ca(c, b, !d.isClosed&&!d.isSliding); k[b].pins.push(a) } } function ba(a, b) { i.each(k[a].pins, function(c, d) { ca(i(d), a, b) }) } function ca(a, b, c) {
         var d=a.attr("pin"); if(!(d&&c==(d=="down"))) {
            d=m[b].buttonClass+"-pin"; var e=d+"-"+b; b=d+"-up "+e+"-up"; d=d+"-down "+
e+"-down"; a.attr("pin", c?"down":"up").attr("title", c?F.Unpin:F.Pin).removeClass(c?b:d).addClass(c?d:b)
         }
      } function ga(a) { a=i.extend({}, m.cookie, a||{}).name||m.name||"Layout"; var b=document.cookie; b=b?b.split(";"):[]; for(var c, d=0, e=b.length; d<e; d++) { c=i.trim(b[d]).split("="); if(c[0]==a) return Pa(decodeURIComponent(c[1])) } return "" } function Ca(a, b) {
         var c=i.extend({}, m.cookie, b||{}), d=c.name||m.name||"Layout", e="", h="", f=false; if(c.expires.toUTCString) h=c.expires; else if(typeof c.expires=="number") {
            h=
new Date; if(c.expires>0) h.setDate(h.getDate()+c.expires); else { h.setYear(1970); f=true }
         } if(h) e+=";expires="+h.toUTCString(); if(c.path) e+=";path="+c.path; if(c.domain) e+=";domain="+c.domain; if(c.secure) e+=";secure"; if(f) { l.cookie={}; document.cookie=d+"="+e } else { l.cookie=Da(a||c.keys); document.cookie=d+"="+encodeURIComponent(Qa(l.cookie))+e } return i.extend({}, l.cookie)
      } function Ra(a) { if(a=ga(a)) { l.cookie=i.extend({}, a); Sa(a) } return a } function Sa(a, b) {
         i.extend(true, m, a); if(l.initialized) {
            var c, d, e=!b; i.each(k.allPanes.split(","),
function(h, f) { c=a[f]; if(typeof c=="object") { d=c.initHidden; d===true&&ya(f, e); d===false&&ta(f, false, e); d=c.size; d>0&&ha(f, d); d=c.initClosed; d===true&&P(f, false, e); d===false&&U(f, false, e) } })
         }
      } function Da(a) {
         var b={}, c={ isClosed: "initClosed", isHidden: "initHidden" }, d, e, h; if(!a) a=m.cookie.keys; if(i.isArray(a)) a=a.join(","); a=a.replace(/__/g, ".").split(","); for(var f=0, g=a.length; f<g; f++) {
            d=a[f].split("."); e=d[0]; d=d[1]; if(!(k.allPanes.indexOf(e)<0)) {
               h=l[e][d]; if(h!=undefined) {
                  if(d=="isClosed"&&l[e].isSliding) h=
true; (b[e]||(b[e]={}))[c[d]?c[d]:d]=h
               }
            }
         } return b
      } function Qa(a) { function b(c) { var d=[], e=0, h, f, g; for(h in c) { f=c[h]; g=typeof f; if(g=="string") f='"'+f+'"'; else if(g=="object") f=b(f); d[e++]='"'+h+'":'+f } return "{"+d.join(",")+"}" } return b(a) } function Pa(a) { try { return window.eval("("+a+")")||{} } catch(b) { return {} } } var F={ Pane: "Pane", Open: "Open", Close: "Close", Resize: "Resize", Slide: "Slide Open", Pin: "Pin", Unpin: "Un-Pin", selector: "selector", msgNoRoom: "Not enough room to show this pane.", errContainerMissing: "UI Layout Initialization Error\n\nThe specified layout-container does not exist.",
         errCenterPaneMissing: "UI Layout Initialization Error\n\nThe center-pane element does not exist.\n\nThe center-pane is a required element.", errContainerHeight: "UI Layout Initialization Warning\n\nThe layout-container \"CONTAINER\" has no height.\n\nTherefore the layout is 0-height and hence 'invisible'!", errButton: "Error Adding Button \n\nInvalid "
      }, m={ name: "", containerClass: "ui-layout-container", scrollToBookmarkOnLoad: true, resizeWithWindow: true, resizeWithWindowDelay: 200, resizeWithWindowMaxDelay: 0,
         onresizeall_start: null, onresizeall_end: null, onload_start: null, onload_end: null, onunload_start: null, onunload_end: null, autoBindCustomButtons: false, zIndex: null, defaults: { applyDemoStyles: false, closable: true, resizable: true, slidable: true, initClosed: false, initHidden: false, contentSelector: ".ui-layout-content", contentIgnoreSelector: ".ui-layout-ignore", findNestedContent: false, paneClass: "ui-layout-pane", resizerClass: "ui-layout-resizer", togglerClass: "ui-layout-toggler", buttonClass: "ui-layout-button", minSize: 0,
            maxSize: 0, spacing_open: 6, spacing_closed: 6, togglerLength_open: 50, togglerLength_closed: 50, togglerAlign_open: "center", togglerAlign_closed: "center", togglerTip_open: F.Close, togglerTip_closed: F.Open, togglerContent_open: "", togglerContent_closed: "", resizerDblClickToggle: true, autoResize: true, autoReopen: true, resizerDragOpacity: 1, maskIframesOnResize: true, resizeNestedLayout: true, resizeWhileDragging: false, resizeContentWhileDragging: false, noRoomToOpenTip: F.msgNoRoom, resizerTip: F.Resize, sliderTip: F.Slide, sliderCursor: "pointer",
            slideTrigger_open: "click", slideTrigger_close: "mouseleave", slideDelay_open: 300, slideDelay_close: 300, hideTogglerOnSlide: false, preventQuickSlideClose: !!(i.browser.webkit||i.browser.safari), preventPrematureSlideClose: false, showOverflowOnHover: false, enableCursorHotkey: true, customHotkeyModifier: "SHIFT", fxName: "slide", fxSpeed: null, fxSettings: {}, fxOpacityFix: true, triggerEventsOnLoad: false, triggerEventsWhileDragging: true, onshow_start: null, onshow_end: null, onhide_start: null, onhide_end: null, onopen_start: null,
            onopen_end: null, onclose_start: null, onclose_end: null, onresize_start: null, onresize_end: null, onsizecontent_start: null, onsizecontent_end: null, onswap_start: null, onswap_end: null, ondrag_start: null, ondrag_end: null
         }, north: { paneSelector: ".ui-layout-north", size: "auto", resizerCursor: "n-resize", customHotkey: "" }, south: { paneSelector: ".ui-layout-south", size: "auto", resizerCursor: "s-resize", customHotkey: "" }, east: { paneSelector: ".ui-layout-east", size: 200, resizerCursor: "e-resize", customHotkey: "" }, west: { paneSelector: ".ui-layout-west",
            size: 200, resizerCursor: "w-resize", customHotkey: ""
         }, center: { paneSelector: ".ui-layout-center", minWidth: 0, minHeight: 0 }, useStateCookie: false, cookie: { name: "", autoSave: true, autoLoad: true, domain: "", path: "", expires: "", secure: false, keys: "north.size,south.size,east.size,west.size,north.isClosed,south.isClosed,east.isClosed,west.isClosed,north.isHidden,south.isHidden,east.isHidden,west.isHidden" }
      }, Ea={ slide: { all: { duration: "fast" }, north: { direction: "up" }, south: { direction: "down" }, east: { direction: "right" }, west: { direction: "left"} },
         drop: { all: { duration: "slow" }, north: { direction: "up" }, south: { direction: "down" }, east: { direction: "right" }, west: { direction: "left"} }, scale: { all: { duration: "fast"} }
      }, l={ id: "layout"+(new Date).getTime(), initialized: false, container: {}, north: {}, south: {}, east: {}, west: {}, center: {}, cookie: {} }, k={ allPanes: "north,south,west,east,center", borderPanes: "north,south,west,east", altSide: { north: "south", south: "north", east: "west", west: "east" }, hidden: { visibility: "hidden" }, visible: { visibility: "visible" }, zIndex: { pane_normal: 1,
         resizer_normal: 2, iframe_mask: 2, pane_sliding: 100, pane_animate: 1E3, resizer_drag: 1E4
      }, resizers: { cssReq: { position: "absolute", padding: 0, margin: 0, fontSize: "1px", textAlign: "left", overflow: "hidden" }, cssDemo: { background: "#DDD", border: "none"} }, togglers: { cssReq: { position: "absolute", display: "block", padding: 0, margin: 0, overflow: "hidden", textAlign: "center", fontSize: "1px", cursor: "pointer", zIndex: 1 }, cssDemo: { background: "#AAA"} }, content: { cssReq: { position: "relative" }, cssDemo: { overflow: "auto", padding: "10px" }, cssDemoPane: { overflow: "hidden",
         padding: 0
      }
      }, panes: { cssReq: { position: "absolute", margin: 0 }, cssDemo: { padding: "10px", background: "#FFF", border: "1px solid #BBB", overflow: "auto"} }, north: { side: "Top", sizeType: "Height", dir: "horz", cssReq: { top: 0, bottom: "auto", left: 0, right: 0, width: "auto" }, pins: [] }, south: { side: "Bottom", sizeType: "Height", dir: "horz", cssReq: { top: "auto", bottom: 0, left: 0, right: 0, width: "auto" }, pins: [] }, east: { side: "Right", sizeType: "Width", dir: "vert", cssReq: { left: "auto", right: 0, top: "auto", bottom: "auto", height: "auto" }, pins: [] }, west: { side: "Left",
         sizeType: "Width", dir: "vert", cssReq: { left: 0, right: "auto", top: "auto", bottom: "auto", height: "auto" }, pins: []
      }, center: { dir: "center", cssReq: { left: "auto", right: "auto", top: "auto", bottom: "auto", height: "auto", width: "auto"} }
      }, E={ data: {}, set: function(a, b, c) { E.clear(a); E.data[a]=setTimeout(b, c) }, clear: function(a) { var b=E.data; if(b[a]) { clearTimeout(b[a]); delete b[a] } } }, O=function(a) { try { return typeof a=="string"||typeof a=="object"&&a.constructor.toString().match(/string/i)!==null } catch(b) { return false } }, B=function(a,
b) { return Math.max(a, b) }, gb=function(a) { var b, c={ cookie: {}, defaults: { fxSettings: {} }, north: { fxSettings: {} }, south: { fxSettings: {} }, east: { fxSettings: {} }, west: { fxSettings: {} }, center: { fxSettings: {}} }; a=a||{}; if(a.effects||a.cookie||a.defaults||a.north||a.south||a.west||a.east||a.center) c=i.extend(true, c, a); else i.each(a, function(d, e) { b=d.split("__"); if(!b[1]||c[b[0]]) c[b[1]?b[0]:"defaults"][b[1]?b[1]:b[0]]=e }); return c }, Ta=function(a, b, c) {
   function d(h) {
      var f=k[h]; if(f.doCallback) {
         e.push(h); h=f.callback.split(",")[1];
         h!=b&&!i.inArray(h, e)>=0&&d(h)
      } else { f.doCallback=true; f.callback=a+","+b+","+(c?1:0) }
   } var e=[]; i.each(k.borderPanes.split(","), function(h, f) { if(k[f].isMoving) { d(f); return false } })
}, Ua=function(a) { a=k[a]; k.isLayoutBusy=false; delete a.isMoving; if(a.doCallback&&a.callback) { a.doCallback=false; var b=a.callback.split(","), c=b[2]>0?true:false; if(b[0]=="open") U(b[1], c); else b[0]=="close"&&P(b[1], c); if(!a.doCallback) a.callback=null } }, y=function(a, b) {
   if(b) {
      var c; try {
         if(typeof b=="function") c=b; else if(O(b)) if(b.match(/,/)) {
            var d=
b.split(","); c=eval(d[0]); if(typeof c=="function"&&d.length>1) return c(d[1])
         } else c=eval(b); else return; if(typeof c=="function") return a&&q[a]?c(a, q[a], i.extend({}, l[a]), m[a], m.name):c(qa, i.extend({}, l), m, m.name)
      } catch(e) { }
   }
}, Va=function(a, b) { if(!a) return {}; a.jquery||(a=i(a)); var c={ display: a.css("display"), visibility: a.css("visibility") }; if(b||c.display=="none") { a.css({ display: "block", visibility: "hidden" }); return c } else return {} }, Wa=function(a) {
   if(!l.browser.mozilla) {
      var b=q[a]; l[a].tagName=="IFRAME"?
b.css(k.hidden).css(k.visible):b.find("IFRAME").css(k.hidden).css(k.visible)
   }
}, ia=function(a, b) { a.jquery||(a=i(a)); var c=Va(a), d=parseInt(i.curCSS(a[0], b, true), 10)||0; a.css(c); return d }, ua=function(a, b) { if(a.jquery) a=a[0]; var c="border"+b.substr(0, 1).toUpperCase()+b.substr(1); return i.curCSS(a, c+"Style", true)=="none"?0:parseInt(i.curCSS(a, c+"Width", true), 10)||0 }, R=function(a, b) {
   var c=O(a), d=c?q[a]:i(a); if(isNaN(b)) b=c?Z(a):d.outerWidth(); if(b<=0) return 0; if(!l.browser.boxModel) return b; c=b-ua(d, "Left")-
ua(d, "Right")-ia(d, "paddingLeft")-ia(d, "paddingRight"); return B(0, c)
}, S=function(a, b) { var c=O(a), d=c?q[a]:i(a); if(isNaN(b)) b=c?Z(a):d.outerHeight(); if(b<=0) return 0; if(!l.browser.boxModel) return b; c=b-ua(d, "Top")-ua(d, "Bottom")-ia(d, "paddingTop")-ia(d, "paddingBottom"); return B(0, c) }, za=function(a) { var b=k[a].dir; a={ minWidth: 1001-R(a, 1E3), minHeight: 1001-S(a, 1E3) }; if(b=="horz") a.minSize=a.minHeight; if(b=="vert") a.minSize=a.minWidth; return a }, hb=function(a, b, c) {
   var d=a; if(O(a)) d=q[a]; else a.jquery||
(d=i(a)); a=S(d, b); d.css({ height: a, visibility: "visible" }); if(a>0&&d.innerWidth()>0) { if(c&&d.data("autoHidden")) { d.show().data("autoHidden", false); l.browser.mozilla||d.css(k.hidden).css(k.visible) } } else c&&!d.data("autoHidden")&&d.hide().data("autoHidden", true)
}, da=function(a, b, c) {
   if(!c) c=k[a].dir; if(O(b)&&b.match(/%/)) b=parseInt(b, 10)/100; if(b===0) return 0; else if(b>=1) return parseInt(b, 10); else if(b>0) {
      a=m; var d; if(c=="horz") d=r.innerHeight-(q.north?a.north.spacing_open:0)-(q.south?a.south.spacing_open:
0); else if(c=="vert") d=r.innerWidth-(q.west?a.west.spacing_open:0)-(q.east?a.east.spacing_open:0); return Math.floor(d*b)
   } else if(a=="center") return 0; else { d=q[a]; c=c=="horz"?"height":"width"; a=Va(d); var e=d.css(c); d.css(c, "auto"); b=c=="height"?d.outerHeight():d.outerWidth(); d.css(c, e).css(a); return b }
}, Z=function(a, b) { var c=q[a], d=m[a], e=l[a], h=b?d.spacing_open:0; d=b?d.spacing_closed:0; return !c||e.isHidden?0:e.isClosed||e.isSliding&&b?d:k[a].dir=="horz"?c.outerHeight()+h:c.outerWidth()+h }, $=function(a,
b) {
   var c=m[a], d=l[a], e=k[a], h=e.dir; e.side.toLowerCase(); e.sizeType.toLowerCase(); e=b!=undefined?b:d.isSliding; var f=c.spacing_open, g=k.altSide[a], j=l[g], o=q[g], n=!o||j.isVisible===false||j.isSliding?0:h=="horz"?o.outerHeight():o.outerWidth(); g=(!o||j.isHidden?0:m[g][j.isClosed!==false?"spacing_closed":"spacing_open"])||0; j=h=="horz"?r.innerHeight:r.innerWidth; o=za("center"); o=h=="horz"?B(m.center.minHeight, o.minHeight):B(m.center.minWidth, o.minWidth); e=j-f-(e?0:da("center", o, h)+n+g); h=d.minSize=
B(da(a, c.minSize), za(a).minSize); f=c.maxSize?da(a, c.maxSize):1E5; e=d.maxSize=Math.min(f, e); d=d.resizerPosition={}; f=r.insetTop; n=r.insetLeft; g=r.innerWidth; j=r.innerHeight; c=c.spacing_open; switch(a) { case "north": d.min=f+h; d.max=f+e; break; case "west": d.min=n+h; d.max=n+e; break; case "south": d.min=f+j-e-c; d.max=f+j-h-c; break; case "east": d.min=n+g-e-c; d.max=n+g-h-c }
}, ja=function(a) {
   var b={}, c=b.css={}, d={}, e, h, f=a.offset(); b.offsetLeft=f.left; b.offsetTop=f.top; i.each("Left,Right,Top,Bottom".split(","),
function(g, j) { e=c["border"+j]=ua(a, j); h=c["padding"+j]=ia(a, "padding"+j); d[j]=e+h; b["inset"+j]=h }); b.offsetWidth=a.innerWidth(); b.offsetHeight=a.innerHeight(); b.outerWidth=a.outerWidth(); b.outerHeight=a.outerHeight(); b.innerWidth=b.outerWidth-d.Left-d.Right; b.innerHeight=b.outerHeight-d.Top-d.Bottom; c.width=a.width(); c.height=a.height(); return b
}, Aa=function(a, b) {
   var c={}, d=a[0].style, e=b.split(","), h="Top,Bottom,Left,Right".split(","), f="Color,Style,Width".split(","), g, j, o, n, w, t; for(n=0; n<e.length; n++) {
      g=
e[n]; if(g.match(/(border|padding|margin)$/)) for(w=0; w<4; w++) { j=h[w]; if(g=="border") for(t=0; t<3; t++) { o=f[t]; c[g+j+o]=d[g+j+o] } else c[g+j]=d[g+j] } else c[g]=d[g]
   } return c
}, Fa=function(a, b) {
   var c=i(a), d=c.data("layoutRole"), e=c.data("layoutEdge"), h=m[e][d+"Class"]; e="-"+e; var f=c.hasClass(h+"-closed")?"-closed":"-open", g=f=="-closed"?"-open":"-closed"; f=h+"-hover "+(h+e+"-hover ")+(h+f+"-hover ")+(h+e+f+"-hover "); if(b) f+=h+g+"-hover "+(h+e+g+"-hover "); if(d=="resizer"&&c.hasClass(h+"-sliding")) f+=h+
"-sliding-hover "+(h+e+"-sliding-hover "); return i.trim(f)
}, Ga=function(a, b) { var c=i(b||this); a&&c.data("layoutRole")=="toggler"&&a.stopPropagation(); c.addClass(Fa(c)) }, aa=function(a, b) { var c=i(b||this); c.removeClass(Fa(c, true)) }, Xa=function(a) { i("body").disableSelection(); Ga(a, this) }, Ha=function(a, b) { var c=b||this, d=i(c).data("layoutEdge"), e=d+"ResizerLeave"; E.clear(d+"_openSlider"); E.clear(e); if(b) l[d].isResizing||i("body").enableSelection(); else { aa(a, this); E.set(e, function() { Ha(a, c) }, 200) } }, ib=
function() { var a=Number(m.resizeWithWindowDelay)||100; if(a>0) { E.clear("winResize"); E.set("winResize", function() { E.clear("winResize"); E.clear("winResizeRepeater"); ra() }, a); E.data.winResizeRepeater||Ya() } }, Ya=function() { var a=Number(m.resizeWithWindowMaxDelay); a>0&&E.set("winResizeRepeater", function() { Ya(); ra() }, a) }, Za=function() { var a=m; l.cookie=Da(); y(null, a.onunload_start); a.useStateCookie&&a.cookie.autoSave&&Ca(); y(null, a.onunload_end||a.onunload) }, $a=function(a) {
   if(!a||a=="all") a=k.borderPanes;
   i.each(a.split(","), function(b, c) { var d=m[c]; if(d.enableCursorHotkey||d.customHotkey) { i(document).bind("keydown."+C, v); return false } })
}, jb=function() {
   function a(f) { for(var g in b) if(f[g]!=undefined) { f[b[g]]=f[g]; delete f[g] } } p=gb(p); var b={ applyDefaultStyles: "applyDemoStyles" }; a(p.defaults); i.each(k.allPanes.split(","), function(f, g) { a(p[g]) }); if(p.effects) { i.extend(Ea, p.effects); delete p.effects } i.extend(m.cookie, p.cookie); i.each("name,containerClass,zIndex,scrollToBookmarkOnLoad,resizeWithWindow,resizeWithWindowDelay,resizeWithWindowMaxDelay,onresizeall,onresizeall_start,onresizeall_end,onload,onload_start,onload_end,onunload,onunload_start,onunload_end,autoBindCustomButtons,useStateCookie".split(","),
function(f, g) { if(p[g]!==undefined) m[g]=p[g]; else if(p.defaults[g]!==undefined) { m[g]=p.defaults[g]; delete p.defaults[g] } }); i.each("paneSelector,resizerCursor,customHotkey".split(","), function(f, g) { delete p.defaults[g] }); i.extend(true, m.defaults, p.defaults); k.center=i.extend(true, {}, k.panes, k.center); var c=m.zIndex; if(c===0||c>0) { k.zIndex.pane_normal=c; k.zIndex.resizer_normal=c+1; k.zIndex.iframe_mask=c+1 } i.extend(m.center, p.center); var d=i.extend(true, {}, m.defaults, p.defaults, m.center); c="paneClass,contentSelector,applyDemoStyles,triggerEventsOnLoad,showOverflowOnHover,onresize,onresize_start,onresize_end,resizeNestedLayout,resizeContentWhileDragging,onsizecontent,onsizecontent_start,onsizecontent_end".split(",");
   i.each(c, function(f, g) { m.center[g]=d[g] }); var e, h=m.defaults; i.each(k.borderPanes.split(","), function(f, g) {
      k[g]=i.extend(true, {}, k.panes, k[g]); e=m[g]=i.extend(true, {}, m.defaults, m[g], p.defaults, p[g]); if(!e.paneClass) e.paneClass="ui-layout-pane"; if(!e.resizerClass) e.resizerClass="ui-layout-resizer"; if(!e.togglerClass) e.togglerClass="ui-layout-toggler"; i.each(["_open", "_close", ""], function(j, o) {
         var n="fxName"+o, w="fxSpeed"+o, t="fxSettings"+o; e[n]=p[g][n]||p[g].fxName||p.defaults[n]||p.defaults.fxName||
e[n]||e.fxName||h[n]||h.fxName||"none"; var x=e[n]; if(x=="none"||!i.effects||!i.effects[x]||!Ea[x]&&!e[t]&&!e.fxSettings) x=e[n]="none"; x=Ea[x]||{}; n=x.all||{}; x=x[g]||{}; e[t]=i.extend({}, n, x, h.fxSettings||{}, h[t]||{}, e.fxSettings, e[t], p.defaults.fxSettings, p.defaults[t]||{}, p[g].fxSettings, p[g][t]||{}); e[w]=p[g][w]||p[g].fxSpeed||p.defaults[w]||p.defaults.fxSpeed||e[w]||e[t].duration||e.fxSpeed||e.fxSettings.duration||h.fxSpeed||h.fxSettings.duration||x.duration||n.duration||"normal"
      })
   })
}, ab=function(a) {
   a=
m[a].paneSelector; if(a.substr(0, 1)==="#") return J.find(a).eq(0); else { var b=J.children(a).eq(0); return b.length?b:J.children("form:first").children(a).eq(0) }
}, kb=function() {
   i.each(k.allPanes.split(","), function(a, b) { bb(b) }); Ia(); i.each(k.borderPanes.split(","), function(a, b) { if(q[b]&&l[b].isVisible) { $(b); ea(b) } }); fa("center"); i.each(k.allPanes.split(","), function(a, b) { var c=m[b]; if(q[b]&&l[b].isVisible) { if(c.triggerEventsOnLoad) y(b, c.onresize_end||c.onresize); ka(b) } }); J.innerHeight()<2&&alert(F.errContainerHeight.replace(/CONTAINER/,
r.ref))
}, bb=function(a) {
   var b=m[a], c=l[a], d=k[a], e=d.dir, h=a=="center", f={}, g=q[a], j; if(g) Ja(a); else V[a]=false; g=q[a]=ab(a); if(g.length) {
      g.data("layoutCSS")||g.data("layoutCSS", Aa(g, "position,top,left,bottom,right,width,height,overflow,zIndex,display,backgroundColor,padding,margin,border")); g.data("parentLayout", qa).data("layoutRole", "pane").data("layoutEdge", a).css(d.cssReq).css("zIndex", k.zIndex.pane_normal).css(b.applyDemoStyles?d.cssDemo:{}).addClass(b.paneClass+" "+b.paneClass+"-"+a).bind("mouseenter."+
C, Ga).bind("mouseleave."+C, aa); cb(a, false); if(!h) { j=c.size=da(a, b.size); d=da(a, b.minSize)||1; h=da(a, b.maxSize)||1E5; if(j>0) j=B(Math.min(j, h), d); c.isClosed=false; c.isSliding=false; c.isResizing=false; c.isHidden=false } c.tagName=g.attr("tagName"); c.edge=a; c.noRoom=false; c.isVisible=true; switch(a) {
         case "north": f.top=r.insetTop; f.left=r.insetLeft; f.right=r.insetRight; break; case "south": f.bottom=r.insetBottom; f.left=r.insetLeft; f.right=r.insetRight; break; case "west": f.left=r.insetLeft; break; case "east": f.right=
r.insetRight
      } if(e=="horz") f.height=B(1, S(a, j)); else if(e=="vert") f.width=B(1, R(a, j)); g.css(f); e!="horz"&&fa(a, true); c.noRoom||g.css({ visibility: "visible", display: "block" }); if(b.initClosed&&b.closable) P(a, true, true); else if(b.initHidden||b.initClosed) ya(a); b.showOverflowOnHover&&g.hover(u, z); if(l.initialized) { Ia(a); $a(a); ra(); if(c.isVisible) { if(b.triggerEventsOnLoad) y(a, b.onresize_end||b.onresize); ka(a) } }
   } else q[a]=false
}, Ia=function(a) {
   if(!a||a=="all") a=k.borderPanes; i.each(a.split(","), function(b,
c) {
      var d=q[c]; A[c]=false; G[c]=false; if(d) {
         d=m[c]; var e=l[c], h=d.resizerClass, f=d.togglerClass; k[c].side.toLowerCase(); var g="-"+c, j=A[c]=i("<div></div>"), o=d.closable?G[c]=i("<div></div>"):false; !e.isVisible&&d.slidable&&j.attr("title", d.sliderTip).css("cursor", d.sliderCursor); j.attr("id", d.paneSelector.substr(0, 1)=="#"?d.paneSelector.substr(1)+"-resizer":"").data("parentLayout", qa).data("layoutRole", "resizer").data("layoutEdge", c).css(k.resizers.cssReq).css("zIndex", k.zIndex.resizer_normal).css(d.applyDemoStyles?
k.resizers.cssDemo:{}).addClass(h+" "+h+g).appendTo(J); if(o) {
            o.attr("id", d.paneSelector.substr(0, 1)=="#"?d.paneSelector.substr(1)+"-toggler":"").data("parentLayout", qa).data("layoutRole", "toggler").data("layoutEdge", c).css(k.togglers.cssReq).css(d.applyDemoStyles?k.togglers.cssDemo:{}).addClass(f+" "+f+g).appendTo(j); d.togglerContent_open&&i("<span>"+d.togglerContent_open+"</span>").data("layoutRole", "togglerContent").data("layoutEdge", c).addClass("content content-open").css("display", "none").appendTo(o);
            d.togglerContent_closed&&i("<span>"+d.togglerContent_closed+"</span>").data("layoutRole", "togglerContent").data("layoutEdge", c).addClass("content content-closed").css("display", "none").appendTo(o); db(c)
         } lb(c); if(e.isVisible) Ka(c); else { La(c); la(c, true) }
      }
   }); va("all")
}, cb=function(a, b) {
   var c=m[a], d=c.contentSelector, e=q[a], h; if(d) h=V[a]=c.findNestedContent?e.find(d).eq(0):e.children(d).eq(0); if(h&&h.length) {
      h.data("layoutCSS")||h.data("layoutCSS", Aa(h, "height")); h.css(k.content.cssReq); if(c.applyDemoStyles) {
         h.css(k.content.cssDemo);
         e.css(k.content.cssDemoPane)
      } l[a].content={}; b!==false&&sa(a)
   } else V[a]=false
}, mb=function() { var a; i.each("toggle,open,close,pin,toggle-slide,open-slide".split(","), function(b, c) { i.each(k.borderPanes.split(","), function(d, e) { i(".ui-layout-button-"+c+"-"+e).each(function() { a=i(this).data("layoutName")||i(this).attr("layoutName"); if(a==undefined||a==m.name) T(this, c, e) }) }) }) }, lb=function(a) {
   var b=typeof i.fn.draggable=="function", c; if(!a||a=="all") a=k.borderPanes; i.each(a.split(","), function(d, e) {
      var h=
m[e], f=l[e], g=k[e], j=g.dir=="horz"?"top":"left", o, n; if(!b||!q[e]||!h.resizable) { h.resizable=false; return true } var w=A[e], t=h.resizerClass, x=t+"-drag", K=t+"-"+e+"-drag", W=t+"-dragging", Q=t+"-"+e+"-dragging", ma=t+"-dragging-limit", Ma=t+"-"+e+"-dragging-limit", X=false; f.isClosed||w.attr("title", h.resizerTip).css("cursor", h.resizerCursor); w.bind("mouseenter."+C, Xa).bind("mouseleave."+C, Ha); w.draggable({ containment: J[0], axis: g.dir=="horz"?"y":"x", delay: 0, distance: 1, helper: "clone", opacity: h.resizerDragOpacity,
   addClasses: false, zIndex: k.zIndex.resizer_drag, start: function() {
      h=m[e]; f=l[e]; n=h.resizeWhileDragging; if(false===y(e, h.ondrag_start)) return false; k.isLayoutBusy=true; f.isResizing=true; E.clear(e+"_closeSlider"); $(e); o=f.resizerPosition; w.addClass(x+" "+K); X=false; c=i(h.maskIframesOnResize===true?"iframe":h.maskIframesOnResize).filter(":visible"); var M, H=0; c.each(function() {
         M="ui-layout-mask-"+(++H); i(this).data("layoutMaskID", M); i('<div id="'+M+'" class="ui-layout-mask ui-layout-mask-'+e+'"/>').css({ background: "#fff",
            opacity: "0.001", zIndex: k.zIndex.iframe_mask, position: "absolute", width: this.offsetWidth+"px", height: this.offsetHeight+"px"
         }).css(i(this).position()).appendTo(this.parentNode)
      }); i("body").disableSelection()
   }, drag: function(M, H) {
      if(!X) { H.helper.addClass(W+" "+Q).css({ right: "auto", bottom: "auto" }).children().css("visibility", "hidden"); X=true; f.isSliding&&q[e].css("zIndex", k.zIndex.pane_sliding) } var Y=0; if(H.position[j]<o.min) { H.position[j]=o.min; Y= -1 } else if(H.position[j]>o.max) { H.position[j]=o.max; Y=1 } if(Y) {
         H.helper.addClass(ma+
" "+Ma); window.defaultStatus="Panel has reached its "+(Y>0&&e.match(/north|west/)||Y<0&&e.match(/south|east/)?"maximum":"minimum")+" size"
      } else { H.helper.removeClass(ma+" "+Ma); window.defaultStatus="" } n&&eb(M, H, e)
   }, stop: function(M, H) { i("body").enableSelection(); window.defaultStatus=""; w.removeClass(x+" "+K); f.isResizing=false; k.isLayoutBusy=false; eb(M, H, e, true) }
}); var eb=function(M, H, Y, nb) {
   M=H.position; H=k[Y]; var wa; switch(Y) {
      case "north": wa=M.top; break; case "west": wa=M.left; break; case "south": wa=
r.offsetHeight-M.top-h.spacing_open; break; case "east": wa=r.offsetWidth-M.left-h.spacing_open
   } if(nb) { i("div.ui-layout-mask").each(function() { this.parentNode.removeChild(this) }); if(false===y(Y, h.ondrag_end||h.ondrag)) return false } else c.each(function() { i("#"+i(this).data("layoutMaskID")).css(i(this).position()).css({ width: this.offsetWidth+"px", height: this.offsetHeight+"px" }) }); Na(Y, wa-r["inset"+H.side])
}
   })
}, Ja=function(a, b, c) {
   if(q[a]) {
      var d=q[a], e=V[a], h=A[a], f=G[a], g=m[a].paneClass, j=g+"-"+a; g=[g,
g+"-open", g+"-closed", g+"-sliding", j, j+"-open", j+"-closed", j+"-sliding"]; i.merge(g, Fa(d, true)); if(d&&d.length) if(b&&!d.data("layoutContainer")&&(!e||!e.length||!e.data("layoutContainer"))) d.remove(); else { d.removeClass(g.join(" ")).removeData("layoutParent").removeData("layoutRole").removeData("layoutEdge").removeData("autoHidden").unbind("."+C); d.data("layoutContainer")||d.css(d.data("layoutCSS")).removeData("layoutCSS"); e&&e.length&&!e.data("layoutContainer")&&e.css(e.data("layoutCSS")).removeData("layoutCSS") } f&&
f.length&&f.remove(); h&&h.length&&h.remove(); q[a]=V[a]=A[a]=G[a]=false; if(!c) { ra(); l[a]={} }
   }
}, ya=function(a, b) { var c=m[a], d=l[a], e=q[a], h=A[a]; if(!(!e||d.isHidden)) if(!(l.initialized&&false===y(a, c.onhide_start))) { d.isSliding=false; h&&h.hide(); if(!l.initialized||d.isClosed) { d.isClosed=true; d.isHidden=true; d.isVisible=false; e.hide(); fa(k[a].dir=="horz"?"all":"center"); if(l.initialized||c.triggerEventsOnLoad) y(a, c.onhide_end||c.onhide) } else { d.isHiding=true; P(a, false, b) } } }, ta=function(a, b, c, d) {
   var e=
l[a]; if(q[a]&&e.isHidden) if(false!==y(a, m[a].onshow_start)) { e.isSliding=false; e.isShowing=true; b===false?P(a, true):U(a, false, c, d) }
}, pa=function(a, b) { if(!O(a)) { a.stopImmediatePropagation(); a=i(this).data("layoutEdge") } var c=l[O(a)?i.trim(a):a==undefined||a==null?"":a]; if(c.isHidden) ta(a); else c.isClosed?U(a, !!b):P(a) }, ob=function(a) { var b=l[a]; q[a].hide(); b.isClosed=true; b.isVisible=false }, P=function(a, b, c, d) {
   function e() {
      if(g.isClosed) {
         la(a, true); var n=k.altSide[a]; if(l[n].noRoom) { $(n); ea(n) } if(!d&&
(l.initialized||f.triggerEventsOnLoad)) { j||y(a, f.onclose_end||f.onclose); if(j) y(a, f.onshow_end||f.onshow); if(o) y(a, f.onhide_end||f.onhide) }
      } Ua(a)
   } if(l.initialized) {
      var h=q[a], f=m[a], g=l[a]; c=!c&&!g.isClosed&&f.fxName_close!="none"; var j=g.isShowing, o=g.isHiding; delete g.isShowing; delete g.isHiding; if(!(!h||!f.closable&&!j&&!o)) if(!(!b&&g.isClosed&&!j)) if(k.isLayoutBusy) Ta("close", a, b); else if(!(!j&&false===y(a, f.onclose_start))) {
         k[a].isMoving=true; k.isLayoutBusy=true; g.isClosed=true; g.isVisible=false;
         if(o) g.isHidden=true; else if(j) g.isHidden=false; g.isSliding?xa(a, false):fa(k[a].dir=="horz"?"all":"center", false); La(a); if(c) { Ba(a, true); h.hide(f.fxName_close, f.fxSettings_close, f.fxSpeed_close, function() { Ba(a, false); e() }) } else { h.hide(); e() }
      }
   } else ob(a)
}, La=function(a) {
   var b=A[a], c=G[a], d=m[a], e=k[a].side.toLowerCase(), h=d.resizerClass, f=d.togglerClass, g="-"+a; b.css(e, r["inset"+k[a].side]).removeClass(h+"-open "+h+g+"-open").removeClass(h+"-sliding "+h+g+"-sliding").addClass(h+"-closed "+h+g+"-closed").unbind("dblclick."+
C); d.resizable&&typeof i.fn.draggable=="function"&&b.draggable("disable").removeClass("ui-state-disabled").css("cursor", "default").attr("title", ""); if(c) { c.removeClass(f+"-open "+f+g+"-open").addClass(f+"-closed "+f+g+"-closed").attr("title", d.togglerTip_closed); c.children(".content-open").hide(); c.children(".content-closed").css("display", "block") } ba(a, false); l.initialized&&va("all")
}, U=function(a, b, c, d) {
   function e() { if(g.isVisible) { Wa(a); g.isSliding||fa(k[a].dir=="vert"?"center":"all", false); Ka(a) } Ua(a) }
   var h=q[a], f=m[a], g=l[a]; c=!c&&g.isClosed&&f.fxName_open!="none"; var j=g.isShowing; delete g.isShowing; if(!(!h||!f.resizable&&!f.closable&&!j)) if(!(g.isVisible&&!g.isSliding)) if(g.isHidden&&!j) ta(a, true); else if(k.isLayoutBusy) Ta("open", a, b); else {
      $(a, b); if(false!==y(a, f.onopen_start)) if(g.minSize>g.maxSize) { ba(a, false); !d&&f.noRoomToOpenTip&&alert(f.noRoomToOpenTip) } else {
         k[a].isMoving=true; k.isLayoutBusy=true; if(b) xa(a, true); else if(g.isSliding) xa(a, false); else f.slidable&&la(a, false); g.noRoom=false;
         ea(a); g.isVisible=true; g.isClosed=false; if(j) g.isHidden=false; if(c) { Ba(a, true); h.show(f.fxName_open, f.fxSettings_open, f.fxSpeed_open, function() { Ba(a, false); e() }) } else { h.show(); e() }
      }
   }
}, Ka=function(a, b) {
   var c=q[a], d=A[a], e=G[a], h=m[a], f=l[a], g=k[a].side.toLowerCase(), j=h.resizerClass, o=h.togglerClass, n="-"+a; d.css(g, r["inset"+k[a].side]+Z(a)).removeClass(j+"-closed "+j+n+"-closed").addClass(j+"-open "+j+n+"-open"); f.isSliding?d.addClass(j+"-sliding "+j+n+"-sliding"):d.removeClass(j+"-sliding "+j+n+
"-sliding"); h.resizerDblClickToggle&&d.bind("dblclick", pa); aa(0, d); if(h.resizable&&typeof i.fn.draggable=="function") d.draggable("enable").css("cursor", h.resizerCursor).attr("title", h.resizerTip); else f.isSliding||d.css("cursor", "default"); if(e) { e.removeClass(o+"-closed "+o+n+"-closed").addClass(o+"-open "+o+n+"-open").attr("title", h.togglerTip_open); aa(0, e); e.children(".content-closed").hide(); e.children(".content-open").css("display", "block") } ba(a, !f.isSliding); i.extend(f, ja(c)); if(l.initialized) {
      va("all");
      sa(a, true)
   } if(!b&&(l.initialized||h.triggerEventsOnLoad)&&c.is(":visible")) { y(a, h.onopen_end||h.onopen); if(f.isShowing) y(a, h.onshow_end||h.onshow); if(l.initialized) { y(a, h.onresize_end||h.onresize); ka(a) } }
}, fb=function(a) { function b() { if(e.isClosed) k[d].isMoving||U(d, true); else xa(d, true) } var c=O(a)?null:a, d=c?i(this).data("layoutEdge"):a, e=l[d]; a=m[d].slideDelay_open; c&&c.stopImmediatePropagation(); e.isClosed&&c&&c.type=="mouseenter"&&a>0?E.set(d+"_openSlider", b, a):b() }, Oa=function(a) {
   function b() {
      if(e.isClosed) xa(d,
false); else k[d].isMoving||P(d)
   } var c=O(a)?null:a, d=c?i(this).data("layoutEdge"):a; a=m[d]; var e=l[d], h=k[d].isMoving?1E3:300; if(!(e.isClosed||e.isResizing)) if(a.slideTrigger_close=="click") b(); else a.preventQuickSlideClose&&k.isLayoutBusy||a.preventPrematureSlideClose&&c&&i.layout.isMouseOverElem(c, q[d])||(c?E.set(d+"_closeSlider", b, B(a.slideDelay_close, h)):b())
}, Ba=function(a, b) {
   var c=q[a]; if(b) {
      c.css({ zIndex: k.zIndex.pane_animate }); if(a=="south") c.css({ top: r.insetTop+r.innerHeight-c.outerHeight() });
      else a=="east"&&c.css({ left: r.insetLeft+r.innerWidth-c.outerWidth() })
   } else { c.css({ zIndex: l[a].isSliding?k.zIndex.pane_sliding:k.zIndex.pane_normal }); if(a=="south") c.css({ top: "auto" }); else a=="east"&&c.css({ left: "auto" }); var d=m[a]; l.browser.msie&&d.fxOpacityFix&&d.fxName_open!="slide"&&c.css("filter")&&c.css("opacity")==1&&c[0].style.removeAttribute("filter") }
}, la=function(a, b) {
   var c=m[a], d=A[a], e=c.slideTrigger_open.toLowerCase(); if(!(!d||b&&!c.slidable)) {
      if(e.match(/mouseover/)) e=c.slideTrigger_open=
"mouseenter"; else if(!e.match(/click|dblclick|mouseenter/)) e=c.slideTrigger_open="click"; d[b?"bind":"unbind"](e+"."+C, fb).css("cursor", b?c.sliderCursor:"default").attr("title", b?c.sliderTip:"")
   }
}, xa=function(a, b) {
   function c(n) { E.clear(a+"_closeSlider"); n.stopPropagation() } var d=m[a], e=l[a], h=k.zIndex, f=d.slideTrigger_close.toLowerCase(), g=b?"bind":"unbind", j=q[a], o=A[a]; e.isSliding=b; E.clear(a+"_closeSlider"); b&&la(a, false); j.css("zIndex", b?h.pane_sliding:h.pane_normal); o.css("zIndex", b?h.pane_sliding:
h.resizer_normal); if(!f.match(/click|mouseleave/)) f=d.slideTrigger_close="mouseleave"; o[g](f, Oa); if(f=="mouseleave") { j[g]("mouseleave."+C, Oa); o[g]("mouseenter."+C, c); j[g]("mouseenter."+C, c) } if(b) { if(f=="click"&&!d.resizable) { o.css("cursor", b?d.sliderCursor:"default"); o.attr("title", b?d.togglerTip_open:"") } } else E.clear(a+"_closeSlider")
}, ea=function(a, b, c, d) {
   b=m[a]; var e=l[a], h=k[a], f=q[a], g=A[a], j=h.dir=="vert", o=false; if(a=="center"||j&&e.noVerticalRoom) if((o=e.maxHeight>0)&&e.noRoom) {
      f.show();
      g&&g.show(); e.isVisible=true; e.noRoom=false; if(j) e.noVerticalRoom=false; Wa(a)
   } else if(!o&&!e.noRoom) { f.hide(); g&&g.hide(); e.isVisible=false; e.noRoom=true } if(a!="center") if(e.minSize<=e.maxSize) { if(e.size>e.maxSize) ha(a, e.maxSize, c, d); else if(e.size<e.minSize) ha(a, e.minSize, c, d); else if(g&&f.is(":visible")) { c=h.side.toLowerCase(); d=e.size+r["inset"+h.side]; ia(g, c)!=d&&g.css(c, d) } if(e.noRoom) if(e.wasOpen&&b.closable) if(b.autoReopen) U(a, false, true, true); else e.noRoom=false; else ta(a, e.wasOpen, true, true) } else if(!e.noRoom) {
      e.noRoom=
true; e.wasOpen=!e.isClosed&&!e.isSliding; e.isClosed||(b.closable?P(a, true, true):ya(a, true))
   }
}, Na=function(a, b, c) { var d=m[a], e=d.resizeWhileDragging&&!k.isLayoutBusy; d.autoResize=false; ha(a, b, c, e) }, ha=function(a, b, c, d) {
   var e=m[a], h=l[a], f=q[a], g=A[a], j=k[a].side.toLowerCase(), o="inset"+k[a].side, n=k.isLayoutBusy&&!e.triggerEventsWhileDragging, w; $(a); w=h.size; b=da(a, b); b=B(b, da(a, e.minSize)); b=Math.min(b, h.maxSize); if(b<h.minSize) ea(a, false, c); else if(!(!d&&b==w)) {
      !c&&l.initialized&&h.isVisible&&y(a,
e.onresize_start); f.css(k[a].sizeType.toLowerCase(), B(1, k[a].dir=="horz"?S(a, b):R(a, b))); h.size=b; i.extend(h, ja(f)); g&&f.is(":visible")&&g.css(j, b+r[o]); sa(a); if(!c&&!n&&l.initialized&&h.isVisible) { y(a, e.onresize_end||e.onresize); ka(a) } if(!c) { h.isSliding||fa(k[a].dir=="horz"?"all":"center", n, d); va("all") } a=k.altSide[a]; if(b<w&&l[a].noRoom) { $(a); ea(a, false, c) }
   }
}, fa=function(a, b, c) {
   if(!a||a=="all") a="east,west,center"; i.each(a.split(","), function(d, e) {
      if(q[e]) {
         var h=m[e], f=l[e], g=q[e], j=true, o={}; j=
{ top: Z("north", true), bottom: Z("south", true), left: Z("west", true), right: Z("east", true), width: 0, height: 0 }; j.width=r.innerWidth-j.left-j.right; j.height=r.innerHeight-j.bottom-j.top; j.top+=r.insetTop; j.bottom+=r.insetBottom; j.left+=r.insetLeft; j.right+=r.insetRight; i.extend(f, ja(g)); if(e=="center") {
            if(!c&&f.isVisible&&j.width==f.outerWidth&&j.height==f.outerHeight) return true; i.extend(f, za(e), { maxWidth: j.width, maxHeight: j.height }); o=j; o.width=R(e, j.width); o.height=S(e, j.height); j=o.width>0&&o.height>0;
            if(!j&&!l.initialized&&h.minWidth>0) { var n=h.minWidth-f.outerWidth, w=m.east.minSize||0, t=m.west.minSize||0, x=l.east.size, K=l.west.size, W=x, Q=K; if(n>0&&l.east.isVisible&&x>w) { W=B(x-w, x-n); n-=x-W } if(n>0&&l.west.isVisible&&K>t) { Q=B(K-t, K-n); n-=K-Q } if(n==0) { x!=w&&ha("east", W, true); K!=t&&ha("west", Q, true); fa("center", b, c); return } }
         } else {
            f.isVisible&&!f.noVerticalRoom&&i.extend(f, ja(g), za(e)); if(!c&&!f.noVerticalRoom&&j.height==f.outerHeight) return true; o.top=j.top; o.bottom=j.bottom; o.height=S(e, j.height);
            f.maxHeight=B(0, o.height); j=f.maxHeight>0; if(!j) f.noVerticalRoom=true
         } if(j) { !b&&l.initialized&&y(e, h.onresize_start); g.css(o); f.noRoom&&!f.isClosed&&!f.isHidden&&ea(e); if(f.isVisible) { i.extend(f, ja(g)); l.initialized&&sa(e) } } else !f.noRoom&&f.isVisible&&ea(e); if(!f.isVisible) return true; if(e=="center") {
            f=l.browser; f=f.isIE6||f.msie&&!f.boxModel; if(q.north&&(f||l.north.tagName=="IFRAME")) q.north.css("width", R(q.north, r.innerWidth)); if(q.south&&(f||l.south.tagName=="IFRAME")) q.south.css("width", R(q.south,
r.innerWidth))
         } if(!b&&l.initialized) { y(e, h.onresize_end||h.onresize); ka(e) }
      }
   })
}, ra=function() {
   i.extend(l.container, ja(J)); if(r.outerHeight) {
      if(false===y(null, m.onresizeall_start)) return false; var a, b, c; i.each(["south", "north", "east", "west"], function(d, e) { if(q[e]) { c=l[e]; b=m[e]; if(b.autoResize&&c.size!=b.size) ha(e, b.size, true, true); else { $(e); ea(e, false, true, true) } } }); fa("all", true, true); va("all"); b=m; i.each(k.allPanes.split(","), function(d, e) {
         if(a=q[e]) if(l[e].isVisible) {
            y(e, b[e].onresize_end||b[e].onresize);
            ka(e)
         }
      }); y(null, b.onresizeall_end||b.onresizeall)
   }
}, ka=function(a) { var b=q[a], c=V[a]; if(m[a].resizeNestedLayout) if(b.data("layoutContainer")) b.layout().resizeAll(); else c&&c.data("layoutContainer")&&c.layout().resizeAll() }, sa=function(a, b) {
   if(!a||a=="all") a=k.allPanes; i.each(a.split(","), function(c, d) {
      function e(w) { return B(o.css.paddingBottom, parseInt(w.css("marginBottom"), 10)||0) } function h() {
         var w=m[d].contentIgnoreSelector; w=g.nextAll().not(w||":lt(0)"); var t=w.filter(":visible"), x=t.filter(":last");
         n={ top: g[0].offsetTop, height: g.outerHeight(), numFooters: w.length, hiddenFooters: w.length-t.length, spaceBelow: 0 }; n.spaceAbove=n.top; n.bottom=n.top+n.height; n.spaceBelow=x.length?x[0].offsetTop+x.outerHeight()-n.bottom+e(x):e(g)
      } var f=q[d], g=V[d], j=m[d], o=l[d], n=o.content; if(!f||!g||!f.is(":visible")) return true; if(false!==y(null, j.onsizecontent_start)) {
         if(!k.isLayoutBusy||n.top==undefined||b||j.resizeContentWhileDragging) {
            h(); if(n.hiddenFooters>0&&f.css("overflow")=="hidden") {
               f.css("overflow", "visible");
               h(); f.css("overflow", "hidden")
            }
         } f=o.innerHeight-(n.spaceAbove-o.css.paddingTop)-(n.spaceBelow-o.css.paddingBottom); if(!g.is(":visible")||n.height!=f) { hb(g, f, true); n.height=f } if(l.initialized) { y(d, j.onsizecontent_end||j.onsizecontent); ka(d) }
      }
   })
}, va=function(a) {
   if(!a||a=="all") a=k.borderPanes; i.each(a.split(","), function(b, c) {
      var d=m[c], e=l[c], h=q[c], f=A[c], g=G[c], j; if(h&&f) {
         var o=k[c].dir, n=e.isClosed?"_closed":"_open", w=d["spacing"+n], t=d["togglerAlign"+n]; n=d["togglerLength"+n]; var x; if(w==0) f.hide();
         else {
            !e.noRoom&&!e.isHidden&&f.show(); if(o=="horz") { x=h.outerWidth(); e.resizerLength=x; f.css({ width: B(1, R(f, x)), height: B(0, S(f, w)), left: ia(h, "left") }) } else { x=h.outerHeight(); e.resizerLength=x; f.css({ height: B(1, S(f, x)), width: B(0, R(f, w)), top: r.insetTop+Z("north", true) }) } aa(d, f); if(g) {
               if(n==0||e.isSliding&&d.hideTogglerOnSlide) { g.hide(); return } else g.show(); if(!(n>0)||n=="100%"||n>x) { n=x; t=0 } else if(O(t)) switch(t) {
                  case "top": case "left": t=0; break; case "bottom": case "right": t=x-n; break; default: t=Math.floor((x-
n)/2)
               } else { h=parseInt(t, 10); t=t>=0?h:x-n+h } if(o=="horz") { var K=R(g, n); g.css({ width: B(0, K), height: B(1, S(g, w)), left: t, top: 0 }); g.children(".content").each(function() { j=i(this); j.css("marginLeft", Math.floor((K-j.outerWidth())/2)) }) } else { var W=S(g, n); g.css({ height: B(0, W), width: B(1, R(g, w)), top: t, left: 0 }); g.children(".content").each(function() { j=i(this); j.css("marginTop", Math.floor((W-j.outerHeight())/2)) }) } aa(0, g)
            } if(!l.initialized&&(d.initHidden||e.noRoom)) { f.hide(); g&&g.hide() }
         }
      }
   })
}, db=function(a) {
   var b=
G[a], c=m[a]; if(b) { c.closable=true; b.bind("click."+C, function(d) { d.stopPropagation(); pa(a) }).bind("mouseenter."+C, Ga).bind("mouseleave."+C, aa).css("visibility", "visible").css("cursor", "pointer").attr("title", l[a].isClosed?c.togglerTip_closed:c.togglerTip_open).show() }
}, J=i(this).eq(0); if(!J.length) return null; if(J.data("layoutContainer")&&J.data("layout")) return J.data("layout"); var q={}, V={}, A={}, G={}, r=l.container, C=l.id, qa={ options: m, state: l, container: J, panes: q, contents: V, resizers: A, togglers: G,
   toggle: pa, hide: ya, show: ta, open: U, close: P, slideOpen: fb, slideClose: Oa, slideToggle: function(a) { pa(a, true) }, initContent: cb, sizeContent: sa, sizePane: Na, swapPanes: function(a, b) {
      function c(g) { var j=q[g], o=V[g]; return !j?false:{ pane: g, P: j?j[0]:false, C: o?o[0]:false, state: i.extend({}, l[g]), options: i.extend({}, m[g])} } function d(g, j) {
         if(g) {
            var o=g.P, n=g.C, w=g.pane, t=k[j], x=t.side.toLowerCase(), K="inset"+t.side, W=i.extend({}, l[j]), Q=m[j], ma={ resizerCursor: Q.resizerCursor }; i.each("fxName,fxSpeed,fxSettings".split(","),
function(Ma, X) { ma[X]=Q[X]; ma[X+"_open"]=Q[X+"_open"]; ma[X+"_close"]=Q[X+"_close"] }); q[j]=i(o).data("layoutEdge", j).css(k.hidden).css(t.cssReq); V[j]=n?i(n):false; m[j]=i.extend({}, g.options, ma); l[j]=i.extend({}, g.state); o.className=o.className.replace(RegExp(Q.paneClass+"-"+w, "g"), Q.paneClass+"-"+j); Ia(j); if(t.dir!=k[w].dir) { o=f[j]||0; $(j); o=B(o, l[j].minSize); Na(j, o, true) } else A[j].css(x, r[K]+(l[j].isVisible?Z(j):0)); if(g.state.isVisible&&!W.isVisible) Ka(j, true); else { La(j); la(j, true) } g=null
         }
      } l[a].edge=
b; l[b].edge=a; var e=false; if(false===y(a, m[a].onswap_start)) e=true; if(!e&&false===y(b, m[b].onswap_start)) e=true; if(e) { l[a].edge=a; l[b].edge=b } else { e=c(a); var h=c(b), f={}; f[a]=e?e.state.size:0; f[b]=h?h.state.size:0; q[a]=false; q[b]=false; l[a]={}; l[b]={}; G[a]&&G[a].remove(); G[b]&&G[b].remove(); A[a]&&A[a].remove(); A[b]&&A[b].remove(); A[a]=A[b]=G[a]=G[b]=false; d(e, b); d(h, a); e=h=f=null; q[a]&&q[a].css(k.visible); q[b]&&q[b].css(k.visible); ra(); y(a, m[a].onswap_end||m[a].onswap); y(b, m[b].onswap_end||m[b].onswap) }
   },
   resizeAll: ra, destroy: function() { i(window).unbind("."+C); i(document).unbind("."+C); i.each(k.allPanes.split(","), function(b, c) { Ja(c, false, true) }); var a=J.removeData("layout").removeData("layoutContainer").removeClass(m.containerClass); !a.data("layoutEdge")&&a.data("layoutCSS")&&a.css(a.data("layoutCSS")).removeData("layoutCSS"); if(r.tagName=="BODY"&&(a=i("html")).data("layoutCSS")) a.css(a.data("layoutCSS")).removeData("layoutCSS"); Za() }, addPane: bb, removePane: Ja, setSizeLimits: $, bindButton: T, addToggleBtn: N,
   addOpenBtn: D, addCloseBtn: I, addPinBtn: oa, allowOverflow: u, resetOverflow: z, encodeJSON: Qa, decodeJSON: Pa, getState: Da, getCookie: ga, saveCookie: Ca, deleteCookie: function() { Ca("", { expires: -1 }) }, loadCookie: Ra, loadState: Sa, cssWidth: R, cssHeight: S, enableClosable: db, disableClosable: function(a, b) { var c=G[a]; if(c) { m[a].closable=false; l[a].isClosed&&U(a, false, true); c.unbind("."+C).css("visibility", b?"hidden":"visible").css("cursor", "default").attr("title", "") } }, enableSlidable: function(a) {
      var b=A[a]; if(b&&b.data("draggable")) {
         m[a].slidable=
true; s.isClosed&&la(a, true)
      }
   }, disableSlidable: function(a) { var b=A[a]; if(b) { m[a].slidable=false; if(l[a].isSliding) P(a, false, true); else { la(a, false); b.css("cursor", "default").attr("title", ""); aa(null, b[0]) } } }, enableResizable: function(a) { var b=A[a], c=m[a]; if(b&&b.data("draggable")) { c.resizable=true; b.draggable("enable").bind("mouseenter."+C, Xa).bind("mouseleave."+C, Ha); l[a].isClosed||b.css("cursor", c.resizerCursor).attr("title", c.resizerTip) } }, disableResizable: function(a) {
      var b=A[a]; if(b&&b.data("draggable")) {
         m[a].resizable=
false; b.draggable("disable").unbind("."+C).css("cursor", "default").attr("title", ""); aa(null, b[0])
      }
   }
}; (function() {
   jb(); var a=m; if(false===y(null, a.onload_start)) return false; if(!ab("center").length) { alert(F.errCenterPaneMissing); return null } a.useStateCookie&&a.cookie.autoLoad&&Ra(); l.browser={ mozilla: i.browser.mozilla, webkit: i.browser.webkit||i.browser.safari, msie: i.browser.msie, isIE6: i.browser.msie&&i.browser.version==6, boxModel: i.support.boxModel }; var b=J, c=r.tagName=b.attr("tagName"), d=c=="BODY",
e={}; r.selector=b.selector.split(".slice")[0]; r.ref=c+"/"+r.selector; b.data("layout", qa).data("layoutContainer", C).addClass(m.containerClass); if(!b.data("layoutCSS")) {
      if(d) { e=i.extend(Aa(b, "position,margin,padding,border"), { height: b.css("height"), overflow: b.css("overflow"), overflowX: b.css("overflowX"), overflowY: b.css("overflowY") }); c=i("html"); c.data("layoutCSS", { height: "auto", overflow: c.css("overflow"), overflowX: c.css("overflowX"), overflowY: c.css("overflowY") }) } else e=Aa(b, "position,margin,padding,border,top,bottom,left,right,width,height,overflow,overflowX,overflowY");
      b.data("layoutCSS", e)
   } try {
      if(d) { i("html").css({ height: "100%", overflow: "hidden", overflowX: "hidden", overflowY: "hidden" }); i("body").css({ position: "relative", height: "100%", overflow: "hidden", overflowX: "hidden", overflowY: "hidden", margin: 0, padding: 0, border: "none" }) } else {
         e={ overflow: "hidden" }; var h=b.css("position"); b.css("height"); if(!b.data("layoutRole")) if(!h||!h.match(/fixed|absolute|relative/)) e.position="relative"; b.css(e); b.is(":visible")&&b.innerHeight()<2&&alert(F.errContainerHeight.replace(/CONTAINER/,
r.ref))
      }
   } catch(f) { } i.extend(l.container, ja(b)); kb(); sa(); if(a.scrollToBookmarkOnLoad) { b=self.location; b.hash&&b.replace(b.hash) } $a(); a.autoBindCustomButtons&&mb(); a.resizeWithWindow&&!J.data("layoutRole")&&i(window).bind("resize."+C, ib); i(window).bind("unload."+C, Za); l.initialized=true; y(null, a.onload_end||a.onload)
})(); return qa
   }
})(jQuery);
/*
* jQuery blockUI plugin
* Version 2.36 (16-NOV-2010)
* @requires jQuery v1.2.3 or later
*
* Examples at: http://malsup.com/jquery/block/
* Copyright (c) 2007-2008 M. Alsup
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
* Thanks to Amir-Hossein Sobhi for some excellent contributions!
*/

(function($) {
   if(/1\.(0|1|2)\.(0|1|2)/.test($.fn.jquery)||/^1.1/.test($.fn.jquery)) {
      alert('blockUI requires jQuery v1.2.3 or later!  You are using v'+$.fn.jquery);
      return;
   }

   $.fn._fadeIn=$.fn.fadeIn;

   var noOp=function() { };

   // this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
   // retarded userAgent strings on Vista)
   var mode=document.documentMode||0;
   var setExpr=$.browser.msie&&(($.browser.version<8&&!mode)||mode<8);
   var ie6=$.browser.msie&&/MSIE 6.0/.test(navigator.userAgent)&&!mode;

   // global $ methods for blocking/unblocking the entire page
   $.blockUI=function(opts) { install(window, opts); };
   $.unblockUI=function(opts) { remove(window, opts); };

   // convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
   $.growlUI=function(title, message, timeout, onClose) {
      var $m=$('<div class="growlUI"></div>');
      if(title) $m.append('<h1>'+title+'</h1>');
      if(message) $m.append('<h2>'+message+'</h2>');
      if(timeout==undefined) timeout=3000;
      $.blockUI({
         message: $m, fadeIn: 700, fadeOut: 1000, centerY: false,
         timeout: timeout, showOverlay: false,
         onUnblock: onClose,
         css: $.blockUI.defaults.growlCSS
      });
   };

   // plugin method for blocking element content
   $.fn.block=function(opts) {
      return this.unblock({ fadeOut: 0 }).each(function() {
         if($.css(this, 'position')=='static')
            this.style.position='relative';
         if($.browser.msie)
            this.style.zoom=1; // force 'hasLayout'
         install(this, opts);
      });
   };

   // plugin method for unblocking element content
   $.fn.unblock=function(opts) {
      return this.each(function() {
         remove(this, opts);
      });
   };

   $.blockUI.version=2.35; // 2nd generation blocking at no extra cost!

   // override these in your code to change the default behavior and style
   $.blockUI.defaults={
      // message displayed when blocking (use null for no message)
      message: '<h4><img src="/Content/images/ajax-loader-circle-blue.gif"/>  Siunčiami duomenys. Minutėlę...</h4>',

      title: null,   // title string; only used when theme ===true
      draggable: true,  // only used when theme ===true (requires jquery-ui.js to be loaded)

      theme: false, // set to true to use with jQuery UI themes

      // styles for the message when blocking; if you wish to disable
      // these and use an external stylesheet then do this in your code:
      // $.blockUI.defaults.css = {};
      css: {
         padding: 0,
         margin: 0,
         width: '40%',
         top: '40%',
         left: '35%',
         textAlign: 'center',
         color: '#000',
         border: '3px solid #aaa',
         backgroundColor: '#fff',
         cursor: 'wait'
      },

      // minimal style set used when themes are used
      themedCSS: {
         width: '40%',
         top: '40%',
         left: '35%'
      },

      // styles for the overlay
      overlayCSS: {
         backgroundColor: '#000',
         opacity: 0.6,
         cursor: 'wait'
      },

      // styles applied when using $.growlUI
      growlCSS: {
         width: '350px',
         top: '10px',
         left: '',
         right: '10px',
         border: 'none',
         padding: '5px',
         opacity: 0.6,
         cursor: 'default',
         color: '#fff',
         backgroundColor: '#000',
         '-webkit-border-radius': '10px',
         '-moz-border-radius': '10px',
         'border-radius': '10px'
      },

      // IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
      // (hat tip to Jorge H. N. de Vasconcelos)
      iframeSrc: /^https/i.test(window.location.href||'')?'javascript:false':'about:blank',

      // force usage of iframe in non-IE browsers (handy for blocking applets)
      forceIframe: false,

      // z-index for the blocking overlay
      baseZ: 1000,

      // set these to true to have the message automatically centered
      centerX: true, // <-- only effects element blocking (page block controlled via css above)
      centerY: true,

      // allow body element to be stetched in ie6; this makes blocking look better
      // on "short" pages.  disable if you wish to prevent changes to the body height
      allowBodyStretch: true,

      // enable if you want key and mouse events to be disabled for content that is blocked
      bindEvents: true,

      // be default blockUI will supress tab navigation from leaving blocking content
      // (if bindEvents is true)
      constrainTabKey: true,

      // fadeIn time in millis; set to 0 to disable fadeIn on block
      fadeIn: 200,

      // fadeOut time in millis; set to 0 to disable fadeOut on unblock
      fadeOut: 400,

      // time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
      timeout: 0,

      // disable if you don't want to show the overlay
      showOverlay: true,

      // if true, focus will be placed in the first available input field when
      // page blocking
      focusInput: true,

      // suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
      applyPlatformOpacityRules: true,

      // callback method invoked when fadeIn has completed and blocking message is visible
      onBlock: null,

      // callback method invoked when unblocking has completed; the callback is
      // passed the element that has been unblocked (which is the window object for page
      // blocks) and the options that were passed to the unblock call:
      //	 onUnblock(element, options)
      onUnblock: null,

      // don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
      quirksmodeOffsetHack: 4,

      // class name of the message block
      blockMsgClass: 'blockMsg'
   };

   // private data and functions follow...

   var pageBlock=null;
   var pageBlockEls=[];

   function install(el, opts) {
      var full=(el==window);
      var msg=opts&&opts.message!==undefined?opts.message:undefined;
      opts=$.extend({}, $.blockUI.defaults, opts||{});
      opts.overlayCSS=$.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS||{});
      var css=$.extend({}, $.blockUI.defaults.css, opts.css||{});
      var themedCSS=$.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS||{});
      msg=msg===undefined?opts.message:msg;

      // remove the current block (if there is one)
      if(full&&pageBlock)
         remove(window, { fadeOut: 0 });

      // if an existing element is being used as the blocking content then we capture
      // its current place in the DOM (and current display style) so we can restore
      // it when we unblock
      if(msg&&typeof msg!='string'&&(msg.parentNode||msg.jquery)) {
         var node=msg.jquery?msg[0]:msg;
         var data={};
         $(el).data('blockUI.history', data);
         data.el=node;
         data.parent=node.parentNode;
         data.display=node.style.display;
         data.position=node.style.position;
         if(data.parent)
            data.parent.removeChild(node);
      }

      var z=opts.baseZ;

      // blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
      // layer1 is the iframe layer which is used to supress bleed through of underlying content
      // layer2 is the overlay layer which has opacity and a wait cursor (by default)
      // layer3 is the message content that is displayed while blocking

      var lyr1=($.browser.msie||opts.forceIframe)
		?$('<iframe class="blockUI" style="z-index:'+(z++)+';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>')
		:$('<div class="blockUI" style="display:none"></div>');
      var lyr2=$('<div class="blockUI blockOverlay" style="z-index:'+(z++)+';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

      var lyr3, s;
      if(opts.theme&&full) {
         s='<div class="blockUI '+opts.blockMsgClass+' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:fixed">'+
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title||'&nbsp;')+'</div>'+
				'<div class="ui-widget-content ui-dialog-content"></div>'+
			'</div>';
      }
      else if(opts.theme) {
         s='<div class="blockUI '+opts.blockMsgClass+' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+z+';display:none;position:absolute">'+
				'<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title||'&nbsp;')+'</div>'+
				'<div class="ui-widget-content ui-dialog-content"></div>'+
			'</div>';
      }
      else if(full) {
         s='<div class="blockUI '+opts.blockMsgClass+' blockPage" style="z-index:'+z+';display:none;position:fixed"></div>';
      }
      else {
         s='<div class="blockUI '+opts.blockMsgClass+' blockElement" style="z-index:'+z+';display:none;position:absolute"></div>';
      }
      lyr3=$(s);

      // if we have a message, style it
      if(msg) {
         if(opts.theme) {
            lyr3.css(themedCSS);
            lyr3.addClass('ui-widget-content');
         }
         else
            lyr3.css(css);
      }

      // style the overlay
      if(!opts.applyPlatformOpacityRules||!($.browser.mozilla&&/Linux/.test(navigator.platform)))
         lyr2.css(opts.overlayCSS);
      lyr2.css('position', full?'fixed':'absolute');

      // make iframe layer transparent in IE
      if($.browser.msie||opts.forceIframe)
         lyr1.css('opacity', 0.0);

      //$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
      var layers=[lyr1, lyr2, lyr3], $par=full?$('body'):$(el);
      $.each(layers, function() {
         this.appendTo($par);
      });

      if(opts.theme&&opts.draggable&&$.fn.draggable) {
         lyr3.draggable({
            handle: '.ui-dialog-titlebar',
            cancel: 'li'
         });
      }

      // ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
      var expr=setExpr&&(!$.boxModel||$('object,embed', full?null:el).length>0);
      if(ie6||expr) {
         // give body 100% height
         if(full&&opts.allowBodyStretch&&$.boxModel)
            $('html,body').css('height', '100%');

         // fix ie6 issue when blocked element has a border width
         if((ie6||!$.boxModel)&&!full) {
            var t=sz(el, 'borderTopWidth'), l=sz(el, 'borderLeftWidth');
            var fixT=t?'(0 - '+t+')':0;
            var fixL=l?'(0 - '+l+')':0;
         }

         // simulate fixed position
         $.each([lyr1, lyr2, lyr3], function(i, o) {
            var s=o[0].style;
            s.position='absolute';
            if(i<2) {
               full?s.setExpression('height', 'Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"')
					 :s.setExpression('height', 'this.parentNode.offsetHeight + "px"');
               full?s.setExpression('width', 'jQuery.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"')
					 :s.setExpression('width', 'this.parentNode.offsetWidth + "px"');
               if(fixL) s.setExpression('left', fixL);
               if(fixT) s.setExpression('top', fixT);
            }
            else if(opts.centerY) {
               if(full) s.setExpression('top', '(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
               s.marginTop=0;
            }
            else if(!opts.centerY&&full) {
               var top=(opts.css&&opts.css.top)?parseInt(opts.css.top):0;
               var expression='((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
               s.setExpression('top', expression);
            }
         });
      }

      // show the message
      if(msg) {
         if(opts.theme)
            lyr3.find('.ui-widget-content').append(msg);
         else
            lyr3.append(msg);
         if(msg.jquery||msg.nodeType)
            $(msg).show();
      }

      if(($.browser.msie||opts.forceIframe)&&opts.showOverlay)
         lyr1.show(); // opacity is zero
      if(opts.fadeIn) {
         var cb=opts.onBlock?opts.onBlock:noOp;
         var cb1=(opts.showOverlay&&!msg)?cb:noOp;
         var cb2=msg?cb:noOp;
         if(opts.showOverlay)
            lyr2._fadeIn(opts.fadeIn, cb1);
         if(msg)
            lyr3._fadeIn(opts.fadeIn, cb2);
      }
      else {
         if(opts.showOverlay)
            lyr2.show();
         if(msg)
            lyr3.show();
         if(opts.onBlock)
            opts.onBlock();
      }

      // bind key and mouse events
      bind(1, el, opts);

      if(full) {
         pageBlock=lyr3[0];
         pageBlockEls=$(':input:enabled:visible', pageBlock);
         if(opts.focusInput)
            setTimeout(focus, 20);
      }
      else
         center(lyr3[0], opts.centerX, opts.centerY);

      if(opts.timeout) {
         // auto-unblock
         var to=setTimeout(function() {
            full?$.unblockUI(opts):$(el).unblock(opts);
         }, opts.timeout);
         $(el).data('blockUI.timeout', to);
      }
   };

   // remove the block
   function remove(el, opts) {
      var full=(el==window);
      var $el=$(el);
      var data=$el.data('blockUI.history');
      var to=$el.data('blockUI.timeout');
      if(to) {
         clearTimeout(to);
         $el.removeData('blockUI.timeout');
      }
      opts=$.extend({}, $.blockUI.defaults, opts||{});
      bind(0, el, opts); // unbind events

      var els;
      if(full) // crazy selector to handle odd field errors in ie6/7
         els=$('body').children().filter('.blockUI').add('body > .blockUI');
      else
         els=$('.blockUI', el);

      if(full)
         pageBlock=pageBlockEls=null;

      if(opts.fadeOut) {
         els.fadeOut(opts.fadeOut);
         setTimeout(function() { reset(els, data, opts, el); }, opts.fadeOut);
      }
      else
         reset(els, data, opts, el);
   };

   // move blocking element back into the DOM where it started
   function reset(els, data, opts, el) {
      els.each(function(i, o) {
         // remove via DOM calls so we don't lose event handlers
         if(this.parentNode)
            this.parentNode.removeChild(this);
      });

      if(data&&data.el) {
         data.el.style.display=data.display;
         data.el.style.position=data.position;
         if(data.parent)
            data.parent.appendChild(data.el);
         $(el).removeData('blockUI.history');
      }

      if(typeof opts.onUnblock=='function')
         opts.onUnblock(el, opts);
   };

   // bind/unbind the handler
   function bind(b, el, opts) {
      var full=el==window, $el=$(el);

      // don't bother unbinding if there is nothing to unbind
      if(!b&&(full&&!pageBlock||!full&&!$el.data('blockUI.isBlocked')))
         return;
      if(!full)
         $el.data('blockUI.isBlocked', b);

      // don't bind events when overlay is not in use or if bindEvents is false
      if(!opts.bindEvents||(b&&!opts.showOverlay))
         return;

      // bind anchors and inputs for mouse and key events
      var events='mousedown mouseup keydown keypress';
      b?$(document).bind(events, opts, handler):$(document).unbind(events, handler);

      // former impl...
      //	   var $e = $('a,:input');
      //	   b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
   };

   // event handler to suppress keyboard/mouse events when blocking
   function handler(e) {
      // allow tab navigation (conditionally)
      if(e.keyCode&&e.keyCode==9) {
         if(pageBlock&&e.data.constrainTabKey) {
            var els=pageBlockEls;
            var fwd=!e.shiftKey&&e.target===els[els.length-1];
            var back=e.shiftKey&&e.target===els[0];
            if(fwd||back) {
               setTimeout(function() { focus(back) }, 10);
               return false;
            }
         }
      }
      var opts=e.data;
      // allow events within the message content
      if($(e.target).parents('div.'+opts.blockMsgClass).length>0)
         return true;

      // allow events for content that is not being blocked
      return $(e.target).parents().children().filter('div.blockUI').length==0;
   };

   function focus(back) {
      if(!pageBlockEls)
         return;
      var e=pageBlockEls[back===true?pageBlockEls.length-1:0];
      if(e)
         e.focus();
   };

   function center(el, x, y) {
      var p=el.parentNode, s=el.style;
      var l=((p.offsetWidth-el.offsetWidth)/2)-sz(p, 'borderLeftWidth');
      var t=((p.offsetHeight-el.offsetHeight)/2)-sz(p, 'borderTopWidth');
      if(x) s.left=l>0?(l+'px'):'0';
      if(y) s.top=t>0?(t+'px'):'0';
   };

   function sz(el, p) {
      return parseInt($.css(el, p))||0;
   };
})(jQuery);
/*
* jQuery resize event - v1.1 - 3/14/2010
* http://benalman.com/projects/jquery-resize-plugin/
*
* Copyright (c) 2010 "Cowboy" Ben Alman
* Dual licensed under the MIT and GPL licenses.
* http://benalman.com/about/license/
*/
(function($, h, c) { var a=$([]), e=$.resize=$.extend($.resize, {}), i, k="setTimeout", j="resize", d=j+"-special-event", b="delay", f="throttleWindow"; e[b]=250; e[f]=true; $.event.special[j]={ setup: function() { if(!e[f]&&this[k]) { return false } var l=$(this); a=a.add(l); $.data(this, d, { w: l.width(), h: l.height() }); if(a.length===1) { g() } }, teardown: function() { if(!e[f]&&this[k]) { return false } var l=$(this); a=a.not(l); l.removeData(d); if(!a.length) { clearTimeout(i) } }, add: function(l) { if(!e[f]&&this[k]) { return false } var n; function m(s, o, p) { var q=$(this), r=$.data(this, d); r.w=o!==c?o:q.width(); r.h=p!==c?p:q.height(); n.apply(this, arguments) } if($.isFunction(l)) { n=l; return m } else { n=l.handler; l.handler=m } } }; function g() { i=h[k](function() { a.each(function() { var n=$(this), m=n.width(), l=n.height(), o=$.data(this, d); if(m!==o.w||l!==o.h) { n.trigger(j, [o.w=m, o.h=l]) } }); g() }, e[b]) } })(jQuery, this);

/**
* jQuery.labelify - Display in-textbox hints
* Stuart Langridge, http://www.kryogenix.org/
* Released into the public domain
* Date: 25th June 2008
* @author Stuart Langridge
* @version 1.3
*
*
* Basic calling syntax: $("input").labelify();
* Defaults to taking the in-field label from the field's title attribute
*
* You can also pass an options object with the following keys:
*   text
*     "title" to get the in-field label from the field's title attribute
*      (this is the default)
*     "label" to get the in-field label from the inner text of the field's label
*      (note that the label must be attached to the field with for="fieldid")
*     a function which takes one parameter, the input field, and returns
*      whatever text it likes
*
*   labelledClass
*     a class that will be applied to the input field when it contains the
*      label and removed when it contains user input. Defaults to blank.
*
*/
jQuery.fn.labelify=function(settings) {
   settings=jQuery.extend({
      text: "title",
      labelledClass: ""
   }, settings);
   var lookups={
      title: function(input) {
         return $(input).attr("title");
      },
      label: function(input) {
         return $("label[for="+input.id+"]").text();
      }
   };
   var lookup;
   var jQuery_labellified_elements=$(this);
   return $(this).each(function() {
      if(typeof settings.text==="string") {
         lookup=lookups[settings.text]; // what if not there?
      } else {
         lookup=settings.text; // what if not a fn?
      };
      // bail if lookup isn't a function or if it returns undefined
      if(typeof lookup!=="function") { return; }
      var lookupval=lookup(this);
      if(!lookupval) { return; }

      // need to strip newlines because the browser strips them
      // if you set textbox.value to a string containing them
      $(this).data("label", lookup(this).replace(/\n/g, ''));
      $(this).focus(function() {
         if(this.value===$(this).data("label")) {
            this.value=""; // this.defaultValue;
            $(this).removeClass(settings.labelledClass);
         }
      }).blur(function() {
         if(this.value==="") {//this.defaultValue) {
            this.value=$(this).data("label");
            $(this).addClass(settings.labelledClass);
         }
      });

      var removeValuesOnExit=function() {
         jQuery_labellified_elements.each(function() {
            if(this.value===$(this).data("label")) {
               this.value=""; // this.defaultValue;
               $(this).removeClass(settings.labelledClass);
            }
         })
      };

      $(this).parents("form").submit(removeValuesOnExit);
      $(window).unload(removeValuesOnExit);

      //if(this.value!==this.defaultValue) {
      if(this.value!=="") {
         // user already started typing; don't overwrite their work!
         return;
      }
      // actually set the value
      this.value=$(this).data("label");
      $(this).addClass(settings.labelledClass);
   });
};