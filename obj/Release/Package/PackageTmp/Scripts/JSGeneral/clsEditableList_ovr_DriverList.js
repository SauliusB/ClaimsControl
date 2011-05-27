/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
/// <reference path="../JSMain/json2.js" />
/// <reference path="clsGrid.js" />
/// <reference path="General.js" />
/// <reference path="objFunc.js" />

function LoadDriverList() {
   function EditableDriverList(ListTitle, clsOBJByName, GridOpt) {
      clsEditableList.call(this, ListTitle, clsOBJByName, GridOpt); // ListTitle, clsOBJByName, GridOpt
      //cia rasom naujas funkcijas
   }
   EditableDriverList.prototype=new clsEditableList();
   EditableDriverList.prototype.constructor=clsEditableList;
   EditableDriverList.prototype.LoadEditableForm=function (LoadTitle, Action) {
      var t=clsEditableList.prototype.Obj;
      var html='<form id="dialog-form-validate-editable">';
      html+='<fieldset class="ui-corner-all"><legend>'+LoadTitle+'</legend>';
      var dlgEditableOpt=t.GetEditableOpt(Action);
      html+=t.GenerateHTML(t.clsOBJByName.SD, Action);
      var txtStart="<BR><div id='divWorkingDriver' data-ctrl="; //class='small'>
      if(RowData[4]=="*") html+=txtStart+"'working' "+oCONTROLS.lbla_inline("aWD_dialog", "Jei darbuotojas jau nebedirba spauskite ", "čia", "working")+"</div>";
      else html+=txtStart+"'notworking' "+oCONTROLS.lbla_inline("aWD_dialog", "Jei darbuotojas jau dirba spauskite ", "čia", "notworking")+"</div>";
      html+='</fieldset>';
      html+='</form>';
      $('<div></div>').html(html).dialog(dlgEditableOpt).dialog('open'); //LoadFormAccidentsScript();
      t.AddFieldControls(t.clsOBJByName.SD.Cols);
      return false;
   }
   EditableDriverList.prototype.Show=function () {
      var html='<form id="dialog-form-validate-list">';
      html+='<fieldset class="ui-corner-all"><legend>'+this.ListTitle+'</legend>';
      html+='<div id="DrvListMainTab">'; //  style="visibility:hidden"
      html+='<ul><li><a href="#tabs-1">Dirbantys</a></li><li><a href="#tabs-2">Nedirbantys</a></li></ul>';
      html+='<div id="tabs-1"></div>';
      html+='<div id="tabs-2"></div><div id="divEditableGrid"></div>';
      html+='</div></fieldset>';
      html+='</form>';
      var Config=this.clsOBJByName.SD.Config, clsObj=this.clsOBJByName, eForm=this.LoadEditableForm, fnSUpd=this.fnServerUpdated;
      var dlgOpt={
         autoOpen: false, minWidth: 465, minHeight: 400, width: 'auto', modal: true, title: this.ListTitle,  //$(document).width()*0.6   width: auto, 
         buttons: {
            "Pridėti naują": function () { eForm(Config.Msg.AddNew, "Add"); },
            "Ištrinti pasirinktą": function () {
               DIALOG.Confirm("Ar tikrai norite ištrinti pasirinktą eilutę?", "Įrašo panaikinimas", function () { oGLOBAL.UpdateServer("Delete", { id: RowData[0] }, Config.tblUpdate, fnSUpd); });
            },
            "Redaguoti pasirinktą": function () {
               eForm(Config.Msg.Edit, "Edit");
               $("#aWD_dialog a").click(function () {
                  var t=$(this), div=$("#divWorkingDriver"), _DataToSave={ Data: [null], Fields: ["DateEnd"] }; _DataToSave["id"]=RowData[0]; //Data:1 atveju data isirasis is inputo, 2 null yra ok
                  var DrvWorking=(div.data("ctrl")=='working')?true:false;
                  var CallBack=function (resp, updData) {
                     div.unblock(); if(resp.ErrorMsg!="") div.html("<span class='smallErr'>Nepavyko išsaugoti, klaida:"+resp.ErrorMsg+"</span>");
                     else {
                        div.html("<span class='smallOK'>"+((div.data("ctrl")=='working')?"Vairuotojas perkeltas prie nedirbančių..":"Vairuotojas perkeltas prie dirbančių..")+"</span>");
                        if(_DataToSave.Data[0]==null) _DataToSave.Data[0]='*'; //*-nes proc taip atiduodam nes gridas nefiltruoja pagal null
                        //RowData.splice(4, 1, updData[0]); //replacinu sena EndDate i nauja
                        clsEditableList.prototype.Obj.Obj.clsOBJByName.ChangeSelRow(_DataToSave, false, "$(oTable.fnGetNodes(aPos)).removeClass('row_selected');"); //istrinam row_selected, kad kitiems netrukdytu// oTable.fnFilter('"+((DrvWorking)?"*":"-")+"', 4, false, false, false);
                     }
                  }
                  if(DrvWorking) {
                     //d={ctrl:??,lblTitle:??,txt:{Title:??,Value:??}, btnTitle:??,Data:{tblToUpdate:??,Validity:??},DataToSave:{Data:[??],Fields:[?],id:??},fnCallBack:??,fnPostInit:?? }

                     var d={ ctrl: div, lblTitle: "Nebedirba nuo:", txt: { Title: "Darbuotojo darbo pabaigos data", Value: fnGetTodayDateString() }, btnTitle: "Patvirtinti",
                        Data: { tblToUpdate: Config.tblUpdate, Validity: "require().match(date)" }, DataToSave: _DataToSave,
                        fnPostInit: function () { $('#divWorkingDriver input').datepicker(); }, fnCallBack: CallBack
                     }
                     oCONTROLS.Set_Updatable_HTML.lbltxt_inline_btnConfirm(d);
                  } else {
                     oGLOBAL.UpdateServer("Edit", _DataToSave, Config.tblUpdate, CallBack, "");
                     div.block("Siunčiami duomenys.."); return false;
                  }

               });
            },
            "Išeiti": function () { clsObj.DestroyGrid(); $(this).dialog("close"); }
         },
         close: function () {
            //if(DIALOG.result===1) { setTimeout("DIALOG.CallBack();"); }
            $(this).remove(); $(".validity-modal-msg").remove();
         }
      }
      this.clsOBJByName.Register_RowClickCallBack(this.RowClicked);
      //this.clsOBJByName.RenderGrid(this.GridOpt, null);

      //IsLessOrNull
      //var MyOpt={ Filter: { ColName: 'DateEnd', ColValue: '', Expr: 'IsEqual' }, Dom: { gHead: "Dirbantys", GridID: "EditableGrid", DivID: "divEditableGrid"} };
      //var MyOpt={ Dom: { GridID: "EditableGrid", DivID: "divEditableGrid"} };
      this.clsOBJByName.RenderGrid({ Dom: { gHead: "", GridID: "EditableGrid", DivID: "divEditableGrid" }, RENDER_OPT: { fnAfterInit: "oTable.fnFilter('*', 4, false, false, false);"} }, null)

      var dlg=$('<div></div>').html(html).dialog(dlgOpt).dialog('open');
      var Grid=this.clsOBJByName; //Grid.oTable().fnFilter('*', 4);

      $("#DrvListMainTab").tabs({
         select: function (event, ui) {
            $('#divEditableGrid tbody tr').removeClass('row_selected'); //reikalinga, kad pakeitus lentele priverst klickint useri ir atsirastu naujas RowData
            if(ui.index==0) { Grid.oTable().fnFilter("*", 4, false, false, false); }
            else { Grid.oTable().fnFilter("-", 4, false, false, false); }
         }
      });
      this.Init(dlg);
      return false;
   }
   var drv=new EditableDriverList("Vairuotojų sąrašas", oDATA.Get("tblDrivers"));
   drv.Show();
   $('#dialog-form-validate-list').find(".dataTables_info").hide();
   $('#DrvListMainTab').tabs().css('visibility', 'visible');

}

