/// <reference path="../JSMain/jquery-1.4.4-vsdoc.js" />
function EDITFORM(p) {
   //{objName:??,Edit:id}
   var f=new clsEDITABLE_LIST(p);
   //f.prototype=$.extend({}, clsEDITABLE_LIST_PROTOTYPE);
   f=$.extend(f, clsEDITABLE_LIST_PROTOTYPE);
   f.fnShow();
}                                                          