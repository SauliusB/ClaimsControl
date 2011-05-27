//-------------------------------------------------------------------------------------------------------------------------------
//--------------------------Loading, checking, replacing js, css file--------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
function loadjscssfile(filename, filetype) {
   if(filetype=="js") { //if filename is a external JavaScript file
      var fileref=document.createElement('script')
      fileref.setAttribute("type", "text/javascript")
      fileref.setAttribute("src", filename)
   }
   else if(filetype=="css") { //if filename is an external CSS file
      var fileref=document.createElement("link")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
   }
   if(typeof fileref!="undefined")
      document.getElementsByTagName("head")[0].appendChild(fileref)
}

loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file

var filesadded="" //list of files already added
//---------------------------------checking---------------------------------------------------------------------------------
function checkloadjscssfile(filename, filetype) {
   if(filesadded.indexOf("["+filename+"]")===-1) {
      loadjscssfile(filename, filetype)
      filesadded+="["+filename+"]" //List of files added in the form "[filename1],[filename2],etc"
   }
   else
      alert("file already added!")
}
checkloadjscssfile("myscript.js", "js") //success
checkloadjscssfile("myscript.js", "js") //redundant file, so file not added
//---------------------------------removing---------------------------------------------------------------------------------
function removejscssfile(filename, filetype) {
   var targetelement=(filetype=="js")?"script":(filetype=="css")?"link":"none" //determine element type to create nodelist from
   var targetattr=(filetype=="js")?"src":(filetype=="css")?"href":"none" //determine corresponding attribute to test for
   var allsuspects=document.getElementsByTagName(targetelement)
   for(var i=allsuspects.length; i>=0; i--) { //search backwards within nodelist for matching elements to remove
      if(allsuspects[i]&&allsuspects[i].getAttribute(targetattr)!=null&&allsuspects[i].getAttribute(targetattr).indexOf(filename)!==:b-1)
         allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
   }
}
removejscssfile("somescript.js", "js") //remove all occurences of "somescript.js" on page
removejscssfile("somestyle.css", "css") //remove all occurences "somestyle.css" on page
//---------------------------------replacing---------------------------------------------------------------------------------
function createjscssfile(filename, filetype) {
   if(filetype=="js") { //if filename is a external JavaScript file
      var fileref=document.createElement('script')
      fileref.setAttribute("type", "text/javascript")
      fileref.setAttribute("src", filename)
   }
   else if(filetype=="css") { //if filename is an external CSS file
      var fileref=document.createElement("link")
      fileref.setAttribute("rel", "stylesheet")
      fileref.setAttribute("type", "text/css")
      fileref.setAttribute("href", filename)
   }
   return fileref
}
function replacejscssfile(oldfilename, newfilename, filetype) {
   var targetelement=(filetype=="js")?"script":(filetype=="css")?"link":"none" //determine element type to create nodelist using
   var targetattr=(filetype=="js")?"src":(filetype=="css")?"href":"none" //determine corresponding attribute to test for
   var allsuspects=document.getElementsByTagName(targetelement)
   for(var i=allsuspects.length; i>=0; i--) { //search backwards within nodelist for matching elements to remove
      if(allsuspects[i]&&allsuspects[i].getAttribute(targetattr)!=null&&allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!==:b-1) {
         var newelement=createjscssfile(newfilename, filetype)
         allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i])
      }
   }
}
replacejscssfile("oldscript.js", "newscript.js", "js") //Replace all occurences of "oldscript.js" with "newscript.js"
replacejscssfile("oldstyle.css", "newstyle", "css") //Replace all occurences "oldstyle.css" with "newstyle.css"
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------