///-------------------------------------------------------------------------------------------------------------------------
///-------------------------------------------------------------------------------------------------------------------------
///-------------------------------------------------------------------------------------------------------------------------
function Pet(name) {
   this.getName=function () { return name+"opa"; };
   this.setName=function (newName) { name=newName; };
   this.Name=function (name) { alert("Petas "+this.getName()); }; ;
}

Pet.prototype.toString=function () {
   return "This pet’s name is: "+this.getName();
};
Pet.prototype.alert=function () {
   alert("Vardas"+this.getName());
};
//-----------------------------------------------------------
// class Dog : Pet 
// public Dog(string name, string breed)
function Dog(name, breed) {
   // think Dog : base(name) 
   Pet.call(this, name);
   this.getBreed=function () { return breed; };
   // Breed doesn’t change, obviously! It’s read only.
   // this.setBreed = function(newBreed) { name = newName; };
}
// this makes Dog.prototype inherits
// from Pet.prototype
Dog.prototype=new Pet();
// remember that Pet.prototype.constructor
// points to Pet. We want our Dog instances’
// constructor to point to Dog.
Dog.prototype.constructor=Dog;

// Now we override Pet.prototype.toString
Dog.prototype.toString=function () {
   return "This dog’s name is: "+this.getName()+
        ", and its breed is: "+this.getBreed();
};
Dog.prototype.alert=function () {
   alert("Čia sobaka: "+this.getName()+
        ", o jo veisle: "+this.getBreed());
};
Dog.prototype.Name=function () {  //neoverraidina this.Name
   alert("Dogas "+name);
};
function LoadDriverList1() {
   //   var parrotty=new Pet("Parrotty the Parrot");
   //   alert(parrotty);
   //   parrotty.alert();
   var dg=new Dog("Šarikas", "Dvarneska");
   dg.Name();  //Neoverraidinasi, kai neprototypas
   alert(dg);
   dg.alert();
}