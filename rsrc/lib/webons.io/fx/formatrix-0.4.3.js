/*!
*  formatrix 0.4.3 (http://formatrix.org)
*
*
*  Copyright (c) 2016-2019 Germo Moeller / webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*////***************************************************************************>
 !(function(root){

	"use strict";

	var self=null, $={
		prv:{
			$:{
				// version
				ver:'0.4.3',
				// instance
				instance:null,
				// default boot settings > rewritable by 'init' namespace
				config:{

					// root pointer
					root:'fx',
					// basepath
					basepath:'/',
					// locator
					locator:{

						web:'https://',
						cdn:'https://cdnjs.cloudflare.com/ajax/libs/',
						lib:'rsrc/lib/',
						app:'rsrc/app/',
					},
					// TODO: locator to get uncached namespace-scripts - lib: A) lib[1]  B) web[2]
					locator_tries:{
						lib:[1,'web',2]
					},
					//
					ajax:{

						method:	'GET',
						url:		'index.php',
						async:	'false',

						query:{},
					}
				},
				// ecmas version
				es_ver:null,
				// namespace register
				ns:{
					__ruler__:{
						boot:{},
						init:{},
						core:{},
					},
					__ruler__default:{
						// status
						status:0,
						// script src=''
						src:null,
						// configuration
					},
					__bundles__:{

					}
				},
				// namespace shortcut modifies list
				ns_scm:null,
				//
				thread:null,
				// amd module
				mod_amd:[],

				pointer:{
					obj:{},
					raw:[],
				},
			},
		},
		pub:{
			$:{
				get ver(){
					return $.prv.$.ver;
				},
				get es_ver(){
					return $.prv.$.es_ver;
				},
				get config(){
					return $.pub.object_freeze($.prv.$.config);
				},
			},
			isTypeOf:function(v, o, d){
				v=Object.prototype.toString.call(v).slice(8,-1);
				if(d && v.substr(0,4)=='HTML'){v='DomObject';}
				if(o){return v === o.name;
				}else{return v;}
			},
			object_merge:function(){

					var result={};

				for(var i=0;i<arguments.length;i++){

					for(var a in arguments[i]){
						if( $.pub.isTypeOf(result[a], Object) && !(result[a] instanceof Array)){
							var d=Object.getOwnPropertyDescriptor(arguments[i], a);
							if( d && (d.get || d.set)){
								//result[a]=arguments[i][a];
								Object.defineProperty(result, a, d);
							}else{result[a]=$.pub.object_merge(result[a], arguments[i][a]);}
						}else{result[a]=arguments[i][a];}
					}
				}
				return result;
			},
			object_create_path:function(path, value, obj){
				if(!obj){obj={};}
				if($.pub.isTypeOf(path, String)){path=path.split('.');}
				if(path.length > 0){
					(function(o,p,v){
						for(var i=0; i<p.length-1; i++){
							o=o[p[i]]=o[p[i]] || {};
						}
						o[p[p.length-1]]=$.pub.object_merge(o[p[p.length-1]], v);
					})(obj, path, value);
				}else{
					obj=$.pub.object_merge(obj, value)
				}
				return obj;
			},
			object_freeze:function(o){

				Object.freeze(o);
				Object.getOwnPropertyNames(o).forEach(function(p){
					if(o.hasOwnProperty(p)
						&& o[p] !== null
						&& (typeof o[p] === "object" || typeof o[p] === "function")
						&& !Object.isFrozen(o[p])
					){	$.pub.object_freeze(o[p]);}
				});

			  return o;
			},
			object_convert:function(obj, pre){

					var	p,k,v,str = [];

				for(p in obj){
					if(obj.hasOwnProperty(p)){
						k=pre ? pre + "[" + p + "]" : p;
						v=obj[p];
						str.push((v !== null && typeof v === "object") ?
							$.pub.object_convert(v, k) :
							encodeURIComponent(k) + "=" + encodeURIComponent(v));
					}
				}
				return str.join("&");
			},
			pointer:{
				current:function(id){
					return $.prv.$.ns.__ruler__[id].config;
				},
				register:function(pid, inc, bind){

					// return whole pointer-obj
					if(!pid){return $.prv.$.pointer.obj;}
					// return pointer-obj from pid
					if(!inc){return $.pub.pointer.get(pid);
					// prepare data and build pointer-obj
					}else{//------------------------------------------------------>

							var dat, obj=true, result;

						//------------------------------------------------------>
						switch($.pub.isTypeOf(inc)){
							case 'Object':{
								dat=inc;
							break;}
							case 'Array':{
								dat=$.pub.object_merge.apply(null, inc);
							break;}
							case 'Function':{
								obj=false;
							break;}
						}
						//------------------------------------------------------>
						if(obj || pid!==true){
							$.prv.$.pointer.raw[pid]=dat;
							// - - - - - - - - - - - - - - - - - - - - - - - ->

							var	obj=function(){};
								obj.prototype=Object.create(dat);
								obj.prototype.constructor=obj;

							// - - - - - - - - - - - - - - - - - - - - - - - ->
							result=new obj(pid);
						}else{result=inc;}
						//if(pid===true){pid=[];}
						//------------------------------------------------------>
						// $.prv.$.pointer.obj=$.pub.object_merge($.prv.$.pointer.obj, $.pub.object_create_path(pid, result);)
						$.prv.$.pointer.obj=$.pub.object_create_path(pid, result, $.prv.$.pointer.obj);

						if(bind){$.pub.pointer.bind();}
						return $.prv.$.pointer.obj;
					}
				},
				bind:function(){

					function extend(obj, src) {
					    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
					    return obj;
					}

					Object.keys($.prv.$.pointer.obj).map(function(key){
						if(window[key]){
							$.prv.$.pointer.obj[key]=(function(o, s){
								for(var k in s){
									if(s.hasOwnProperty(k)) o[k]=s[k];
								}
								return o;
							})(window[key], $.prv.$.pointer.obj[key]);
						}
						window[key]=$.prv.$.pointer.obj[key];
					});
				},
				get:function(str){
					if(typeof str ==='string'){
							return str.split('.').reduce(function(o, i){if(!o[i]){o[i]={};} return o[i];}, $.prv.$.pointer.obj);
					}else{	return $.prv.$.pointer.obj;}
				},
			},
			dom:{
				ready:function(exe){
					if(document.readyState==="complete"){
						setTimeout(function(){
							return exe && exe();
						}, 1);
					}else{
						window.addEventListener('load', function(){
							return exe && exe();
						}, false);
					}
				},
				load_script:function(src, cb, no){
					// source, callback, none-src-rewrite
					if(!no){src=$.pub.namespace.get_src(src);}

					var		e=document.createElement('script');
					if(cb){	e.onload	= e.onerror=cb();}
							e.src		= src;
							e.charset	='utf-8';
					document.head.appendChild(e);
				},
				execute_scripts:function(type, mode){

					var	n=document.querySelectorAll('script[type="'+type+'"]'),
						ix='', ext=[], ele, cbc;

					for(var i=0; i<n.length; i++){
						if(n[i].dataset.load){
							ext.push(n[i].dataset.load);
						}else{ix+=n[i].innerHTML.toString().replace('\t','').split('\r\n');}
						n[i].type=type+":ready";
					}

					if(cbc=ext.length){
						for(var i=0; i<ext.length; i++){
							$.pub.dom.load_script(ext[i], function(){
								cbc--;
								if(cbc==0 && ix){
									$.pub.dom.load_script("data:text/plain;base64," + btoa(ix), null, true);
								}
							});
						}
					}else if(ix){$.pub.dom.load_script("data:text/plain;base64," + btoa(ix), null, true);}
				},
			},
			screen:{
			},
			request:{
				get:function(req){

						req = req || {};

						req.url=req.url ? req.url : $.prv.$.config.ajax.url
						req.url=req.url+'?'+$.pub.object_convert(req.query);

					var	xhr=new XMLHttpRequest();

					xhr.open(
						req.method ? req.method : $.prv.$.config.ajax.method,
						req.url,
						req.async ? req.async : $.prv.$.config.ajax.async,
						req.user ? req.user : null,
						req.pswd ? req.pswd : null
					);
					xhr.onreadystatechange=function(e){
						if(this.readyState == 4 && this.status == 200) {
							req.success ? req.success.call(this) : null
						}else if(this.readyState == 4){
							req.error ? req.error.call(this) : null
						}
					};
					xhr.send(null);
				}
			},
			cmd:{
				resolve:function(v){return $.pub.namespace.get_src($.pub.namespace.parse_namespace(v)['id']);},
			},
		}
	}
	//************************************************************************> [Thread]
	$.prv.thread=function(){				//console.log('%c---[thread:new]---','color:#ee0000;');

		$.prv.$.thread=this;

		this.$={

			status:null,

			tm:0,
			required:[],
			loaded:[],

			callback:[],
		}
	}
	$.prv.thread.prototype.start=function(){		//console.log('%c---[thread:start]---','color:#ee0000;');
		new $.prv.tm();
	}
	$.prv.thread.prototype.close=function(){		//console.log('%c---[thread:close]---','color:#ee0000;');

		// check:
		if($.prv.$.ns.__ruler__.boot.status===false){
			this.$.callback.unshift($.prv.$.ns.__ruler__.boot.mirror);
			$.prv.$.ns.__ruler__.boot.status=true;
		}

		var i=this.$.callback.length;

		// run callbacks
		this.$.callback.map(function(ns_obj){

				// TODO check: timeouts

			// give a ms
			setTimeout(function(){
				$.prv.namespace.callback(ns_obj);

				i--;
				// last callback in thread!!
				if(i==0){
					// setTimeout(function(){

						$.pub.dom.ready(function(){
							$.pub.dom.execute_scripts("fx/namespace");
						});
						$.pub.pointer.bind();
					//}, 200);
				}
			}, 10);
		});
		//console.log('%c--------------------','color:#ee0000;');
		this.$.status=false;
		//console.log('%c---[thread:close]---','color:#ee0000;');
	}
	//************************************************************************> [Transmission]
	$.prv.tm=function(src){						//console.log('%c~~~> transmission:new','color:#666666;');

		$.prv.$.thread.$.status=true;
		this.thread=$.prv.$.thread;
		if(src){
			this.start(src);
		}else{this.close();}
	}
	$.prv.tm.prototype.start=function(src, ns){		//console.log('%c~~~> transmission:start','color:#666666;');

		var	$this=this,
			e=document.createElement('script');
			e.src=src;
			if($.prv.$.es_ver>5){
				e.type='module';
			}
			e.charset='utf-8';
			e.async='true';
			// TODO:  onerror ?
			//e.onerror=
			e.onload=function(){
				if($.prv.$.mod_amd.length>=1){
					var	n=new $.pub.namespace(ns),
						m=$.prv.$.mod_amd.shift();
						n.pub({
							module:new m[m.length-1]
						});
				}
				$this.thread.$.tm--;
				$this.close();
			}
		setTimeout(function(){
			document.head.appendChild(e);
		},10);

		this.thread.$.tm++;
	}
	$.prv.tm.prototype.close=function(){			//console.log('%c~~~> transmission:final','color:#666666;');

		if(this.thread.$.required.length>=1){

			var ns, $this=this;

			while((ns=this.thread.$.required.shift()) !== undefined){
				$this.start($.pub.namespace.get_src(ns),ns);
				/* ? */ this.thread.$.loaded.push(ns);
			}
		}
		//console.log('%c~~~> transmission:close','color:#666666;');
		// if all transmissions final close thread
		if(this.thread.$.tm==0){this.thread.close();}
	}
	//************************************************************************> [Namespace]
	$.prv.namespace={

		// set namespace modifier-list
		setModifiers:function(){
			delete $.prv.$.config.locator['sys'];
			Object.keys($.prv.$.config.locator).map(function(key){
				$.prv.$.ns_scm.push([''+key+'://', $.prv.$.config.locator[key]]);
			});
		},
		callback:function($this){
				//console.log("callback >> "+$this.$.id);

				var tmp;
				/*
					console.log("--- callback ---");
					console.log($this.$.id);
					console.log($this.$.use);
					console.log($this.$.pub);
					console.log($this.$.run);
					console.log("-----------------");
				*/
				// IDEA: merge objects if exist ?!

			//------------------------------------------------------------> use
			Object.keys($this.$.use).map(function(i){


				// get required namespace
				if(tmp=$.prv.$.ns[$this.$.use[i].id]){

					// is just an node in namespace required?
					if($this.$.use[i].node){

						// deeper levels?
						var lvl=$this.$.use[i].node.split('.');

						// go through the nodes
						for(var j=0;j<lvl.length; j++){

							// is a function()?
							var func=(/(.*?)\((.*?)\)/).exec(lvl[j]);
							if(func){lvl[j]=func[1];}
							//
							if(typeof tmp[lvl[j]]==='undefined'){	tmp[lvl[j]]=null; j=lvl.length;
							}else if(func){					tmp=tmp[func[1]](func[2]);
							}else{						tmp=tmp[lvl[j]];}
						}
					}
				}else{tmp={};}

				$this[$this.$.use[i].key]=tmp;

				// if != init
				// if($.prv.$.ns.__ruler__[$this.$.use[i].id]){}

			});
			//------------------------------------------------------------> pub
			Object.keys($this.$.pub).map(function(i){
				// TODO: if pub = function?

				if(typeof $this.$.pub[i]=='object'){

					Object.keys($this.$.pub[i]).map(function(key){

						var uni=Object.getOwnPropertyDescriptor($this.$.pub[i], key);

						if(!$.prv.$.ns[$this.$.id][key]){
							Object.defineProperty($.prv.$.ns[$this.$.id], key, uni);
						}
						if(!$this[key]){
							Object.defineProperty($this, key, uni);
						}
					});
				}else{
					$.prv.$.ns[$this.$.id]=$this.$.pub[i];
				}
			});
			//------------------------------------------------------------> run
			Object.keys($this.$.run).map(function(key){

				if($this.$.run[key]){
					var	cb=$this.$.run[key];
						cb.prototype=Object.create({});

					Object.keys($this).map(function(key){
						if(!cb.prototype[key]){
							var uni=Object.getOwnPropertyDescriptor($this, key);
							// getter failed: cb.prototype[key]=$this[key];
							Object.defineProperty(cb.prototype, key, uni);
						}
					});
					new cb();
				}
				// check
				delete($this.$.run[key]);
			});
			//------------------------------------------------------------> win
			if($this.$.win){
				if($.pub.isTypeOf($this.$.win, Function)){$this.$.win=$this.$.win();}
				tmp=$.prv.$.ns.__ruler__[$this.$.id].pointer; if(!tmp){tmp=true;}
				$.pub.pointer.register(tmp, $this.$.win, true);
			}
		},
	}
	$.pub.namespace=function(id, cfg){

			self=$.prv.namespace.self;

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
		if(!$.prv.$.thread || $.prv.$.thread.$.status==false){
			new $.prv.thread();
		}

		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
		this.$={

			// namespace id
			id:self.parse_namespace(id ? id : 'default')['id'],

			use:[],
			pub:[],
			run:[],
			win:null,
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
		if(!$.prv.$.ns.__ruler__[this.$.id]){	// console.log('%c~~~> '+this.$.id, "color:#aa00ff;");

			// set ruler
			$.prv.$.ns.__ruler__[this.$.id]=Object.create($.prv.$.ns.__ruler__default);
			$.prv.$.ns.__ruler__[this.$.id].config=cfg;
			//
			$.prv.$.ns[this.$.id]={};

			// if core set gate
			if(this.$.id==$.prv.$.ns.__ruler__.core.id){
				this.core=$;
			}
		}else{

			// TODO: writeable modes
			if(!$.prv.$.ns.__ruler__[this.$.id].config  || !$.prv.$.ns.__ruler__[this.$.id].config.writable){return false;}
		}
		//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~>
		if($.prv.$.instance!==null){

			/* ?? */
			var	x=$.prv.$.thread.$.required.indexOf(this.$.id);
				x>=0 ? $.prv.$.thread.$.required.splice(x, (x+1)) : null
			/* ?? */

			$.prv.$.thread.$.callback.unshift(this);
		}
		//------------------------------------------------------------------> mods
		if($.prv.$.instance){				//console.log('%cnamespace: '+this.$.id, "color:#00aa00;");

			// config
			if(cfg){

				// TODO: set ns window.pointer via config?
				// TODO: set ns window.parent via string?
				if(cfg.called){
					if(cfg.parent && $.prv.$.ns.__ruler__[cfg.parent]){
						cfg.called=$.prv.$.ns.__ruler__[cfg.parent].pointer+'.'+cfg.called;
					}
				}else{cfg.called='';}

				$.prv.$.ns.__ruler__[this.$.id].pointer=cfg.called;
			}
			// set root in every namespace

			this[$.prv.$.config.root]=$.pub;

		//------------------------------------------------------------------> init
		}else if($.prv.$.instance===false){			//console.log('%cnamespace: '+this.$.id+" (init)", "color:#008800;");

			// merge config
			if(cfg.init.config){
				$.prv.$.config=$.pub.object_merge($.prv.$.config, cfg.init.config);
			}
			// build modifiers
			$.prv.namespace.setModifiers();
			// init use
			if(cfg.init.use){
				// set core ruler
				if(cfg.init.use['core']){
					$.prv.$.ns.__ruler__.core.id=cfg.init.use['core'];
				}
				boot.use(cfg.init.use);
			}

			// TODO: es5 import: require
			//if($.fx.$.es_ver<6 && typeof require =='undefined'){
			//	this.use({
			//		require:'cdn://require.js/2.3.6/require.min.js',
			//	});

			delete cfg.init;

			// called
			if(!cfg.called){cfg.called='';}
			$.prv.$.ns.__ruler__[this.$.id].pointer=cfg.called;

			// set init
			$.prv.$.ns.__ruler__.init.id=this.$.id;
			$.prv.$.ns.__ruler__.init.config=cfg;

			// set root pointer
			$.prv.$.ns.__ruler__[$.prv.$.ns.__ruler__.boot.id].pointer=$.prv.$.config.root;

			if(typeof root[$.prv.$.config.root]!='undefined'){
				$.pub=$.pub.object_merge(root[$.prv.$.config.root], $.pub);
			}
			this[$.prv.$.config.root]=$.pub;
			root[$.prv.$.config.root]=$.pub;

			$.prv.$.instance=true;
		//------------------------------------------------------------------> boot
		}else{						//console.log('%cnamespace: '+this.$.id+" (boot)", "color:#006600;");
			// set boot
			$.prv.$.ns.__ruler__.boot.id=this.$.id;
			$.prv.$.ns.__ruler__.boot.config=cfg;
			$.prv.$.ns.__ruler__.boot.mirror=this;
			$.prv.$.ns.__ruler__.boot.status=false;

			if(typeof fx!='undefined'){$.pub=$.pub.object_merge(fx, $.pub);}

			// set ecmas ver
			if(function(){		"use strict";
				try		{	eval("var foo = (x)=>x+1");
				} catch(e)	{	return false;
				}			return true;
			}()){ $.prv.$.es_ver=6;
			}else{$.prv.$.es_ver=5;}
			// shortcut modifies (only ecmas)
			$.prv.$.ns_scm=[['~?','_es'+$.prv.$.es_ver]];
			// - - - - - - - - - - - - - - - - - - - - - - - - - - ->

			window['DomObject']={name:'DomObject'}

			if(!String.name){

				String.name='String';
				Array.name='Array';
				Object.name='Object';
				Function.name='Function';
			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - - ->
			$.prv.$.instance=false;
	}	}
	$.pub.namespace.prototype.use=function(bundle){		//console.log("%c> "+this.$.id+".use()","color:#cccc00;");

			// if bundle empty
			if(!bundle){return null;}
			// unify bundles
			if($.pub.isTypeOf(bundle, String)){bundle=[bundle];}

			var $this=this;

		/* bundle routine */
		Object.keys(bundle).map(function(key){

			var	tmp=self.parse_namespace(bundle[key]);

			$this.$.use.push({
				key:key,
				id:tmp['id'],
				node:tmp['node'],
			})

			//if(!$.prv.$.ns.__ruler__[tmp['id']] && $.prv.$.thread.$.loaded.indexOf(tmp['id'])==-1 && $.prv.$.thread.$.required.indexOf(tmp['id'])){
			if(!$.prv.$.ns.__ruler__[tmp['id']] && $.prv.$.thread.$.required.indexOf(tmp['id'])==-1){
				$.prv.$.thread.$.required.unshift(tmp['id']);
			}else{

				if(!$this[key]){
					// clone?
					$this[key]=$.prv.$.ns.__ruler__[$this.$.id];
				}
				/*
					$.prv.$.thread.$.status=true;
					return false;
				*/
			}
		});

		if(!$.prv.$.thread.$.status){
			$.prv.$.thread.start();
		}
	}
	$.pub.namespace.prototype.prv=({});
	$.pub.namespace.prototype.pub=function(nodes){		//console.log("%c> "+this.$.id+".pub()","color:#cccc00;");
		this.$.pub.push(nodes);
	}
	$.pub.namespace.prototype.run=function(runtime){	//console.log("%c> "+this.$.id+".run()","color:#cccc00;");
		this.$.run.push(runtime);
		// TODO: check
		if(!$.prv.$.thread.$.status){
			$.prv.$.thread.close();
		}
	}
	$.pub.namespace.prototype.win=function(list){		//console.log("%c> "+this.$.id+".win()","color:#cccc00;");
		this.$.win=list;
	}
	// TODO pro/protected: share only in thread line!
	//========================================================================> public static
	$.pub.namespace.parse_namespace=function(str){

		//> 'namespace::node' > return 0:namespace, 1:node
		str=str.split("::");

		//> remove query (??)
		str[2]=/\?\?/.exec(str[0]);
		str[2] ? str[0]=str[0].substring(0, str[2].index) : null;

		//> remove '.js' from namespace
		if(/\.js$/.test(str[0])){str[0]=str[0].slice(0,-3);}

		str[3]=/\[\s*(.*?)\s*\]/.exec(str[0]);
		str[3]=str[3] ? str[3][1] : null;

		return {
			id:		str[0],
			node:		str[1],
			query:	str[2],
			locator:	str[3],
		};
	}
	$.pub.namespace.get_src=function(id){

		var tmp;

		// modifier list
		for(var i=0; i<=$.prv.$.ns_scm.length-1; i++){
			tmp=$.prv.$.ns_scm[i][1];
			id=id.replace($.prv.$.ns_scm[i][0], tmp);
		}

		// short-cuts
		if(id.slice(-1)=='/'){id+='index';}
		if(!/\.(js|css)$/.test(id)){id+='.js';}

		return id;
	}
	/*
		version bind

		bid bundle-id (matching path)
		ver version
		suf suffix
		dmt delimiter

		bid+det+ver+suf

		with delimiter:		'lib:/example.io/path-to-source'-'0.5.6/'~?/'
		without delimiter:	'lib:/example.io/path-to-source/'0.5.6'~?/'

	*/
	$.pub.namespace.vbind=function(bid, ver, suf, dmt){

		if(!$.prv.$.ns.__bundles__[bid]){
			if(!suf){suf='';} if(!dmt){dmt='';}
			$.prv.$.ns.__bundles__[bid]=bid+dmt+ver+suf;
		}
		return $.prv.$.ns.__bundles__[bid];
	}
	//========================================================================>
	$.prv.amd=function(){
		$.prv.$.mod_amd.push(arguments);
	}
	//========================================================================>
	$.prv.namespace.self=$.pub.namespace;
	//************************************************************************>
	//************************************************************************>
	//************************************************************************>

		var	data=document.querySelector('script[data-init]');

		var	boot=new $.pub.namespace('sys://formatrix-'+$.prv.$.ver+'/', data);
			boot.use(data.getAttribute('data-init'));
			boot.pub($.pub);

	root['Namespace']=$.pub.namespace;
	root['define']=$.prv.amd; define.amd=true;

})(window);
