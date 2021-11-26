/*!
*  formatrix 1.0.1 (http://formatrix.org)
*  >> PageConstructor 1.2.1
*
*  Copyright (c) 2016-2021 Germo Moeller / webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*////***************************************************************************>
(function(root){

	"use strict";

 var 	$={}
	$.prv=({

		$:{
			config:{

				// css-class prefix
				prefix: 'fx_',

				//
				breakpoints:[
					"width:0px#xTiny","width:420px#xSmall","width:820px#xMedium","width:1220px#xLarge",
					"height:0px#yTiny","height:420px#ySmall","height:820px#yMedium","height:1220px#yLarge"
				],
				// flag if dom is loaded
				ready:null,

				//
				orientation:['horizontal','vertical'],

				//
				dynBaseSize:{

					// diagonal, horizontal, vertical
					basedOn:'diagonal',

					minPos:500,
					maxPos:4500,

					html:true,
					htmlRange:[50,150],
					htmlFunction:false,

					body:true,
					bodyRange:[200,75],
					bodyFunction:false,
				}
			},
			screen:{
				baseSize:null,
			},
			tmp:{
				x:[],	xClasses:{0:'fx_x0'},
				y:[],	yClasses:{0:'fx_y0'},
				oClasses:[],

				// current %
				htmlCurrent:null,
				bodyCurrent:null,

				// last set classes
				lastClasses:false,
			},
		},
		//==================================================================>
		merge:function(){

				var result={};

			for(var i=0;i<arguments.length;i++){
				for(var a in arguments[i]){
					if( (typeof result[a] == 'object') && !(result[a] instanceof Array)){
						result[a]=$.prv.merge(result[a],arguments[i][a]);
					}else{result[a]=arguments[i][a];}
				}
			}
			return result;
		},
		//==================================================================>
		screen:{
			onResize:function(){

				var classes=[], i, sign, xxx;
				//------------------------------------------------------------>
				if($.prv.$.config.breakpoints){
					var x=0; while(x < $.prv.$.tmp['x'].length){
						if(window.innerWidth >= $.prv.$.tmp['x'][x]){sign=''; $.prv.$.tmp.latestX=x;}else{sign='none-';}
						classes.push(sign+$.prv.$.tmp['xClasses'][$.prv.$.tmp['x'][x]]); x++;}
					var y=0; while(y < $.prv.$.tmp['y'].length){
						if(window.innerHeight >= $.prv.$.tmp['y'][y]){sign=''; $.prv.$.tmp.latestY=y;}else{sign='none-';}
						classes.push(sign+$.prv.$.tmp['yClasses'][$.prv.$.tmp['y'][y]]); y++;}
				}
				//------------------------------------------------------------>
				if($.prv.$.config.orientation){
					if(window.innerWidth > window.innerHeight){
						classes.push($.prv.$.tmp['oClasses'][0]);
					}else{classes.push($.prv.$.tmp['oClasses'][1]);}
				}
				//------------------------------------------------------------>
				if($.prv.$.config.dynBaseSize){

						var factor;

						if($.prv.$.config.dynBaseSize.basedOn=='diagonal'){
		 					factor=Math.round(Math.sqrt((window.innerWidth*window.innerWidth) + (window.innerHeight*window.innerHeight)));
						}else{if(prv.config.dynBaseSize.basedOn=='horizontal'){factor=window.innerWidth;}else{factor=window.innerHeight;}}

						var position=1+(Math.min(Math.max($.prv.$.config.dynBaseSize.minPos,factor), $.prv.$.config.dynBaseSize.maxPos)-$.prv.$.config.dynBaseSize.minPos)*100/($.prv.$.config.dynBaseSize.maxPos-$.prv.$.config.dynBaseSize.minPos);

					// - - - - - - - - - - - - - - - - - - - - - - - - - - ->
					if($.prv.$.config.dynBaseSize.html){
						var htmlCurrent, htmlRange=$.prv.$.config.dynBaseSize.htmlRange;
						if($.prv.$.config.dynBaseSize.htmlFunction===false){
							htmlCurrent=(((position*(htmlRange[htmlRange.length-1]-htmlRange[0])/100)+htmlRange[0])* 100)/100;
						}else{htmlCurrent=$.prv.$.config.dynBaseSize.htmlFunction(position,htmlRange);}
						document.documentElement.style.fontSize=$.prv.$.tmp.htmlCurrent=htmlCurrent+"%";
					}
					// - - - - - - - - - - - - - - - - - - - - - - - - - - ->
					if($.prv.$.config.dynBaseSize.body){
						var bodyCurrent, bodyRange=$.prv.$.config.dynBaseSize.bodyRange;
						if($.prv.$.config.dynBaseSize.bodyFunction===false){
							bodyCurrent=(((position*(bodyRange[bodyRange.length-1]-bodyRange[0])/100)+bodyRange[0])* 100)/100;
						}else{bodyCurrent=$.prv.$.config.dynBaseSize.bodyFunction(position,bodyRange);}
						document.body.style.fontSize=$.prv.$.tmp.bodyCurrent=bodyCurrent+"%";

					}
					// - - - - - - - - - - - - - - - - - - - - - - - - - - ->
					if($.prv.$.tmp['lastClasses']){i=0; while(i<=$.prv.$.tmp['lastClasses'].length-1){
						document.documentElement.classList.remove($.prv.$.tmp['lastClasses'][i]); i++;}}
					if(classes.length>0){i=0; while(i<=classes.length-1){
						document.documentElement.classList.add(classes[i]); i++;}}
					$.prv.$.tmp['lastClasses']=classes;
				}
			},
			getDefaultFontSize:function(){

			 	var div=document.createElement('div');
			 	div.style.cssText='display:inline-block; padding:0; width:1rem; position:absolute; visibility:hidden; font-size:1rem';
			 	div.appendChild(document.createTextNode('M'));
			 	document.documentElement.appendChild(div);
			 	$.prv.$.screen.baseSize=div.offsetWidth;
			 	document.documentElement.removeChild(div);

			}
		}

	});
	//************************************************************************>
	$.pub={

		screen:{
			//============================================================>
			get $(){
				return {
					get html(){return parseFloat($.prv.$.tmp.htmlCurrent);},
					get body(){return parseFloat($.prv.$.tmp.bodyCurrent);},
					get lastX(){return $.prv.$.tmp.x[$.prv.$.tmp.latestX];},
					get lastY(){return $.prv.$.tmp.y[$.prv.$.tmp.latestY];},
				}
			},
			//============================================================>
			init:function(config){

					$.prv.$.config=$.prv.merge($.prv.$.config, config);

					$.prv.screen.getDefaultFontSize();

				//------------------------------------------------------------>
				if($.prv.$.config.breakpoints){

					for(var i=0;i<$.prv.$.config.breakpoints.length;i++){
						var dat=$.prv.$.config.breakpoints[i].split(/\s*(height|width)\s*:\s*([0-9]+)([a-z\%]*)\s*#?([a-zA-Z0-9]*)/g);

						(dat[1].charAt(0)=='w') ? dat[1]='x' : dat[1]='y'

						if(!dat[4]){dat[4]=$.prv.$.config.prefix+dat[1]+dat[2];
						}else{	dat[4]=$.prv.$.config.prefix+dat[4];}

						$.prv.$.tmp[dat[1]].push(parseInt(dat[2]));
						$.prv.$.tmp[dat[1]+"Classes"][dat[2]]=dat[4];
					}
					$.prv.$.tmp['x'].sort(function(a, b){return a-b});
					$.prv.$.tmp['y'].sort(function(a, b){return a-b})
				}
				//------------------------------------------------------------>
				if($.prv.$.config.setOrientation){
					$.prv.$.tmp['oClasses'][0]=$.prv.$.config.prefix+$.prv.$.config.orientation[0];
					$.prv.$.tmp['oClasses'][1]=$.prv.$.config.prefix+$.prv.$.config.orientation[1];
				}
				//------------------------------------------------------------>

					try{								$.prv.screen.onResize();}catch(e){}
					//window.addEventListener("load",			$.prv.screen.onResize);
					window.addEventListener("DOMContentLoaded",	$.prv.screen.onResize);
					window.addEventListener("resize",			$.prv.screen.onResize);

					if($.prv.$.config.ready){
						window.addEventListener('load', function(){
							document.documentElement.classList.add($.prv.$.config.prefix+'dom-is-loaded');
						}, false);
					}

			},
			//============================================================>
			rem2px:function($val){
				return ($.prv.$.screen.baseSize / 100 * parseFloat($.prv.$.tmp.htmlCurrent)) * $val;
			},
			em2px:function($val){
				return ($.prv.$.screen.baseSize / 100 * parseFloat($.prv.$.tmp.bodyCurrent)) * $val;
			},
			//============================================================>

		},
	};

	root['fx']=$.pub;

})(window);
