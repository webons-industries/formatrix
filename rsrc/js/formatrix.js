/*
 *  formatrix (http://formatrix.org)
 *
 *  Copyright 2016; rooted (rooted@webons.industries)
 *  Dual license (MIT / GPL Version II).
 *
 */

(function(window){

	"use strict";

	var $;
	var register={

		instance:false,

		config:{
		},
		module:[],
	};
	$=(function(data){
		if(!register.instance){register.instance=true; $.mod.add('undefined',{});

		}else{

	}	});
	$.init=(function(data){

	});
	$.mod=[];
	$.mod.add=(function(name,data){if(!$.mod[name]){$.mod[name]=data; return register.module[name]=Math.random().toString(36).slice(2);}});
	$.mod.verify=(function(data){if(register.module[data.mod]==data.key){return true;}else{return false;}});
	$.mod.access=(function(data){

	});

	window.fx=$;

})(window);


(function(fx){

	"use strict";

	var register={

		initial:false,
		config:{

			prefix: 'fx_',

			setBreakpoints:true, breakpoints:[
				"width:420px","width:820px","width:1220px",
				"height:420px","height:820px","height:1220px"
			],
			setOrientation:true, orientation:['horizontal','vertical'],
			setDynBaseSize:true, dynBaseSize:{

				basedOn:'diagonal',	// diagonal, horizontal, vertical

				html:true,
				htmlRange:[50,150],
				htmlFunctionName:false,

				body:true,
				bodyRange:[200,75],
				bodyFunctionName:false,
			},
		},
		temp:{

			width:[0],	widthClassNames:{0:'fx_h0'},
			height:[0],	heightClassNames:{0:'fx_v0'},
			orientationClassNames:[],

			lastClasses:false,

		},

  };	var	$=fx, mod='screen';
	var	key=$.mod.add(mod,{

		init:(function(config){if(!register.initial){register.initial=true; register.config=merge(register.config,config); initrun();}}),

	});

	var initrun=(function(){

		if(register.config.setBreakpoints){
			for(var i=0;i<register.config.breakpoints.length;i++){
				var dat=register.config.breakpoints[i].split(/\s*(height|width)\s*:\s*([0-9]+)([a-z\%]*)\s*#?([a-z]*)/g);

				if(!dat[4]){dat[4]=register.config.prefix+dat[1].charAt(0).replace(/h|w/g,function(match){return (match=="h")?"v":"h";})+dat[2];
				}else{	dat[4]=register.config.prefix+dat[4];}

				register.temp[dat[1]].push(parseInt(dat[2]));
				register.temp[dat[1]+"ClassNames"][dat[2]]=dat[4];
			}

			register.temp['width'].sort(function(a, b){return a-b});
			register.temp['height'].sort(function(a, b){return a-b});
		}

		if(register.config.setOrientation){
			register.temp['orientationClassNames'][0]=register.config.prefix+register.config.orientation[0];
			register.temp['orientationClassNames'][1]=register.config.prefix+register.config.orientation[1];
		}
		if(register.config.setDynBaseSize){

		}
		onResize();
		window.addEventListener("load",onResize);
		window.addEventListener("resize",onResize);
	});

	var onResize=(function(){

		var classes=[], i, sign;

		if(register.config.setBreakpoints){h=0;
			var w=0; while(w < register.temp['width'].length){
				if(window.innerWidth >= register.temp['width'][w]){sign='';}else{sign='none-';} 
				classes.push(sign+register.temp['widthClassNames'][register.temp['width'][w]]); w++;}
			var h=0; while(h < register.temp['height'].length){
				if(window.innerHeight >= register.temp['height'][h]){sign='';}else{sign='none-';} 
				classes.push(sign+register.temp['heightClassNames'][register.temp['height'][h]]); h++;} 
		}
		if(register.config.setOrientation){

			if(window.innerWidth > window.innerHeight){
				classes.push(register.temp['orientationClassNames'][0]);
			}else{classes.push(register.temp['orientationClassNames'][1]);}
		}
		if(register.config.setDynBaseSize){

				var factor;

			if(register.config.dynBaseSize.basedOn=='diagonal'){
 				factor=Math.round(Math.sqrt((window.innerWidth*window.innerWidth) + (window.innerHeight*window.innerHeight)));
			}else{if(register.config.dynBaseSize.basedOn=='horizontal'){factor=window.innerWidth;}else{factor=window.innerHeight;}}

			var	position=1+(Math.min(Math.max(register.config.dynBaseSize.minPosition,factor),register.config.dynBaseSize.maxPosition)-register.config.dynBaseSize.minPosition)*100/(register.config.dynBaseSize.maxPosition-register.config.dynBaseSize.minPosition);

			if(register.config.dynBaseSize.html){
				var htmlCurrent, htmlRange=register.config.dynBaseSize.htmlRange;
				if(register.config.dynBaseSize.htmlFunctionName===false){
					htmlCurrent=(((position*(htmlRange[htmlRange.length-1]-htmlRange[0])/100)+htmlRange[0])* 100)/100;
				}else{htmlCurrent=window[register.config.dynBaseSize.htmlFunctionName](position,htmlRange);}

				document.documentElement.style.fontSize=htmlCurrent+"%";
			}
			if(register.config.dynBaseSize.body){
				var bodyCurrent, bodyRange=register.config.dynBaseSize.bodyRange;
				if(register.config.dynBaseSize.bodyFunctionName===false){
					bodyCurrent=(((position*(bodyRange[bodyRange.length-1]-bodyRange[0])/100)+bodyRange[0])* 100)/100;
				}else{bodyCurrent=window[register.config.dynBaseSize.bodyFunctionName](position,bodyRange);}

				document.body.style.fontSize=bodyCurrent+"%";
			}
		}


		if(register.temp['lastClasses']){i=0; while(i<=register.temp['lastClasses'].length-1){
			document.documentElement.classList.remove(register.temp['lastClasses'][i]); i++;}}
		if(classes.length>0){i=0; while(i<=classes.length-1){
			document.documentElement.classList.add(classes[i]); i++;}} 
		register.temp['lastClasses']=classes;

	});

	var merge=(function(){
		var result={};
		for(var i=0;i<arguments.length;i++){
			for(var a in arguments[i]){
				if( (typeof result[a] == 'object') && !(result[a] instanceof Array)){
					result[a]=merge(result[a],arguments[i][a]);
				}else{result[a]=arguments[i][a];}
			}
		}
		return result;
	});

})(fx);
