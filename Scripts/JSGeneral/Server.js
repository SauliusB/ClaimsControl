/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
/// <reference path="../JSMain/json2.js" />

function CallServer(JSONarg, CallFunc, ActionPar, url, dataType) {
   ///<summary>Sends data to server (JSONarg), and call function CallFunc(Response,ActionPar)</summary>
   ///<param name="JSONarg">Json. To parse from javascript - JSON.stringify(jsObject)</param>
   ///<param name="CallFunc">Function to call. Example SetnewMenuData</param>
   ///<param name="ActionPar">example 'Darbuotojai'</param>
   ///<param name="url">example '/[Controler]Tab/GetTab[Action]'</param>
   ///<param name="dataType">JSONarg datatype 'json'|'html'|'texc'</param>
   ///<returns type="calls_CallFunc(Response,ActionPar)"/>

   //$('#ImgWaiting').show('slow');
   //alert(JSONarg + " " + Action + " " + url);
   //if(Wait) { Wait.Show(); }
   if(!dataType) { dataType=='json'; }
   if(typeof ActionPar.Ctrl!=='undefined') {
      if($('#'+ActionPar.Ctrl).length&&$('#'+ActionPar.Ctrl).html().length===0) {
         var e=$('#'+ActionPar.Ctrl), h=e.height(); e.html("<center><img style='margin-top:"+h/2.2+"px;' src='/Content/images/ajax-loader.gif' alt='' /></center>");
      }
   }
   $.ajax({
      type: "POST",
      url: url,
      beforeSend: function(xhr) { xhr.setRequestHeader("Content-type", "application/json; charset=utf-8"); },
      data: JSONarg,
      contentType: "application/json; charset=utf-8",
      dataType: dataType,
      erorr: function(msg) {
         //Wait.Hide();
         //if (msg.d ==="Er_Saving") //{ alert("Nepavyko išsaugoti duomenų. \n Bandykite dar kartą.."); } //return else
         { alert("Nepavyko prisijungti.."); }
      },
      success: function(d) {
         //Wait.Hide();
         //try { var d = JSON.parse(d.Message); } catch (e) { ; }
         CallFunc(d, ActionPar);
      }
   });
};

function CallServer1(JSONarg, Action) {
   //$('#ImgWaiting').show('slow');
   $.ajax({
      type: "POST",
      url: "TrackVehicle3.aspx/CallServer",
      beforeSend: function(xhr) { xhr.setRequestHeader("Content-type", "application/json; charset=utf-8"); },
      data: JSONarg,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      erorr: function(msg) {
         $('#ImgWaiting').hide('slow');
         if(msg.d=="Er_Saving") { alert("Nepavyko išsaugoti duomenų. \n Bandykite dar kartą.."); } //return
         else { alert(msg.d); }
      },
      success: function(msg) {
         $('#lblInfo').text('Duomenys gauti..').show();
         $('#ImgWaiting').hide('slow');
         if(Action=="GetNewMap_Routes") {
            if(msg.d=="") { CallServer(JSONarg, Action); }
            else if(msg.d=="'Empty'") { $('#lblInfo').text('Nerasta duomenų..').show('slow'); }
            else { GetNewMap_Routes(eval('('+msg.d+')')); }
         }
         if(Action=="GetNewMap_Pages_Routes") {
            if(msg.d=="") { CallServer(JSONarg, Action); }
            else if(msg.d=="'Empty'") { $('#lblInfo').text('Nerasta duomenų..').show('slow'); }
            else { GetNewMap_Pages_Routes(eval('('+msg.d+')')); }
         }
         else if(Action=="GetTable") {
            if(msg.d=="") { CallServer(JSONarg, Action); }
            else if(msg.d!="'Empty'") {
               { TableArr=eval(msg.d); FillTable(TableArr); }
            }
         }
      }
   });
};