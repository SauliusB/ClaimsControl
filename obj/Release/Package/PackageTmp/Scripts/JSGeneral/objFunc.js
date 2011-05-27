/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSGeneral/objData.js" />
/// <reference path="Main_Render_MainDiv.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="Server.js" />

//-----------------------Table Filling Functions------------------------------------------------------------------------------------------------
var oCONTROLS={ lbl: function(text) { return "<label class='dialog-form-label'>"+text+"</label>"; },
   AddToProperty: function(Object, Property, Value) { Object[Property]=(Object[Property])?Object[Property]+' '+Value:Value; return Object; },

   //{id:??,data-ctrl:??,classes:??,title:??, notabstop:??, style:??}
   basic: function(p) {
      //disabled - dadedam klase ui-state-disabled
      //green - dadedam klase ui-state-green
      //if(p.type!='undefined') { if(p.type=='green') { oCONTROLS.AddToProperty(p, 'classes', 'ui-state-green'); }   }
      return ((p.attr)?p.attr+" ":"")+((p.id)?"id='"+p.id+"' ":"")+((p.style)?'style="'+p.style+'" ':'')+((p.notabstop)?"tabindex='-1' ":"")+((p.title)?"title='"+p.title+"' ":"")+((p.data_ctrl)?"data-ctrl='"+p.data_ctrl+"' ":"")+((p.classes)?"class='"+p.classes+"' ":"");

      //return ((p.attr)?p.attr:'')+((p.id)?'id="'+p.id+'" ':'')+((p.style)?"style='"+p.style+"' ":"")+((p.notabstop)?'tabindex="-1" ':'')+((p.title)?'title="'+p.title+'" ':'')+((p.data_ctrl)?'data-ctrl="'+p.data_ctrl+'" ':'')+((p.classes)?'class="'+p.classes+'" ':'');
   },
   //prideda lbl prie txt, txtarea, chk. p.label={txt:"labelio tekstas", classes:"lblclass", type:"Top/Left"}
   appendLabel: function(p, t) { if(typeof p.label==='undefined') { return t; } else { return (p.label.type==="Top")?"<label><span>"+p.label.txt+"</span>"+t+"</label>":"<label>"+p.label.txt+t+"</label>"; } },
   //appendLabel: function(p, t) { if(typeof p.label==='undefined') { return t; } else { return (p.label.type==="Top")?"<label><div"+((p.label.classes)?" class='"+p.label.classes+"'":"")+">"+p.label.txt+"</div>"+t+"</label>":"<label"+((p.label.classes)?" class='"+p.label.classes+"'":"")+">"+p.label.txt+t+"</label>"; } },
   //kaip basic + p.text
   txt: function(p) { return this.appendLabel(p, "<input type='text' "+this.basic(p)+((p.text)?'value="'+p.text+'" ':'')+"/>"); },
   //kaip basic + p.label
   //kaip basic + p.text
   a: function(p) { return "<a "+this.basic(p)+" href='javascript:void(0);return false;'>"+p.value+"</a>"; },
   txtarea: function(p) { return this.appendLabel(p, "<textarea cols='100' rows='4' "+this.basic(p)+">"+((p.text)?p.text:"")+"</textarea>"); },
   chk: function(p) { return "<label"+((p.label.classes)?" class='"+p.label.classes+"'":"")+"><input type='checkbox' "+this.basic(p)+((p.Value)?"checked='checked'":"")+"/>"+((p.label.txt)?p.label.txt:"")+"</label>"; },
   //{src:??,alt:??,onclickfn:??}
   img: function(p) { return "<img src='"+p.src+"' alt='"+p.alt+"' onclick='"+p.onclickfn+"'/>"; },
   //{name:??,style:??,onclickfn:??,colorClass:??-not implemented}
   ui_img: function(p) { return "<span class='ui-icon "+p.name+"' style='"+p.style+";margin-top:.5em;' onclick=\""+p.onclickfn+"\"/>"; },
   //{pWraper.width:??,pWraper.style:??,pWraper.classes:??(default ui-widget-content),ptxt:(kaip basic),pimg:(kaip img)}

   txt_imgINtxt: function(pWraper, ptxt, pui_img) {
      ptxt.classes=(ptxt.classes)?ptxt.classes+' InputInWraper':'InputInWraper'; //panaikinami inputo borderiai
      var w='width:'+(pWraper.width-20)+'px;'; ptxt.style=(ptxt.style)?ptxt.style+w:w;
      return "<div "+this.basic(pWraper)+"width:"+pWraper.width+"px;"+"'>"+this.txt(ptxt)+this.ui_img(pui_img)+"</div>";
      //return "<div style='"+(pWraper.style?pWraper.style:"")+"width:"+pWraper.width+"px;' class='ui-widget-content "+((pWraper.classes)?" "+pWraper.classes:"")+"'>"+this.txt(ptxt)+this.ui_img(pui_img)+"</div>";
   },

   btnOKimg: function(title) { return "<button tabindex='-1' title='"+title+"' class='ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-all ui-button-icon' role='button'><span class='ui-button-icon-primary ui-icon ui-icon-circle-check'></span><span class='ui-button-text'>&nbsp;</span></button></div>"; },
   lbltxt_inline_btnConfirm: function(id, lblTitle, txtData, txtValue, btnTitle) { return "<div id="+id+"><label class='dialog-form-label'>"+lblTitle+"</label><input type='text' data-ctrl=\""+txtData+"\" value='"+txtValue+"' class='validate-dialog ui-widget-content ui-corner-left'/><button tabindex='-1' title='"+btnTitle+"' class='ui-button ui-widget ui-state-default ui-button-icon-only ui-corner-right ui-button-icon' role='button'><span class='ui-button-icon-primary ui-icon ui-icon-circle-check'></span><span class='ui-button-text'>&nbsp;</span></button></div>"; },
   lbla_inline: function(id, lblTitle, aValue, data_ctrl) { return "<div id="+id+"><label class='dialog-form-label'>"+lblTitle+"</label><a data-ctrl=\""+data_ctrl+"\" href='javascript:void(0);'>"+aValue+"</a></div>"; },
   //{id:??,text:??,icon:??(zaliam dadedama klase 'green'),title:??,disabled:??, notabstop:??, floatRight:??}

   btnTextOnly: function(p) {
      oCONTROLS.AddToProperty(p, 'classes', 'ui-button ui-corner-all ui-button-text-icon-primary');
      return '<button '+oCONTROLS.basic(p)+'" role="button"><span class="ui-button-text">'+p.text+'</span></button>';
   },
   btnImgOnly: function(p) {
      oCONTROLS.AddToProperty(p, 'classes', 'ui-button ui-corner-all ui-icon-only');
      return '<button '+oCONTROLS.basic(p)+'" role="button"><span class="ui-button-icon-primary ui-icon '+p.icon+'"></span></button>';
   },
   btnTextImg: function(p) {
      oCONTROLS.AddToProperty(p, 'classes', 'ui-button ui-corner-all ui-button-text-icon-primary');
      return '<button '+oCONTROLS.basic(p)+'" role="button"><span class="ui-button-icon-primary ui-icon '+p.icon+'"></span><span class="ui-button-text">'+p.text+'</span></button>';
   },
   OptionList: function(p) {
      ///<summary>Gets option list HTML</summary>
      ///<param name="p">{Arr:'Array to get options from',ListBoxid:'id of listbox to set', ValI:'index in array to get value for listbox',TextI:'arry of indexes to show in listbox text',
      ///SelectedID:'id to be selected',ReplaceArr:'[{Ix:??,txtIx:??,obj:??}] - pakeicia idus tekstais(Ix-kuri i pakeisti, txtIx-kur obj sedi tekstas, obj-duomenu objektas)'}</param>
      var HTML="<select id='"+p.id+"' name= id='"+p.id+"'>";
      for(var i=0; i<p.Arr.length; i++) {
         var Text=[];
         for(var I=0; I<p.TextI.length; I++) { Text.push(p.Arr[i][p.TextI[I]]); }
         //-----------------id lauku pakeitimas-----------pradzia---------------------------------
         if(typeof (p.ReplaceArr)!='undefined') {
            for(var iobj=0; iobj<p.ReplaceArr.length; iobj++) {//begam per objektus
               var obj=p.ReplaceArr[iobj].obj.Data, Ix=p.ReplaceArr[iobj].Ix, txtIx=p.ReplaceArr[iobj].txtIx;
               for(var ix=0; ix<obj.length; ix++) { if(Text[Ix]===obj[ix][0]) { Text[Ix]=obj[ix][txtIx]; break; } } //begam per obj ir kai surandam i pakeiciam i tekstu
            }
         }
         //-----------------id lauku pakeitimas------------pabaiga---------------------------------
         Text=Text.join(", ");
         if(p.SelectedID) { HTML+="<option value=\""+p.Arr[i][p.ValI]+((+p.Arr[i][0]==p.SelectedID)?"\" selected=\"selected\"":"\"")+">"+Text+"</option>"; }
         else { HTML+="<option value=\""+p.Arr[i][p.ValI]+"\">"+Text+"</option>"; }
      } return HTML+"</select>";
   },
   //AppendFuncToForm: { ComboBox: function(frm) {
   //   $(frm).find('input.data-list').ComboBox();
   //}},
   UpdatableForm: function(frm) {
      //frm data-ctrl:: labelType:Top/Left/undefined,
      var eName, frmOpt=$(frm).data('ctrl'),
       data=oDATA.Get(frmOpt.Source),
       eCols=data.Cols; if(typeof data==='undefined') { alert('Source undefined in UpdatableForm(objFunc:79)!'); }
      $(frm).find('div.ExtendIt').each(function() {
         var e=$(this), eOpt=e.data('ctrl'), Markup=(eOpt.Markup)?eOpt.Markup:"", eHTML='', ix=0, classes='ui-widget-content ui-corner-all', id='', Value='', attr='', data_ctrl={};
         //Surandam lauko indeksa
         for(var i=0; i<eCols.length; i++) { if(eCols[i].FName===eOpt.Field) { ix=i; eName=data.Grid.aoColumns[i].sTitle; break; } }
         if(ix===0) { alert('Wrong Field indicated '+eOpt.Field+' in UpdatableForm(objFunc:84)!'); }

         //#region duomenu is data.Cols[ix] ir eOpt(elemento data('ctrl')) surasymas i data_ctrl arba i propercius
         var col=data.Cols[ix], input;
         for(var prop in col) {
            if(prop==='Validity'||prop==='Tip') { data_ctrl[prop]=col[prop]; } // if(prop==='Tip') { classes+=' defaultText'; }
            if(prop==='List') { $.extend(data_ctrl, col[prop]); } //Listo propercius dedu vienam lygyje su kitais
         } prop=undefined;
         for(var prop in eOpt) {
            if(prop==='classes') { classes+=' '+eOpt[prop]; }
            else if(prop==='id') { id=eOpt[prop]; }
            else if(prop==='attr') { attr=eOpt[prop]; }
            else if(prop==='Value') { data_ctrl[prop]=eOpt[prop]; Value=eOpt[prop]; }
            else if(prop==='Field') { data_ctrl[prop]=eOpt[prop]; }
         }
         data_ctrl=JSON.stringify(data_ctrl);
         //#endregion

         //elemento html kurimas ir irasymas - Listas arba paprastas
         if(typeof col.List!=='undefined') {
            eHTML+=oCONTROLS.txt({ "data_ctrl": data_ctrl, "title": eName, "classes": classes+' text', "id": id, "attr": attr, "label": { "txt": eName, "type": eOpt.labelType} });
            input=$(eHTML).prependTo(e).find('input').ComboBox();
         }
         else if(typeof col.Valid!=='undefined') {
            var Type=col.Valid.Type, isTime=0;
            if(Type==='boolean') { eHTML=oCONTROLS.chk({ "Value": Value, "data_ctrl": data_ctrl, "label": { "txt": eName }, "classes": classes, "id": id, "attr": attr }); $(eHTML).prependTo(e); } //.find('input:checkbox');
            if(Type==='AlphaNumSpace') {
               var len=(typeof col.Valid.LenMax==='undefined')?0:col.Valid.LenMax;
               if(len<101) {
                  eHTML+=oCONTROLS.txt({ "data_ctrl": data_ctrl, "text": Value, "title": eName, "classes": classes+' text', "id": id, "attr": attr, "label": { "txt": eName, "type": eOpt.labelType} });
                  input=$(eHTML).prependTo(e).find('input:first');
               } else {
                  eHTML+=oCONTROLS.txtarea({ "data_ctrl": data_ctrl, "text": Value, "title": eName, "classes": classes+' textarea', "id": id, "attr": attr, "label": { "txt": eName, "type": eOpt.labelType} });
                  input=$(eHTML).prependTo(e).find('textarea:first');
               }
            }
            if(Type==='Integer'||Type==='Decimal') { //OK
               data_ctrl=data_ctrl.replace("match('integer')", "match(integer)").replace("match('number')", "match(number)");
               eHTML+=oCONTROLS.txt({ "data_ctrl": data_ctrl, "text": Value, "title": eName, "classes": classes, "id": id, "attr": attr, "label": { "txt": eName, "type": eOpt.labelType} });
               input=$(eHTML).prependTo(e).find('input').ValidateOnBlur({ Allow: Type });
            }
            if(Type.search("Date")!== -1) {// Date DateNotMore DateNotLess DateNotMoreCtrl DateNotLessCtrl
               //classes+=classes+' date';
               data_ctrl=data_ctrl.replace("match('date')", "match(date)");
               if(Type.search("Ctrl")!== -1) { var ctrl=1; classes+=classes+' '+Type; }
               if((typeof Value==='undefined'||Value==="")&&typeof col.Valid.Default!=='undefined') { Value=fnGetTodayDateString(); }
               if(Type.search("Time")!== -1) { var TimeValue=(Value.length>=16)?Value.substring(11, 16):"00:00"; isTime=1; }
               Value=Value.substring(0, 11);
               eHTML+=oCONTROLS.txt({ "data_ctrl": data_ctrl, "text": Value, "title": "Dienos data", "classes": classes+" date", "id": id, "attr": attr, "label": { "txt": eName, "type": eOpt.labelType} });
               if(isTime) { eHTML+=oCONTROLS.txt({ "text": TimeValue, "style": "margin-left:20px;", "title": "Laikas", "classes": "time ui-widget-content ui-corner-all UpdateField" }); }
               input=$(eHTML).prependTo(e).find('input:first');
               //if(typeof col.Valid.Default!=='undefined') { input.html((col.Valid.Default==='today')?fnGetTodayDateString()+" 00:00":""); }
               if(Markup) {
                  var CtrlOpt=(Type.search("More")!== -1)?{ minDate: '0', maxDate: '+3y +12m'}:{ minDate: '-15y -15m', maxDate: '0' };
                  //CtrlOpt.yearRange='c-10:c+10';
                  if(typeof Markup.Plugin[0]!=='undefined') { input.datepicker(CtrlOpt); }
               }
               input.ValidateOnBlur({ Allow: 'date' });
            }
         }
         //if(typeof input!=='undefined'&&typeof eOpt.labelType!=='undefined') { input.wrap('<div class="new" />'); }
         //e.prepend(eHTML);
         //(eHTML).prependTo(e).ComboBox();   //Is kart po pradzios tago
         if(typeof input!=='undefined') {
            if(typeof col.Tip!=='undefined') { input.labelify({ labelledClass: " inputTip ", text: function(input) { return $(input).data('ctrl').Tip; } }); }       //, labelledClass: "inputTip"
         }
      });
   },
   //------------------Funkcijos ne tik generuojancios html i kontrola, bet ir upsidatinancios------------------------------------------------------------------------------
   Set_Updatable_HTML: {
      mega_select_list: function(d) {
         //d={ctrl:??,oDATA:??, opt:{text:??,val:??,FieldName:??,SelectText:??},fnAfterOptClick:?? }
         //oDATA.obj atiduodamas visas SD (kad turet ir Data ir Cols
         //istatomas listas, kuris i data("ctrl")._FieldName_ pagal pasirinkima istato val, be to kolapsinasi
         var HTML="<p tabindex='0' class='rowHeight' style='background-color:#d3d1ba;margin-top:0px;font-weight:bold;'>"+d.opt.SelectText+"<span style='margin-left:10px;cursor:pointer;color: #3366CC;text-decoration: underline;'></span><a id='aCancelSelectOpt' class='floatright' href='#'>Atšaukti</a><div class='clearfix'></div></p>";
         HTML+="<div class='megaselectlistoptions'>";
         var listHTML="";
         for(var i=0; i<d.oDATA.Data.length; i+=3) {
            listHTML+="<div class='megaselectlistcolumn'><ul>";
            listHTML+="<li 'tabindex=-1' data-val="+d.oDATA.Data[i][d.opt.val]+">"+d.oDATA.Data[i][d.opt.text]+"</li>";
            listHTML+="<li 'tabindex=-1' data-val="+d.oDATA.Data[i+1][d.opt.val]+">"+d.oDATA.Data[i+1][d.opt.text]+"</li>";
            listHTML+="<li 'tabindex=-1' data-val="+d.oDATA.Data[i+2][d.opt.val]+">"+d.oDATA.Data[i+2][d.opt.text]+"</li></ul></div>";
         }
         HTML+=listHTML+"<div style='clear: both;'></div></div></hr>"; //&nbsp;
         $(d.ctrl).append(HTML);
         var Opt=d.ctrl.find('div.megaselectlistoptions'); Opt.data("height", Opt.height());
         //d.ctrl.delegate('a.floatright', 'click', function() { d.fnCancel(); return false; });
         d.ctrl.find('a.floatright').bind('click', function() { d.fnCancel(); return false; });
         d.ctrl.find('li').bind('click', function() {
            $('#aCancelSelectOpt').remove();
            li=$(this); d.ctrl.find('span:eq(0)').html(li.html());
            d.ctrl.data("ctrl")[d.opt.FieldName]=li.data("val");
            d.ctrl.attr("data-ctrl", JSON.stringify(d.ctrl.data("ctrl"))); //ikisu i "data-ctrl" atrributa

            if(typeof d.fnAfterOptClick=="function") d.fnAfterOptClick($(this));
            //d.ctrl.find('div.megaselectlistoptions').animate({ height: "0px" });
            d.ctrl.find('div.megaselectlistoptions').height("0px");
            //alert("2 "+d.ctrl.find('div.megaselectlistoptions').height());
            //d.ctrl.find('div.megaselectlistoptions').animate({ height: "0" }); //$(d).animate({ height: "0px" });
         });
         d.ctrl.find('span').bind('click', function() {
            var Opt=d.ctrl.find('.megaselectlistoptions');
            if(Opt.height()==0) { Opt.animate({ height: Opt.data("height")+'px' }); }
            else { Opt.animate({ height: "0px" }); }
         });
      }, lbltxt_inline_btnConfirm: function(d) {
         //d={ctrl:??,lblTitle:??,txt:{Title:??,Value:??}, btnTitle:??,Data:{tblToUpdate:??,UpdateField:??,id:??,Validity:??},fnCallBack:??,fnPostInit:?? }

         //d={ctrl:??,lblTitle:??,txt:{Title:??,Value:??}, btnTitle:??,Data:{tblToUpdate:??,Validity:??},DataToSave:{Data:[??],Fields:[?],id:??},fnCallBack:??,fnPostInit:?? }
         //var primaryHTML=ctrl.html();
         d.ctrl.html(oCONTROLS.lbl(d.lblTitle)+oCONTROLS.txt(d.txt.Title, d.txt.Value, "{\"Validity\":\""+d.Data.Validity+"\"}")+oCONTROLS.btnOKimg(d.btnTitle));
         if(typeof d.fnPostInit!='undefined') d.fnPostInit();
         d.ctrl.find("button").bind('click', function(e) {
            e.preventDefault();
            if(oGLOBAL.ValidateCtrlsArr([d.ctrl.find("input")])) {
               //var DataToSave={ Data: [d.ctrl.find("input").val()], Fields: [d.Data.UpdateField] }; DataToSave["id"]=d.Data.id;
               d.DataToSave.Data[0]=d.ctrl.find("input").val();
               oGLOBAL.UpdateServer("Edit", d.DataToSave, d.Data.tblToUpdate, d.fnCallBack, "");
            }
            d.ctrl.block("Siunčiami duomenys.."); return false;
         });
      }, lbla_inline: function(d) {
         //d={ctrl:??,lblTitle:??,a:Value:??, Data:{tblToUpdate:??},DataToSave:{Data:[??],Fields:[?],id:??},fnCallBack:??}
         d.ctrl.html(oCONTROLS.lbla_inline("divID"+d.DataToSave.id, d.lblTitle, d.Value, ""));
         d.ctrl.find("a").bind('click', function(e) {
            e.preventDefault();
            //var DataToSave={ Data: [null], Fields: ["DataEnd"] }; DataToSave["id"]=RowData[0];
            oGLOBAL.UpdateServer("Edit", d.DataToSave, d.Data.tblToUpdate, d.fnCallBack, "");
            d.ctrl.block("Siunčiami duomenys.."); return false;
         });
      }
   }
}
var oGLOBAL={
   /// <field name="None" type="Number" integer="true" static="true"/>
   /// <field name="One" type="Number" integer="true" static="true"/>
   /// <field name="Two" type="Number" integer="true" static="true"/>
   /// <field name="fieldName" type="FieldType"</field>
   temp: {},
   map: {},
   someProperty: 'some value here',
   GetURL: function(NewI) { //jei -1 grazina ankstesni, kitu atveju ta kur nurodytas
      NewI=oGLOBAL.GetNo(NewI);
      var p=location.pathname.split("/"); LastI=p[length-1]; LastI=oGLOBAL.GetNo(LastI); ; p.pop(); p=p.join("/");
      if(NewI<0) { location.replace(p+"/"+(LastI-1)); }
      else { location.replace(p+"/"+NewI); }
   },
   GetNo: function(i) {
      if(!oVALIDATE.IsNumeric(i)) return 0;
      i=/\d+/.exec(i); return (i[0])?i[0]:0;
   }, GetPar: function() {
      var p=location.pathname.split("/"), i=p[p.length-1];
      if(!oVALIDATE.IsNumeric(i)) return 0;
      return oGLOBAL.GetNo(i);
   }, UpdateServer: function(p) {
      //Action, DataToSave:{}, callBack:{Success:??,Error:??}, Msg:{Title:??,Success:??,Error:??}
      //DataToSave: Add - {Data[],Fields[],DataTable,Ext}
      //Edit - {id,Data,Fields,DataTable,Ext}
      //Delete - {id,DataTable,Ext}

      //UpdateServer: function(Action, DataToSave, tblToUpdate, callBack, Ext) {
      //Wait.Show(); //Action-Delete,Add,Edit
      //window.setTimeout("Wait.Hide()", 10)
      var url="/Update/"+p.Action;
      ////////////if(typeof p.DataToSave.Ext=='undefined') { DataToSave["Ext"]=(Ext)?Ext:''; } //Ext pagal nutylejima ateina is DataToSave.Ext
      var updData={ "Action": p.Action, "DataToSave": p.DataToSave, "CallBack": p.CallBack, "Msg": p.Msg },
      url=(p.url)?p.url:("/Update/"+p.Action); //Add/Edit.Delete
      CallServer(JSON.stringify(p.DataToSave), this.fnServerUpdated, updData, url, "json");
      ////CallServer(JSON.stringify({ id: id, DataObject: _SD.Config.tblUpdate }), obj.fnResponse_DeleteUser, anSelected, '/'+_SD.Config.Controler+'/Delete', 'json');
   }, fnServerUpdated: function(resp, updData) {  //updData["Action"]
      var t=(updData.Msg.Title)?updData.Msg.Title:"Duomenų keitimas.", Msg;
      if(resp.ErrorMsg) {
         Msg=(updData.Msg.Error)?updData.Msg.Error:"";
         if(!Msg) {
            switch(updData.Action) {
               case "Add": Msg="Nepavyko išsaugot naujų duomenų."; break;
               case "Edit": Msg="Nepavyko pakeisti duomenų."; break;
               case "Delete": Msg="Nepavyko ištrinti duomenų."; break;
               default: alert("Neteisinga updData.Action - "+updData.Action); return false;
            }
         }
         Msg+=" Klaida:\n"+resp.ErrorMsg; if(typeof updData.CallBack.Error==='function') { updData.CallBack.Error(resp); };
         DIALOG.Alert(Msg, t); return false;
      } else {
         Msg=(updData.Msg.Success)?updData.Msg.Success:"";
         if(!Msg) {
            switch(updData.Action) {
               case "Add": Msg="Duomenys sėkmingai pridėti."; break;
               case "Edit": Msg="Duomenys sėkmingai pakeisti."; break;
               case "Delete": Msg="Duomenys ištrinti."; break;
               default: alert("Neteisinga updData.Action - "+updData.Action); return false;
            }
         }
         if(typeof updData.CallBack.Success==='function') { updData.CallBack.Success(resp); }
         else if(typeof updData.CallBack.DeleteRow!=='undefined') {
            var dt=updData.DataToSave, cb=updData.CallBack;
            oDATA.Get(dt.DataTable).Data.removeRowByID(dt.id);
            cb.oTable.fnDeleteRow(cb.oTable.fnGetPosition(cb.DeleteRow)); //oTable.fnDeleteRow(oTable.fnGetPosition(row));
         };
         $.growlUI(t, Msg); return false;
      }
   }, ValidateCtrlsArr: function(CtrlsArr) {
      $.validity.start();
      for(var i=0; i<CtrlsArr.length; i++) {
         var Validity=CtrlsArr[i].data("ctrl").Validity; //.replace("match(date)", "match('date')").replace("match(integer)", "match('integer')").replace("match(number)", "match('number')");
         eval("CtrlsArr[i]."+Validity);
      }
      var r=$.validity.end();
      return r;
   }, ValidateForm: function(frm, DataToSaveAppend) { //Formos lauku validacija (pagal data-ctrl duomenis)
      var c=frm.data("ctrl"), id=c.id, NewRec=parseInt(c.NewRec, 10), DataTable=(c.Source)?(c.Source):"";
      if(!id&!NewRec) { alert("Nėra nurodyta id formos data(ctrl)!"); }
      $.validity.setup({ outputMode: "modal" });
      $.validity.start();
      //$.each($(".c input, .c select, .c textarea"), function (i, v) {
      var DataToSave={ Data: [], Fields: [], DataTable: DataTable };
      //console.log("id:"+id+", NewRec:"+NewRec);
      //console.log("UI REIKŠMĖ:"+$(".ui-autocomplete-input").data("newval"));
      $.each(frm.find(".UpdateField"), function(i, v) {
         console.log("-----------------------------------------------------------------------------------");
         var e=$(v); var elDesc=e[0].tagName+", id-"+e.attr("id")+", class-"+e.attr("class"), Value, cTip=(e.data("ctrl").Tip)?e.data("ctrl").Tip:"";

         if(e.data("ctrl")===undefined) { console.log("Nerasta data(ctrl),el: "+elDesc); return true; }
         //if(!e.hasClass("UpdateField")) { console.log("Be .UpdateField,el: "+elDesc); return true; }

         //Jei nereikalingas ir neuzpildytas, tai nepildom
         //if(typeof e.data("ctrl").Validity!=="undefined") {//jei yra data(ctrl) patikrinam, jei nereikalaujamas ir nieko neivesta neimam sito iraso
         //   if(e.data("ctrl").Validity.search("require()")<0) { if(e.val()===""||e.val()==cTip) return true; }       //Nereikalaujamas
         //}

         //.Value===undefined&&!NewRec) { console.log("Nėra data(ctrl).Value,el: "+elDesc); return true; }
         console.log("OK,el: "+elDesc);

         var FName=e.data("ctrl").Field, OldVal=(NewRec)?'':e.data("ctrl").Value, val='';
         if(e.attr("type")==="checkbox") { val=e.attr("checked"); }

         else if(e.is("select")) { e.greaterThan(-1, "Reikalinga parinkti reikšmę iš sarašo.."); val=e.val(); }  //#{field}
         else if(typeof e.data("ctrl").ListType!=="undefined") {
            if(e.data("newval")) { val=e.data("newval"); } //console.log("ui, val:"+(val)?"":val);
            else { e.val(""); e.require("Reikalinga parinkti reikšmę iš sarašo.."); }
         }
         //         else if(e.hasClass("ui-autocomplete-input")) {
         //            //console.log("UI newval viduj"+e.data("newval"));
         //            if(e.data("newval")) { val=e.data("newval"); } //console.log("ui, val:"+(val)?"":val);
         //            else if(e.data("ctrl").Value) { val=e.data("ctrl").Value; }
         //            else { e.val(""); e.require("Reikalinga parinkti reikšmę iš sarašo.."); }
         //         }
         else {
            val=e.val();
            console.log("Kitkas, val:"+val);
         }
         var Save=(OldVal!=val||NewRec==1)?true:false; //=! nes e.val() grazina stringa Nr!=e.val() patenkins tik jai is tikro skirsis
         if(e.attr("type")!="checkbox"&&!e.is("select")) {//situ nereikia validuot
            if(e.hasClass("ui-autocomplete-input")) { e.require(); }
            else if(e.data("ctrl").Validity&&Save) {
               var Validity=e.data("ctrl").Validity;
               var Type=((e.data("ctrl").Type==undefined)?"?":e.data("ctrl").Type);

               if(cTip) { if(cTip===val&&Type!=="date") e.val(""); } //Isvalom tipus jei yra (isskyrus datos)
               //console.log("Type:"+Type);
               if(Type=="decimal") { e.val(e.val().replace(/,/g, ".")); }
               if(Type=="date") { Validity=(Validity.replace(/match\(date\)/g, "match('date')")); }
               Validity=(Validity.replace(/match\(number\)/g, "match('number')"));
               Validity=(Validity.replace(/match\(integer\)/g, "match('integer')"));
               //console.log("Validity: "+e.data("ctrl").Validity);
               eval("e."+Validity);
            }
         }
         //if(Save&&DataToSave.Fields.findIndexByVal("LongNote")==="") {
         //   if(Type=="date") { val=fnGetDateTime(val); } //keiciam 2011-01-27 / 06:22 i data
         //   DataToSave.Data.push(val); DataToSave.Fields.push(FName);  //Add to DataToSave

         if(Save) {
            if(Type==="date") { val=fnGetDateTime(val); } //keiciam 2011-01-27 / 06:22 i data
            DataToSave.Data.push(val); DataToSave.Fields.push(FName);  //Add to DataToSave
         }

         console.log("Element rez: val-"+val+", OldVal-"+OldVal+", Type-"+Type+", Save-"+Save);
         console.log("-----------------------------------------------------------------------------------");
      });
      //[{ Fields: "AccidentID", Data: $('#tblClaims').data('ctrl').AccidentID }]
      //Pridedam papildomus parametrus kuriuos siunciam servui

      if(typeof (DataToSaveAppend)!='undefined') { for(var i=0; i<DataToSaveAppend.length; i++) { DataToSave.Data.push(DataToSaveAppend[i].Data); DataToSave.Fields.push(DataToSaveAppend[i].Fields) } }

      console.log("Data:"+DataToSave.Data.join(", "));
      console.log("Fields:"+DataToSave.Fields.join(", "));

      var ValRes=$.validity.end();
      if(ValRes.valid) { if(!NewRec) { DataToSave["id"]=id; }; return DataToSave; }
      else return false;
   }, SetTips: function() {//Priminimu sudejimas i laukus
      //Pirmiausiai reikia sudet klases ir data-ctrl
      $('.ui-autocomplete-input, select').each(function(index) {
         var ui=$(this), lbl; if(ui.is("select")) lbl=ui.prev(); else lbl=ui.prev().prev();
         ui.addClass("defaultText"); if(oGLOBAL.FormData.NewRec) { ui.addClass("defaultTextActive"); }
         if(lbl.attr("data-ctrl")) { ui.attr("data-ctrl", lbl.attr('data-ctrl')); }
      });
      $(".defaultText").focus(function(srcc) {
         var t=$(this); if(t.data("ctrl")===undefined) return;
         if(t.val()==t.data("ctrl").Tip) { t.val(""); } t.removeClass("defaultTextActive");
      });
      $(".defaultText").blur(function() {
         console.log(".defaultText blur id:"+$(this).attr("id"));
         var t=$(this); if(t.data("ctrl")===undefined) return;
         if(t.hasClass("date")) { if($("#ui-datepicker-div").is(':visible')) t.val(t.data("ctrl").Tip); return; }
         if(t.val()=="") { t.addClass("defaultTextActive"); t.val(t.data("ctrl").Tip); console.log("add tip:"+t.data("ctrl").Tip); }
      });
      $("select").focus(function() { if($(this).hasClass("defaultTextActive")) { $(this).removeClass("defaultTextActive"); } });
      $("select").blur(function() { if($(this).val()==0) { $(this).addClass("defaultTextActive"); } });
      $(".defaultText").blur(); //Priminimu sudejimas
   }, Validate: {
      IsNumeric: function(val) {
         var re=/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
         if(re.test(val)) return true; return false;
      }
   }
};
var oVALIDATE={
   IsNumeric: function(val) {
      var re=/(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;
      if(re.test(val)) return true; return false;
   },
   IsYear: function(val) { }
};

function exec_GetTableHTML(DataObject) {
   var Cols=getCols(DataObject.Head.length, DataObject.Config.NotVisibleCol);
   return "<table id='DataGrid'  class='display'>"+GetHead(DataObject.Head, Cols)+GetBody(DataObject.Data, Cols)+"</table>"
   function GetHead(HeadData, Cols) {
      var HeadHTML="";
      for(var i=0; i<Cols.length; i++) {
         HeadHTML+="<th>"+HeadData[Cols[i]]+"</th>";
      }
      return "<thead><tr>"+HeadHTML+"</tr></thead>";
   }
   function GetBody(BodyData, Cols) {
      var BodyHTML="";
      //for(var row=0; row<BodyData.length; row++) { BodyHTML+="<tr id='r"+row+"'>"+GetObjectRow(BodyData[row], Cols)+"</tr>"; }
      for(var row=0; row<BodyData.length; row++) { BodyHTML+="<tr>"+GetObjectRow(BodyData[row], Cols)+"</tr>"; }
      return "<tbody>"+BodyHTML+"</tbody>";
   }
   function GetObjectRow(RowData, Cols) {
      var RowHTML="";
      for(var i=0; i<Cols.length; i++) { RowHTML+="<td>"+RowData[Cols[i]]+"</td>"; }
      return RowHTML;
   }
   function getCols(MaxCol, NotVisibleCols) {
      var Cols=[];
      for(var col=0; col<MaxCol; col++) {
         if($.inArray(col, NotVisibleCols)=== -1) Cols[Cols.length]=col; //Grazina indeksa, jei neranda -1
      }
      return Cols;
   }
}
//------------------------UL List Filling Functions--------------------------------------------------------------------------------------------------
function exec_GetULListHTML(Arr) {
   var HTML="";
   for(var divisions=0; divisions<Arr.length; divisions++) {
      if(Arr[divisions][1].length==0) {//Nera itemsu(papunkciu)
         HTML+="<li class=\"lact\" id=\"limnu_"+divisions+"\"><a href=\"#\" onclick=\"MenuClick('"+Arr[divisions][0]+"',0,'limnu_"+divisions+"');return false;\">"+Arr[divisions][0]+"</a></li>";
      } else {
         HTML+="<li class=\"ltitle\"><a>"+Arr[divisions][0]+"</a>";
         HTML+="<ul>"+FillItems(Arr[divisions][0], Arr[divisions][1])+"</ul></li>";
      }
   }
   function FillItems(divname, items) {
      var RowHTML="";
      for(var row=0; row<items.length; row++) {
         //RowHTML+="<li class=\"lact\" id=\"limnu_"+divname+items[row][0]+"\"><a href=\"#\" onclick=\"MenuClick('"+divname+"',"+items[row][0]+",'limnu_"+divname+items[row][0]+"');return false;\">"+items[row][1]+"</a></li>";
         RowHTML+="<li class=\"lact\" id=\"limnu_"+divname+items[row][0]+"\"><a href=\"#\" onclick=\"MenuClick('"+divname+"',"+items[row][0]+",this.id);return false;\">"+items[row][1]+"</a></li>";
      }
      return RowHTML;
   }
   return "<ul>"+HTML+"</ul>";
}
//function exec_GetOptionListHTML(Arr, ListBoxid, ValI, ArrTextI, SelectedID, ReplaceArr) {
function exec_GetOptionListHTML(p) {
   ///<summary>Gets option list HTML</summary>
   ///<param name="p">{Arr:'Array to get options from',ListBoxid:'id of listbox to set', ValI:'index in array to get value for listbox',
   /// ArrTextI:'arry of indexes to show in listbox text', SelectedID:'id to be selected',
   /// ReplaceArr:'[{Ix:??,txtIx:??,obj:??}] - pakeicia idus tekstais(Ix-kuri i pakeisti, txtIx-kur obj sedi tekstas, obj-duomenu objektas)'}
   ///</param>
   var HTML="<select id='"+p.id+"'>";
   for(var i=0; i<p.Arr.length; i++) {
      var Text=[];
      for(var I=0; I<p.TextI.length; I++) { Text.push(p.Arr[i][p.TextI[I]]); }
      //-----------------id lauku pakeitimas-----------pradzia---------------------------------
      if(typeof (p.ReplaceArr)!='undefined') {
         for(var iobj=0; iobj<p.ReplaceArr.length; iobj++) {//begam per objektus
            var obj=p.ReplaceArr[iobj].obj.Data, Ix=p.ReplaceArr[iobj].Ix, txtIx=p.ReplaceArr[iobj].txtIx;
            for(var ix=0; ix<obj.length; ix++) {
               if(Text[Ix]===obj[ix][0]) {
                  Text[Ix]=obj[ix][txtIx]; break;
               }
            } //begam per obj ir kai surandam i pakeiciam i tekstu
         }
      }
      //-----------------id lauku pakeitimas------------pabaiga---------------------------------
      Text=Text.join(", ");
      if(p.SelectedID) { HTML+="<option value='"+p.Arr[i][p.ValI]+((+p.Arr[i][0]==p.SelectedID)?"' selected='selected'":"'")+">"+Text+"</option>"; }
      else { HTML+="<option value='"+p.Arr[i][p.ValI]+"'>"+Text+"</option>"; }
   }
   return HTML+"</select>";
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------
//var data = [2, 4, 6, 8];
//alert($.inArray(4, data)) // output 1 as expected
//alert($.inArray("4", data)) // output -1 as expected

//var arr = [4, "Pete", 8, "John"];
//"John" found at 3
//4 found at 0
//"David" found at -1