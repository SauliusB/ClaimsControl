﻿jQuery.richArray={in:function(a,b){a=jQuery.richArray.getArray(a);b=b||0;for(var i=0,len=a.length;i<len;++i){if(a[i]==b){return true}}return false},unique:function(a){a=jQuery.richArray.getArray(a);var b=[];for(var i=0,len=a.length;i<len;++i){if(!jQuery.richArray.in(b,a[i])){b.push(a[i])}}return b},diff:function(a,b){a=jQuery.richArray.getArray(a);b=jQuery.richArray.getArray(b);var c=[];for(var i=0,len=a.length;i<len;++i){if(!jQuery.richArray.in(b,a[i])){c.push(a[i])}}return c},intersect:function(a,b){a=jQuery.richArray.getArray(a);b=jQuery.richArray.getArray(b);var c=[];for(var i=0,len=a.length;i<len;++i){if(jQuery.richArray.in(b,a[i])){c.push(a[i])}}return c},filter:function(a,b,c){a=jQuery.richArray.getArray(a);b=jQuery.richArray.getFunction(b);c=c||this;var d=[];for(var i=0,len=a.length;i<len;++i){if(b.call(c,a[i])){d.push(a[i])}}return d},map:function(a,b,c){a=jQuery.richArray.getArray(a);b=jQuery.richArray.getFunction(b);c=c||this;result=[];for(var i=0,len=a.length;i<len;++i){result.push(b.call(c,a[i]))}return result},sum:function(a,b){a=jQuery.richArray.getArray(a);b=b||0;for(var i=0,len=a.length;i<len;++i){b+=a[i]}return b},product:function(a,b){a=jQuery.richArray.getArray(a);b=b||1;for(var i=0,len=a.length;i<len;++i){b*=a[i]}return b},reduce:function(a){a=jQuery.richArray.getArray(a);if(1==a.length){return a[0]}return a},compact:function(a){var b=[];for(var i=0,len=a.length;i<len;++i){if(null!=a[i]){b.push(a[i])}}return b},without:function(a,b){var c=[];for(var i=0,len=a.length;i<len;++i){if(b!=a[i]){c.push(a[i])}}return c},getArray:function(a){if(!(a instanceof Array)){a=[]}return a},getFunction:function(a){if(!(a instanceof Function))a=new Function();return a}};