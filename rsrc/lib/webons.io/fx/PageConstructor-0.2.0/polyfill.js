console.log("%cpolyfill loaded","color:#0a0;");if(!Number.isInteger){Number.isInteger=function(a){return(a^0)===a}}if("NodeList" in window&&!NodeList.prototype.forEach){NodeList.prototype.forEach=function(c,a){a=a||window;for(var b=0;b<this.length;b++){c.call(a,this[b],b,this)}}}(function(a){a.forEach(function(c){if(c.hasOwnProperty("remove")){return}Object.defineProperty(c,"remove",{configurable:true,enumerable:true,writable:true,value:function b(){if(this.parentNode!==null){this.parentNode.removeChild(this)}}})})})([Element.prototype,CharacterData.prototype,DocumentType.prototype]);if(!Element.prototype.matches){Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector}if(!Element.prototype.closest){Element.prototype.closest=function(b){var a=this;if(!document.documentElement.contains(a)){return null}do{if(a.matches(b)){return a}a=a.parentElement||a.parentNode}while(a!==null&&a.nodeType===1);return null}}if(!String.prototype.includes){String.prototype.includes=function(a,b){if(typeof b!=="number"){b=0}if(b+a.length>this.length){return false}else{return this.indexOf(a,b)!==-1}}}if(!Array.prototype.includes){Object.defineProperty(Array.prototype,"includes",{value:function(d,e){if(this==null){throw new TypeError('"this" is null or not defined')}var f=Object(this);var a=f.length>>>0;if(a===0){return false}var g=e|0;var c=Math.max(g>=0?g:a-Math.abs(g),0);function b(h,i){return h===i||(typeof h==="number"&&typeof i==="number"&&isNaN(h)&&isNaN(i))}while(c<a){if(b(f[c],d)){return true}c++}return false}})}if(!Array.from){Array.from=(function(){var d=Object.prototype.toString;var e=function(g){return typeof g==="function"||d.call(g)==="[object Function]"};var c=function(h){var g=Number(h);if(isNaN(g)){return 0}if(g===0||!isFinite(g)){return g}return(g>0?1:-1)*Math.floor(Math.abs(g))};var b=Math.pow(2,53)-1;var a=function(h){var g=c(h);return Math.min(Math.max(g,0),b)};return function f(p){var g=this;var o=Object(p);if(p==null){throw new TypeError("Array.from requires an array-like object - not null or undefined")}var m=arguments.length>1?arguments[1]:void undefined;var i;if(typeof m!=="undefined"){if(!e(m)){throw new TypeError("Array.from: when provided, the second argument must be a function")}if(arguments.length>2){i=arguments[2]}}var n=a(o.length);var h=e(g)?Object(new g(n)):new Array(n);var j=0;var l;while(j<n){l=o[j];if(m){h[j]=typeof i==="undefined"?m(l,j):m.call(i,l,j)}else{h[j]=l}j+=1}h.length=n;return h}}())};