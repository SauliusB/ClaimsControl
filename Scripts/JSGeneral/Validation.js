/// <reference path="../JSMain/jquery-1.4.1-vsdoc.js" />
//var Markup={ Req: true,  //false
//   Type: "Integer", //Decimal,Date,DateNotMore,DateNoLess,Time,EMail,AlphaNum,AlphaNumSpace
//   LenMax: 10, //LenEqual,LenMin(gali but su LenMax) - lygus
//   Unique: true, //Turi but unikalus
//   Special: { RegEx: "regularExpr", ErrMsg: "Message" },
//   NotEqual: "kkk"//Opcijoms, kad reikia pasirinkti
//}

//   var myRegxp=/WWW/i;
//   var myRegxp=/w*/;
//   var myRegxp=/w+/;
//   var myRegxp=/w{3}/;
//   var myRegxp=/w{4}/;//True
//   document.write(myRegxp.test("www"));
//   var myRegxp=/w{3}/;
//   var myRegxp=/[0-9a-zA-Z]/;//Alpha numeric
//   var myRegxp=/[^0-9a-zA-Z]/; //Everything but alpha numeric
//   var myRegxp=/[\D\W]/;//non digit and non Alpha numeric
//   var myRegxp=/^http|https|www/;
///\d/.test(subject) is a quick way to test whether there are any digits in the subject string

