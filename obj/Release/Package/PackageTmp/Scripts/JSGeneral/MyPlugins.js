(function($) {
   $.fn.extend({
      //pass the options variable to the function
      ValidateOnBlur: function(options) {
         //Set the default values, use comma to separate the settings, example:
         var defaults={
            ValidArray: [],
            Allow: 'Integer', //Decimal Date Time DateCtrl DateNotLessCtrl DateNotMoreCtrl  //Sutampa su nurodymais oDATA.SD.Cols[i].Valid.Type
            Trim: true
         }
         var opt=$.extend(defaults, options);
         //Jei turi but array, jo opcija ValidArray
         //ValidateOnBlur({ Allow: 'Integer' })
         //ValidateOnBlur({ Allow: 'Decimal' })
         return this.each(function() {
            var t=$(this);
            t.blur(function() {
               var inputVal=t.val();
               var re=/^(\s*)([\W\w]*)(\b\s*$)/;
               if(re.test(inputVal)) {
                  inputVal=inputVal.replace(re, '$2');
               } //remove leading and trailing whitespace characters
               if(opt.ValidArray.length) {
                  var idx=jQuery.inArray(inputVal, ValidArray); if(idx=== -1) { t.val(""); return; }
               }
               else if(opt.Allow==='Integer') {
                  re=/\D*(\d+)\D*/; if(re.test(inputVal)) inputVal=inputVal.replace(re, "$1"); else { t.val(""); return; }
               }
               else if(opt.Allow==='Decimal') {
                  inputVal=inputVal.replace(',', '.'); //re=/.*?(([0-9]?\.)?[0-9]+).*/g;
                  re=/\D*(\d\d*\.\d+|\d+)\D*/;
                  if(re.test(inputVal))
                     inputVal=inputVal.replace(re, "$1");
                  else { t.val(""); return; }
               }
               else if(opt.Allow==='Date'||opt.Allow==='DateCtrl'||opt.Allow==='DateNotLessCtrl'||opt.Allow==='DateNotMoreCtrl') {
                  inputVal=inputVal.replace('.', '-').replace('/', '-').replace('\\', '-');
                  re=/\.*((19|20\d{2})-([0]?[1-9]|[1][0-2])-([0-2][1-9]|3[0-1]|\d))+\.*/;
                  if(re.test(inputVal))
                     inputVal=inputVal.replace(re, "$1");
                  if(oVALIDATE.IsNumeric(inputVal)&&opt.Allow==='DateNotMoreCtrl') { if((parseInt(inputVal, 10))>=((new Date()).getFullYear())) { inputVal=((new Date()).getFullYear()); } }
                  if(oVALIDATE.IsNumeric(inputVal)&&opt.Allow==='DateNotLessCtrl') { if((parseInt(inputVal, 10))<=((new Date()).getFullYear())) { inputVal=((new Date()).getFullYear()); } }
                  else { t.val(""); return; }
               }
               else if(opt.Allow==='Year'||opt.Allow==='YearNotMore'||opt.Allow==='YearNotLess') {
                  inputVal=inputVal.replace('.', '-').replace('/', '-').replace('\\', '-');
                  re=/\.*(19|20\d{2})\.*/;
                  if(re.test(inputVal)) inputVal=inputVal.replace(re, "$1");
                  if(oVALIDATE.IsNumeric(inputVal)&&opt.Allow==='YearNotMore') { if((parseInt(inputVal, 10))>=((new Date()).getFullYear())) { inputVal=((new Date()).getFullYear()); } }
                  if(oVALIDATE.IsNumeric(inputVal)&&opt.Allow==='YearNotLess') { if((parseInt(inputVal, 10))<=((new Date()).getFullYear())) { inputVal=((new Date()).getFullYear()); } }
                  else { t.val(""); return; }
               }
               // \.*(19|20\d{2})\.*
               //\.*((19|20\d{2})[./-]([0]?[1-9]|[1][0-2])[./-]([0-2][1-9]|3[0-1]|\d))+\.*
               t.val(inputVal);
            });
         });
      }
   });
})(jQuery);

/* Lithuanian (UTF-8) initialisation for the jQuery UI date picker plugin. */
/* @author Arturas Paleicikas <arturas@avalon.lt> */
jQuery(function($) {
   $.datepicker.regional['lt']={
      closeText: 'Uždaryti',
      prevText: '&#x3c;Atgal',
      nextText: 'Pirmyn&#x3e;',
      currentText: 'Šiandien',
      monthNames: ['Sausis', 'Vasaris', 'Kovas', 'Balandis', 'Gegužė', 'Birželis',
                'Liepa', 'Rugpjūtis', 'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis'],
      monthNamesShort: ['Sau', 'Vas', 'Kov', 'Bal', 'Geg', 'Bir',
                'Lie', 'Rugp', 'Rugs', 'Spa', 'Lap', 'Gru'],
      dayNames: ['sekmadienis', 'pirmadienis', 'antradienis', 'trečiadienis', 'ketvirtadienis', 'penktadienis', 'šeštadienis'],
      dayNamesShort: ['sek', 'pir', 'ant', 'tre', 'ket', 'pen', 'šeš'],
      dayNamesMin: ['Se', 'Pr', 'An', 'Tr', 'Ke', 'Pe', 'Še'],
      weekHeader: 'Sv',
      //dateFormat: 'yy-mm-dd',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''
   };
   $.datepicker.setDefaults($.datepicker.regional['lt'], { duration: 'fast' });
});