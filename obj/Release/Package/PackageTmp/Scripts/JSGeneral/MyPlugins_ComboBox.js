/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js"
(function($) {
   $.widget("ui.ComboBox", {
      options: { ListType: "List", Editable: false, iVal: 0, iText: [1], selectFirst: false, Value: "" },
      _create: function() {
         //surandam artimiausia inputa ant kurio desim listboxa
         //         if(this.element[0].nodeName==='INPUT') { var input=$(this.element[0]); }
         //         else {
         //            var t=this.element.parent().find('input')[0];
         //            if(t.nodeName==='INPUT') { var input=$(t); } else { alert('Error! Input not found for ComboBox! (MyPlugins_ComboBox:10)'); }
         //         }
         var input=$(this.element[0]); if(input===undefined) { alert('Error! Input not found for ComboBox! (MyPlugins_ComboBox:10)'); }
         var opt=$.extend(this.options, $(input).data("ctrl"));
         //opt = $.extend({ ListType: "List", Editable: false, iVal: 0, iText: [1], selectFirst: false }, opt);     //ListType:{None(be nieko, galima spausdint), List(listas, spausdint negalima), Combo(Listas, spausdint galima)}
         var data=$.map(oDATA.Get(opt.Source).Data,
         function(a) {
            var ret=[];
            for(var i=0; i<opt.iText.length; i++) { { ret.push(a[opt.iText[i]]); } }
            if(a[0]===opt.Value) { input.val(ret.join(",")); } //Idedam verte i textboxa
            return { id: a[0], value: ret.join(",") };
         });
         if(typeof opt.Append!=='undefined') { data[data.length]=opt.Append; } //Pridedam prie listo pvz: {Value:0, Text:"Neapdrausta"}
         $(input).data("newval", opt.Value)
         //.val(value)
   .autocomplete({
      selectFirst: opt.selectFirst, delay: 0, minLength: 0,
      //source: data,

      source: function(request, response) {
         var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i"), suggestions=[];
         input.removeClass('alink');
         $.each(data, function(i, a) {
            var text=a.value;
            if(a.value&&(!request.term||matcher.test(text)))
               suggestions.push({ label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                  value: text, // option: this,
                  id: a.id
               });
         });
         //alert(suggestions);
         response(suggestions);

         //         var resp=data.map(function(a) {
         //            var text=a.value;
         //            if(a.value&&(!request.term||matcher.test(text)))
         //               return {
         //                  label: text.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
         //                  value: text, // option: this,
         //                  id: a.id
         //               };
         //            else return null;
         //         });
         //         response=resp;
      },

      //      function (request, response) {
      //         var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
      //         response(select.children("option").map(function () {
      //            var text=$(this).text();
      //            if(this.value&&(!request.term||matcher.test(text)))
      //               return {
      //                  label: text.replace(
      //               new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
      //                  value: text, option: this
      //               };
      //         }));
      //         }
      select: function(event, ui) {
         if(ui.item) { $(this).data("newval", ui.item.id); } //Kad pamatyt pasikeitima  $(this).trigger('keypress');

         //alert("select:"+ui.item.value);
         //ui.item.value  -  "Neapdrausta"  --	$(this).val()
         //ui.item.option.value  -  "0"	--	$(this).data("newval")
         console.log("Select:"+$(this).data("newval"));
      }, change: function(event, ui) {
         //Isimenam naujas reiksmes
         if(ui.item) {
            $(this).data("newval", ui.item.id);
            console.log("New change:"+$(this).data("newval"));
         }
         else {
            $(this).data("newval", "");
            var t=$(this); t.data("newval", "");
            //Jei yra default text ji paliekam
            if(opt.Tip) { if(opt.Tip===t.val()) return true; }
            // remove invalid value, as it didn't match anything
            t.val("");
            if(typeof input.data("autocomplete")!='undefined') input.data("autocomplete").term="";
            t.removeClass('alink'); return false;
         } //console.log("New:"+$(this).attr("data-newval"));
      }, close: function() {
         //$(input).rem
         if(opt.ListType) { //linko pridėjimas
            var t=input, newVal=t.data("newval"); // (t.data("newval"))?t.data("newval").replace("0", ""):"";
            //alert("close: txt-"+$(this).val()+",val:"+$(this).data("newval"));
            if(!t.hasClass('alink')&&newVal) { t.addClass('alink').unbind('dblclick').bind('dblclick', function() { EDITFORM({ objName: opt.Source, id: newVal }); }) }
            else if(newVal) { t.unbind('dblclick').bind('dblclick', function() { EDITFORM({ objName: opt.Source, id: newVal }); }) }
            else if(t.hasClass('alink')&&!newVal) { t.removeClass('alink').unbind('dblclick'); }
         } if(opt.ListType!=="None") { input.removeClass("activeField"); }
      }, open: function() { if(opt.ListType!=="None") { if(!input.hasClass("activeField")) { input.addClass("activeField"); } } }
   })
         if(opt.Editable) {
            var val=input.data("newval"), p={ objName: opt.Source, id: (val)?val:0 };
            if(val) {
               input.addClass('alink').bind('dblclick', function() { EDITFORM(p); });
               //EDITFORM({ objName: opt.data_ctrl.DataSource, id: val })      reikia kist i function(){} nes priesingu atveju is karto paleidzia
            }
         }
         //---------------------------------------------------------------------------------------------------
         if(opt.ListType!=="None"||opt.Editable) { input.removeClass("ui-corner-all").addClass("ui-corner-left"); } //ui-widget-content
         //pluginas AutoComplete Select first
         $(".ui-autocomplete-input").live("autocompleteopen", function() {
            var autocomplete=$(this).data("autocomplete"), menu=autocomplete.menu;
            if(!autocomplete.options.selectFirst) { return; }
            menu.activate($.Event({ type: "mouseenter" }), menu.element.children().first());
         });
         //---------------------------------------------------------------------------------------------------
         // This line added to set default value of the combobox
         $(input).data("autocomplete")._renderItem=function(ul, item) {
            return $("<li></li>").data("item.autocomplete", item).append("<a>"+item.value+"</a>").appendTo(ul);
         };
         if(opt.Editable) {
            var id=$(this).data("newval"); id=(id)?id:0;
            this.addButton({ title: "Pridėti naują", icon: "ui-icon-circle-plus", fn: function() { EDITFORM({ objName: opt.data_ctrl.DataSource, Edit: 0 }); }, NoCorners: false, green: true }, input);
         };
         if(opt.ListType!="None") {
            this.addButton({ title: "Parodyti visus", icon: "ui-icon-triangle-1-s", fn: function() {
               // close if already visible
               if(input.autocomplete("widget").is(":visible")) { input.autocomplete("close"); return; }
               // pass empty string as value to search for, displaying all results
               input.autocomplete("search", ""); input.focus(); return false;
            }, NoCorners: ((opt.Editable)?true:false), green: false
            }, input);
         };
         if(opt.ListType=="List") {
            input.attr("readonly", true);
            input.click(function() { input.autocomplete("search", ""); input.focus(); return false; }) //display all records
         } else {
            input.click(function() { this.select(); })
         }
      },
      addButton: function(p, input) {
         //title,icon,fn,NoCorners,green
         this.button=$("<button>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input)
                      .button({ icons: { primary: p.icon }, text: false }).css("vertical-align", "bottom").width(22).height(input.height()+4.5)
                      .click(function() { p.fn(); })
                      .removeClass("ui-corner-all").addClass("ui-button-icon"+((p.NoCorners)?"":" ui-corner-right")+((p.green)?" ui-state-green":""));
         input.width(input.width()-this.button.width());
      },
      destroy: function() {
         //input.remove();
         //if(typeof this.button!='undefined') this.button.remove(); //Reikia uncomentinti norint buttono
         //this.element.show();
         $.Widget.prototype.destroy.call(this);
      }
   });
})(jQuery);