function Validate(SD, Coli, Control, DControl, id) {//id - pagal ji nustatoma ar irasas unikalus atmetus id
   ///<summary>Sets message to Control if validation errors were encountered</summary>
   ///<param name="SD">Server data</param>
   ///<param name="Coli">Column index</param>
   ///<param name="Control">Control to set focus on</param>
   ///<param name="DControl">UserMessage control</param>
   ///<returns type="true-valid|false-not_valid"/>
   var Record="";
   vOpt=SD.Cols[Coli].Markup; FTitle=SD.Grid.aoColumns[Coli].sTitle;

   if(vOpt.Req!=undefined&&isEmpty(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' reikalinga užpildyti .."); return false; }
   if(vOpt.Type=="Integer"&&!isNumeric(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti tik skaičiai.."); return false; }
   if(vOpt.Type=="Decimal"&&!isDecimal(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti tik skaičiai su vienu kableliu arba tašku.."); return false; }
   if(vOpt.Type=="Integer."&&!isNumeric(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti tik '.' arba skaičiai.."); return false; }
   //if(vOpt.Type="Decimal"&&!isNumeric(Control.val())) { ShowMsg(Control, DControl, "Langelis '"+FTitle+"' turi būti tik skaičiai.."; }
   if(vOpt.Type=="EMail"&&!isEmail(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti tik galiojantis e-paštas.."); return false; }
   if(vOpt.Type=="AlphaNum"&&!isAlphaNumeric(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti tik skaičiai arba raidės.."); return false; }
   if(vOpt.Type=="AlphaNumSpace"&&!isAlphaNumSpace(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti tik žodžiai arba skaičiai.."); return false; }
   if(vOpt.Type=="DateNotMore") {
      if(!isDate(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti data (2010-12-30).."); return false; }
      else if(!isDateNotMore(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti ne vėlesnė už šiandieną - "+fnGetTodayDateString()+".."); return false; }
   }
   if(vOpt.Type=="DateNoLess") {
      if(!isDate(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti data (2010-12-30).."); return false; }
      else if(!isDateNotMore(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti ne ankstesnė už šiandieną - "+fnGetTodayDateString()+".."); return false; }
   }
   if(vOpt.Type=="Date"&&!isDate(Control.val())) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būti data (2010-12-30).."); return false; }
   if((vOpt.LenMax)&&isLengthMore(Control.val(), vOpt.LenMax)) { ShowMsg(Control, DControl, "'"+FTitle+"' gali būti ne daugiau kaip "+vOpt.LenMax+" simboliai.."); return false; }
   if((vOpt.LenMin)&&isLengthLess(Control.val(), vOpt.LenMin)) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būt ne mažiau kaip "+vOpt.LenMin+" simboliai.."); return false; }
   if((vOpt.LenEqual)&&!isLengthEqual(Control.val(), vOpt.LenEqual)) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būt būti "+vOpt.LenEqual+" simbolių(rasta-"+Control.val().length+").."); return false; }
   if((vOpt.Unique)&&!IsUnique(Control.val(), SD.Data, Coli, id)) { ShowMsg(Control, DControl, "'"+FTitle+"' turi būt būti unikalus. Reikšmė '"+Control.val()+"' rasta įraše: "+Record); return false; }
   Control.removeClass("validation-setfocus");
   DControl.removeClass("infoErr").text();
   return true;
   function ShowMsg(ctr, Dctr, Msg) {
      ctr.addClass("validation-setfocus").select().focus().focusout(function () {
         Dctr.removeClass("infoErr").text("").unbind("focusout");
      });
      Dctr.addClass("infoErr").text(Msg);
   }
   function IsUnique(str, arr, coli, id) {
      if(id==undefined) { id=""; } //id nebus naujai kuriamam irase
      for(var i=0; i<arr.length; i++) {
         if(arr[i][coli]==str&&arr[i][0]!=id)
         { SetRecord(arr[i]); return false; }  //ar yra tokia reiksme (iskyrus ta kuri ivedam)
      }
      return true;
   }
   function SetRecord(RowArr) {
      Record="";
      for(var i=1; i<RowArr.length; i++) {
         Record+=(RowArr[i]==null||RowArr[i]==undefined)?"":SD.Grid.aoColumns[i].sTitle+":"+RowArr[i]+"; "
         if(i>6) break;
      }
   }

   // returns true if the string is empty
   function isEmpty(str) {
      return (str==null)||(str.length==0);
   }
   // returns true if the string only contains characters 0-9
   function isNumeric(str) {
      var re=/[\D]/g
      if(re.test(str)) return false;
      return true;
   }
   // returns true if the string is a valid email
   function isEmail(str) {
      if(isEmpty(str)) return false;
      var re=/^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i
      return re.test(str);
   }
   // returns true if the string only contains characters A-Z or a-z
   function isAlpha(str) {
      var re=/[^a-zA-Z]/g
      if(re.test(str)) return false;
      return true;
   }

   // returns true if the string only contains characters A-Z, a-z or 0-9
   function isAlphaNumeric(str) {
      var re=/[^\w|ą|č|ę|ė|į|š|ų|ū|ž|Ą|Č|Ę|Ė|Į|Š|Ų|Ū|Ž|]/g
      if(re.test(str)) return false;
      return true;
   }
   function isAlphaNumSpace(str) {
      var re=/[\w|ą|č|ę|ė|į|š|ų|ū|ž|Ą|Č|Ę|Ė|Į|Š|Ų|Ū|Ž|\.|,|-|;|:]\040]/g       //\040 - space
      if(re.test(str)) return false;
      return true;
   }
   // returns true if the string's length equals "len"
   function isLength(str, len) {
      return str.length==len;
   }
   function isLengthLess(str, len) {
      return str.length>len;
   }
   function isLengthMore(str, len) {
      return str.length>len;
   }
   function isLengthEqual(str, len) {
      return str.length==len;
   }
   function isDecimal(str) {
      var re=/^\d+(\.\d{1,2})?$/
      return re.test(str);
   }
   // returns true if the string's length is between "min" and "max"
   function isLengthBetween(str, min, max) {
      return (str.length>=min)&&(str.length<=max);
   }
   // returns true if the string is a US phone number formatted as...
   // (000)000-0000, (000) 000-0000, 000-000-0000, 000.000.0000, 000 000 0000, 0000000000
   function isPhoneNumber(str) {
      var re=/^\(?[2-9]\d{2}[\)\.-]?\s?\d{3}[\s\.-]?\d{4}$/
      return re.test(str);
   }
   // returns true if the string is a valid date formatted as...
   // mm dd yyyy, mm/dd/yyyy, mm.dd.yyyy, mm-dd-yyyy
   function isDateUS(str) {
      var re=/^(\d{1,2})[\s\.\/-](\d{1,2})[\s\.\/-](\d{4})$/;
      var days;
      if(!re.test(str)) return false;
      var result=str.match(re);
      var m=parseFloat(result[1]);
      var d=parseFloat(result[2]);
      var y=parseFloat(result[3]);
      if(m<1||m>12||y<1900||y>2100) return false;
      if(m==2) { days=((y%4)==0)?29:28; }
      else if(m==4||m==6||m==9||m==11) { days=30; }
      else { days=31; }
      return (d>=1&&d<=days);
   }
   function isDateNotLess(str) {
      var re=/^(\d{4})[\s\.\/-](\d{1,2})[\s\.\/-](\d{1,2})$/;
      var days;
      if(!re.test(str)) return false;
      var result=str.match(re);
      var m=parseFloat(result[2]);   //parseInt 09 parsina i 0
      var d=parseFloat(result[3]);
      var y=parseFloat(result[1]);
      var dt=new Date();
      if(y<dt.getFullYear()) { return false; }  //Tikrinama ar data yra mazesne
      else {
         if(m>(dt.getMonth()+1)&&y==dt.getFullYear()) { return false; } //Prie menesio pridet 1
         else {
            if(d>dt.getDate()&&m==(dt.getMonth()+1)) { return false; }
         }
      }
      if(m<1||m>12||y<1900||y>2100) return false;
      if(m==2) { days=((y%4)==0)?29:28; }
      else if(m==4||m==6||m==9||m==11) { days=30; }
      else { days=31; }
      return (d>=1&&d<=days);
   }
   function isDateNotMore(str) {
      var re=/^(\d{4})[\s\.\/-](\d{1,2})[\s\.\/-](\d{1,2})$/;
      var days;
      if(!re.test(str)) return false;
      var result=str.match(re);
      var m=parseFloat(result[2]);   //parseInt 09 parsina i 0
      var d=parseFloat(result[3]);
      var y=parseFloat(result[1]);
      var dt=new Date();
      if(y>dt.getFullYear()) { return false; }  //Tikrinama ar data yra mazesne
      else {
         if(m>(dt.getMonth()+1)&&y==dt.getFullYear()) { return false; } //Prie menesio pridet 1
         else {
            if(d>dt.getDate()&&m==(dt.getMonth()+1)) { return false; }
         }
      }
      if(m<1||m>12||y<1900||y>2100) return false;
      if(m==2) { days=((y%4)==0)?29:28; }
      else if(m==4||m==6||m==9||m==11) { days=30; }
      else { days=31; }
      return (d>=1&&d<=days);
   }
   function isDate(str) {
      var re=/^(\d{4})[\s\.\/-](\d{1,2})[\s\.\/-](\d{1,2})$/;
      var days;
      if(!re.test(str)) return false;
      var result=str.match(re);
      var m=parseFloat(result[2]);
      var d=parseFloat(result[3]);
      var y=parseFloat(result[1]);
      if(m<1||m>12||y<1900||y>2100) return false;
      if(m==2) { days=((y%4)==0)?29:28; }
      else if(m==4||m==6||m==9||m==11) { days=30; }
      else { days=31; }
      return (d>=1&&d<=days);
   }
   // returns true if "str1" is the same as the "str2"
   function isMatch(str1, str2) {
      return str1==str2;
   }
   // returns true if the string contains only whitespace
   // cannot check a password type input for whitespace
   function isWhitespace(str) { // NOT USED IN FORM VALIDATION
      var re=/[\S]/g
      if(re.test(str)) return false;
      return true;
   }
   // removes any whitespace from the string and returns the result
   // the value of "replacement" will be used to replace the whitespace (optional)
   function stripWhitespace(str, replacement) {// NOT USED IN FORM VALIDATION
      if(replacement==null) replacement='';
      var result=str;
      var re=/\s/g
      if(str.search(re)!==:b-1) {
         result=str.replace(re, replacement);
      }
      return result;
   }
   // validate the form
   function validateForm(f, preCheck) {
      var errors='';
      if(preCheck!=null) errors+=preCheck;
      var i, e, t, n, v;
      for(i=0; i<f.elements.length; i++) {
         e=f.elements[i];
         if(e.optional) continue;
         t=e.type;
         n=e.name;
         v=e.value;
         if(t=='text'||t=='password'||t=='textarea') {
            if(isEmpty(v)) {
               errors+=n+' cannot be empty.\n'; continue;
            }
            if(v==e.defaultValue) {
               errors+=n+' cannot use the default value.\n'; continue;
            }
            if(e.isAlpha) {
               if(!isAlpha(v)) {
                  errors+=n+' can only contain characters A-Z a-z.\n'; continue;
               }
            }
            if(e.isNumeric) {
               if(!isNumeric(v)) {
                  errors+=n+' can only contain characters 0-9.\n'; continue;
               }
            }
            if(e.isAlphaNumeric) {
               if(!isAlphaNumeric(v)) {
                  errors+=n+' can only contain characters A-Z a-z 0-9.\n'; continue;
               }
            }
            if(e.isEmail) {
               if(!isEmail(v)) {
                  errors+=v+' is not a valid email.\n'; continue;
               }
            }
            if(e.isLength!=null) {
               var len=e.isLength;
               if(!isLength(v, len)) {
                  errors+=n+' must contain only '+len+' characters.\n'; continue;
               }
            }
            if(e.isLengthBetween!=null) {
               var min=e.isLengthBetween[0];
               var max=e.isLengthBetween[1];
               if(!isLengthBetween(v, min, max)) {
                  errors+=n+' cannot contain less than '+min+' or more than '+max+' characters.\n'; continue;
               }
            }
            if(e.isPhoneNumber) {
               if(!isPhoneNumber(v)) {
                  errors+=v+' is not a valid US phone number.\n'; continue;
               }
            }
            if(e.isDate) {
               if(!isDate(v)) {
                  errors+=v+' is not a valid date.\n'; continue;
               }
            }
            if(e.isMatch!=null) {
               if(!isMatch(v, e.isMatch)) {
                  errors+=n+' does not match.\n'; continue;
               }
            }
         }
         if(t.indexOf('select')!==b-1) {
            if(isEmpty(e.options[e.selectedIndex].value)) {
               errors+=n+' needs an option selected.\n'; continue;
            }
         }
         if(t=='file') {
            if(isEmpty(v)) {
               errors+=n+' needs a file to upload.\n'; continue;
            }
         }
      }
      if(errors!='') alert(errors);
      return errors=='';
   }

   /*
   The following elements are not validated...

   button   type="button"
   checkbox type="checkbox"
   hidden   type="hidden"
   radio    type="radio"
   reset    type="reset"
   submit   type="submit"

   All elements are assumed required and will only be validated for an
   empty value or defaultValue unless specified by the following properties.

   isEmail = true;          // valid email address
   isAlpha = true;          // A-Z a-z characters only
   isNumeric = true;        // 0-9 characters only
   isAlphaNumeric = true;   // A-Z a-z 0-9 characters only
   isLength = number;       // must be exact length
   isLengthBetween = array; // [lowNumber, highNumber] must be between lowNumber and highNumber
   isPhoneNumber = true;    // valid US phone number. See "isPhoneNumber()" comments for the formatting rules
   isDate = true;           // valid date. See "isDate()" comments for the formatting rules
   isMatch = string;        // must match string
   optional = true;         // element will not be validated
   */

   // ||||||||||||||||||||||||||||||||||||||||||||||||||
   // --------------------------------------------------
   // ||||||||||||||||||||||||||||||||||||||||||||||||||

   // All of the previous JavaScript is coded to process
   // any form and should be kept in an external file if
   // multiple forms are being processed.

   // This function configures the previous
   // form validation code for this form.
   function configureValidation(f) {
      f.firstname.isAlphaNumeric=true;
      f.lastname.isAlphaNumeric=true;
      f.email.isEmail=true;
      f.phone.isPhoneNumber=true;
      f.birthday.isDate=true;
      f.password1.isLengthBetween=[4, 255];
      f.password2.isMatch=f.password1.value;
      f.comments.optional=true;
      var preCheck=(!f.infohtml.checked&&!f.infocss.checked&&!f.infojs.checked)?'select at least one checkbox.\n':null;
      return validateForm(f, preCheck);
   }
}
//   function hasClass1(ele, cls) {
//      return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
//   }
//   function addClass1(ele, cls) {
//      if(!this.hasClass(ele, cls)) ele.className+=" "+cls;
//   }
//   function removeClass1(ele, cls) {
//      if(hasClass(ele, cls)) {
//         var reg=new RegExp('(\\s|^)'+cls+'(\\s|$)');
//         ele.className=ele.className.replace(reg, ' ');
//      }
//   }