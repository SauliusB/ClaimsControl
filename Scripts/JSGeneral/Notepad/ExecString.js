function eval_global(codetoeval) {
 if (window.execScript)`
   window.execScript('code_evaled = ' + '(' + codetoeval + ')',''); // execScript doesn’t return anything`
else`
    code_evaled = eval(codetoeval);`
return code_evaled;
}
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
var target = 'next';
$("foobar")[target]();    // identical to $("foobar").next()
//--------------
var target = 'next';
jQuery("selector")[target]();
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
var strFun = "someFunction";
var strParam = "this is the parameter";
 //Create the function call from function name and parameter.
var funcCall = strFun + "('" + strParam + "');";
 //Call the function
var ret = eval(funcCall);
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------   
// convert string to a function reference (if it exists)
fun = eval(strFun);
// call it
fun(param1, param2);