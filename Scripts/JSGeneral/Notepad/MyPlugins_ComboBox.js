(function ($) {
   $.widget("ui.combobox_11", {
      _create: function () {
         //{ ListBox: true, Editable: false, data_ctrl: {Value:[dadeda],Tip:"Pasirinkite ið sàraðo..",DataSource:"tblDrivers",UpdateField:"DriverID"}, selectFirst: false, obj: "" }
         var opt=$.extend({ ListBox: true, Editable: false, data_ctrl: "", selectFirst: false }, this.options);
         //Editable saukia funkcija//id galima pridet
         //data_ctrl:{Value:??,Tip:??,DataSource:??,UpdateField:??}
         opt.data_ctrl.Tip=(opt.data_ctrl.Tip)?opt.data_ctrl.Tip:"";

         var Inited=0, self=this, select=this.element.hide(),
               selVal=select.children(":selVal"),
               value=($(selVal).val()=="-1"||(!$(selVal).length))?opt.data_ctrl.Tip:selVal.text();
         opt.data_ctrl.Value=$(selVal+":selVal").val();
         var input=this.input=$("<input>")
      .insertAfter(select)
      .data("ctrl", opt.data_ctrl)//pries tai ikisom pasirinkta verte
      .val(value)
               .autocomplete({
                  selectFirst: opt.selectFirst,
                  delay: 0, minLength: 0,
                  source: function (request, response) {
                     var matcher=new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                     response(select.children("option").map(function () {
                        var text=$(this).text();
                        if(this.value&&(!request.term||matcher.test(text)))
                           return {
                              label: text.replace(
                           new RegExp("(?![^&;]+;)(?!<[^<>]*)("+$.ui.autocomplete.escapeRegex(request.term)+")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                              value: text, option: this
                           };
                     }));
                  },
                  select: function (event, ui) {
                     ui.item.option.selVal=true;
                     self._trigger("selVal", event, { item: ui.item.option });
                     if(ui.item) { $(this).data("newval", ui.item.option.value); $(this).trigger('keypress'); } //Kad pamatyt pasikeitima

                     //alert("select:"+ui.item.value);
                     //ui.item.value  -  "Neapdrausta"  --	$(this).val()
                     //ui.item.option.value  -  "0"	--	$(this).data("newval")
                  },
                  change: function (event, ui) {
                     //Isimenam naujas reiksmes
                     if(ui.item) { $(this).data("newval", ui.item.option.value); } //console.log("New change:"+$(this).attr("data-newval"));
                     else { $(this).data("newval", ""); } //console.log("New:"+$(this).attr("data-newval"));

                     if(!ui.item) {
                        var matcher=new RegExp("^"+$.ui.autocomplete.escapeRegex($(this).val())+"$", "i"), valid=false;
                        select.children("option").each(function () {
                           if($(this).text().match(matcher)) { this.selVal=valid=true; return false; }
                        });
                        if(!valid) {
                           var t=$(this); t.data("newval", "");
                           //Jei yra default text ji paliekam
                           if(t.data("ctrl")) { if(t.data("ctrl").Tip===t.val()) return true; }
                           // remove invalid value, as it didn't match anything
                           t.val(""); select.val("");
                           if(typeof input.data("autocomplete")!='undefined') input.data("autocomplete").term="";
                           t.removeClass('alink');
                           return false;
                        }
                     } else {
                        $(this).data("newval", ui.item.option.value);
                        //alert($(this).data("newval"));
                     }
                  }, close: function () {
                     if(opt.Editable) { //linko pridëjimas
                        var t=$(this), newVal=(t.data("newval"))?t.data("newval").replace("0", ""):"";
                        //alert("close: txt-"+$(this).val()+",val:"+$(this).data("newval"));
                        if(!t.hasClass('alink')&&newVal) { t.addClass('alink').unbind('click').bind('click', function () { EDITFORM({ objName: opt.data_ctrl.DataSource, id: newVal }); }) }
                        else if(newVal) { t.unbind('click').bind('click', function () { EDITFORM({ objName: opt.data_ctrl.DataSource, id: newVal }); }) }
                        else if(t.hasClass('alink')&&!newVal) { t.removeClass('alink').unbind('click'); }
                     }
                  }
               })
         if(opt.Editable) {
            var val=$(selVal).val();
            var p={ objName: opt.data_ctrl.DataSource, id: (val)?val:0 };
            if(typeof val!='undefined') {
               input.addClass('alink')
             .bind('click', function () { EDITFORM(p); });
               //EDITFORM({ objName: opt.data_ctrl.DataSource, id: val })      reikia kist i function(){} nes priesingu atveju is karto paleidzia
            }
         }
         //---------------------------------------------------------------------------------------------------
         if(!opt.ListBox&&!opt.Editable) { input.addClass("ui-widget ui-corner-all ui-widget-content"); } else { input.addClass("ui-widget ui-corner-left ui-widget-content"); } //ui-widget-content
         //pluginas AutoComplete Select first
         $(".ui-autocomplete-input").live("autocompleteopen", function () {
            var autocomplete=$(this).data("autocomplete"), menu=autocomplete.menu;
            if(!autocomplete.options.selectFirst) { return; }
            menu.activate($.Event({ type: "mouseenter" }), menu.element.children().first());
         });
         //---------------------------------------------------------------------------------------------------
         // This line added to set default value of the combobox
         input.data("autocomplete")._renderItem=function (ul, item) {
            return $("<li></li>").data("item.autocomplete", item).append("<a>"+item.label+"</a>").appendTo(ul);
         };
         if(opt.Editable) {
            var id=$(this).data("newval"); id=(id)?id:0;
            this.addButton({ title: "Pridëti naujà", icon: "ui-icon-circle-plus", fn: function () { EDITFORM({ objName: opt.data_ctrl.DataSource, Edit: 0 }); }, NoCorners: false, green: true }, input);
         };
         if(opt.ListBox) {
            this.addButton({ title: "Parodyti visus", icon: "ui-icon-triangle-1-s", fn: function () {
               // close if already visible
               if(input.autocomplete("widget").is(":visible")) { input.autocomplete("close"); return; }
               // pass empty string as value to search for, displaying all results
               input.autocomplete("search", ""); input.focus(); return false;
            }, NoCorners: ((opt.Editable)?true:false), green: false
            }, input);
            input.attr("readonly", true);
         };
         //         if(opt.ListBox) {
         //            this.button=$("<button>&nbsp;</button>").attr("tabIndex", -1).attr("title", "Parodyti visus").insertAfter(input)
         //					.button({ icons: { primary: "ui-icon-triangle-1-s" }, text: false }).width(input.height())
         //					.removeClass("ui-corner-all")
         //					.addClass("ui-button-icon")
         //					.click(function () {
         //					   // close if already visible
         //					   if(input.autocomplete("widget").is(":visible")) {
         //					      input.autocomplete("close");
         //					      return;
         //					   }
         //					   // pass empty string as value to search for, displaying all results
         //					   input.autocomplete("search", "");
         //					   input.focus();
         //					   return false;
         //					});
         //         }
      },
      addButton: function (p, input) {
         //title,icon,fn,NoCorners,green
         this.button=$("<button>&nbsp;</button>").attr("tabIndex", -1).attr("title", p.title).insertAfter(input)
                      .button({ icons: { primary: p.icon }, text: false }).css("vertical-align", "bottom").width(22).height(input.height()+4.5)
                      .click(function () {
                         //alert("opa");
                         p.fn();
                      })
                      .removeClass("ui-corner-all").addClass("ui-button-icon"+((p.NoCorners)?"":" ui-corner-right")+((p.green)?" ui-state-green":""));
      },
      destroy: function () {
         this.input.remove();
         if(typeof this.button!='undefined') this.button.remove(); //Reikia uncomentinti norint buttono
         this.element.show();
         $.Widget.prototype.destroy.call(this);
      }
   });
})(jQuery);




//pluginas AutoComplete Select first
//(function ($) {
//   $(".ui-autocomplete-input").live("autocompleteopen", function () {
//      var autocomplete=$(this).data("autocomplete"),menu=autocomplete.menu;
//      if(!autocomplete.options.selectFirst) {return; }
//      menu.activate($.Event({ type: "mouseenter" }), menu.element.children().first());
//   });

//}) (jQuery);