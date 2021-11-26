/*!
*  formatrix 1.0.1 (http://formatrix.org)
*
*
*  Copyright (c) 2016-2021 Germo Moeller / webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*////***************************************************************************>
!(function(root){

	"use strict";

	var $={
		prv:{
			$:{
				// version
				ver:'1.0.1',
				// instance
				instance:null,
				// default base settings > rewritable by 'init' namespace
				config:{
					// locator
					locator:{
					   // sys:null,
						web:'https://',
						lib:'rsrc/lib/',
						app:'rsrc/app/',
					},
					// charset
					charset:'utf-8',
					// general ajax setup
					ajax:{
						method:	'GET',
						url:		'index.php',
						async:	'false',
						query:	{},
					},
				},
				// core
				core:{

					ns:null,
					use:null,

					status:null,

					default:{
						pando:'0.0.1~?',
					},
					// init core slots
					slots:{
					},
				},
				// init
				init:null,

				// escma-script version
				es_ver:null,
				// transmissions-process list (fx-objects#filling@script-process / removed@onload-function)
				tm_process:[],
				// namespaces-register
				ns:{},
				// namespace shortcut modifies list
				ns_scm:{'~?': ''},
				// currently global requested namespaces
				ns_req:[],

				// stream
				stream:{},
				//stream_last:[],
				// TODO: per stream
				fx_define:{},

			},
			// TODO: check: are slots necessary? move to prv?
			slots:{
				base:{
					esver:function(){

						// 2009 / es5
						try {
							eval("var foo = (x)=>x+1");
						}catch(err){return 5;}

						return null;
					},
					fx:function(){
						return $.pub;
					},
				},
				tm:{
					default:function(ns, src){
						//console.log('%c'+src+'', 'color:#077;');

							var $this=this, e;

						e=document.createElement('script');
						e.src=src;
						e.charset=$.prv.$.config.charset;
						e.type='module';
						e.setAttribute("async", true);

						e.onload=e.onerror=function(evt){
							//console.log('%c[loaded] '+src+'', 'color:#0aa;');

							$this.stream.$.tmc--;

							// TODO check: load tries? -> if(evt.type!='load'){}
							$.prv.tm_finishing($this.stream.$.id, ns);
						}
						document.head.appendChild(e);
					},
				},
				ns:{
					finalize:function(id){

							var $this=this;

						Object.keys($.prv.$.fx_define).forEach(function(key){
							$this[key]=$.prv.$.fx_define[key];
							//$this.__defineGetter__(key, function(){return $.prv.$.fx_define[key];});
						});
					},
				},
				cb:{
					test:null
				},
				loader:{
					styles:function(bundle, cur){
						bundle.forEach(function(pointer){

							$.pub.dom.style($.prv.formatrix.parse_namespace(pointer, cur, true));
						});
						return {};
					}
				},
			},
			//============================================================>
			getTmpNS:function(){

				var tmp=Math.random().toString(36).slice(-8)
				if(!$.prv.$.ns[tmp]){
					return tmp;
				}else{return this.getTmpNS();}
			},
			// set namespace modifier-list
			setModifiers:function(){
				delete $.prv.$.config.locator['sys'];
				Object.keys($.prv.$.config.locator).map(function(key){
					$.prv.$.ns_scm[key+'://']=$.prv.$.config.locator[key];
				});
			},
			// set namespace
			setNamespace:function(ns_parsed, FX){

				if($.prv.$.ns_req.indexOf(ns_parsed.pointer)!=-1){
					$.prv.$.ns_req.splice($.prv.$.ns_req.indexOf(ns_parsed.pointer), 1);
				}

				if(!$.prv.$.ns[ns_parsed.pointer]){
					// set namespace default object
					$.prv.$.ns[ns_parsed.pointer]=Object.create({

						// namsepace id
						id: ns_parsed.pointer,
						// namsepace parsed-data object
						ns: ns_parsed,
						// fx assign
						fx:{
							// last fx-inheritance
							$:	null,
							prv:	null,
							// fx public's and extensions
							pub:{},
						},

						sid:		null,
						// src-url
						src:		null,
						// status (null/false/true)
						status:	null,

						parent:null,
						//
						childs:[],
					});
					return true;
				}

			},
			// transmission finishing: after the transmission-script (file/ajax/etc) is loaded & executed
			tm_finishing:function(sid, ns_cur){

					//console.log('------------- transmission finisher ------------- '+ns_cur);
					//if(ns_cur===null){ns_cur='';}
					var	// create new stream if not exist
						sid_org=(sid ? sid : new $.prv.stream(null, 'root').$.id),
						sid_cur,
						branch,
						// fx-object from transmission-process list for reassign in finishing routine // tmp variable
						FX, bundle, tmp;

					/* debug helper: remove! */
					var lfx=$.prv.$.tm_process.length-1;

				// loop all fx-units@transmission
				while($.prv.$.tm_process.length>0){

					sid=sid_org;

						FX=$.prv.$.tm_process.pop();
						tmp=ns_cur;

					// namespace-id is predefined
					if(FX.$.__fx__.config.ns){
						tmp=FX.$.__fx__.config.ns;
					// namespace-id is not predefined
					}else if($.prv.$.tm_process.length!=0){
						tmp='tmp://'+$.prv.getTmpNS();
					}
					// parse namespace
					tmp=$.prv.formatrix.parse_namespace(tmp, ns_cur);
					// setup namespace
					$.prv.setNamespace(tmp, FX);

					// relate formatrix-reference object <~> namespace-object
					if($.prv.$.ns[tmp.pointer].fx.prv===null || $.prv.$.ns[tmp.pointer].fx.prv.$.__fx__.inherit===true){
						$.prv.$.ns[tmp.pointer].fx.$=FX.$.__fx__;
						$.prv.$.ns[tmp.pointer].fx.prv=FX;
						FX.$.__fx__.ns=$.prv.$.ns[tmp.pointer];
					}else{FX.$.__fx__.ns={id:tmp.pointer};}

					// < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <
					if(
						FX.$.__fx__.config.inherit &&
						($.prv.$.stream[sid].id!=$.prv.$.stream[sid].origin)
					){
						branch=new $.prv.stream(null, sid);
						$.prv.$.stream[sid].$.origin=sid;
						sid=branch.$.id;
					}
					if($.prv.$.stream[sid].$.execute.indexOf(FX.$.__fx__.ns.id)<0){

							var	pos=$.prv.$.stream[sid].$.execute.indexOf(FX.$.__fx__.ns.id);

						if(pos>0){	$.prv.$.stream[sid].$.execute.splice(pos, 0, FX.$.__fx__.ns.id);
						}else{	$.prv.$.stream[sid].$.execute.splice($.prv.$.stream[sid].$.execute.indexOf(ns_cur), 0, FX.$.__fx__.ns.id);}
					}
					// > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >
					//console.log('stream-id: '+sid+'@'+$.prv.$.stream[sid].$.origin+' | fx-quantity: '+($.prv.$.tm_process.length+1)+'/'+(lfx+1)+'\nnamespace: '+FX.$.__fx__.ns.id+'');

					sid_cur=sid;

					/* ! ! ! variable tmp loses significance ! ! ! */
					// reverse multiple use() request's
					FX.$.__fx__.cb.req.slice().reverse();

					/* requested use-bundle routine */
					while(FX.$.__fx__.cb.req.length>0){
						//console.log("-------------------------------------------------> use("+FX.$.__fx__.cb.req.length+")");

							// bundle=FX.$.__fx__.cb.req.pop();
							bundle=FX.$.__fx__.cb.req.shift();

							// if bundle empty continue
							if(!bundle){continue;}
							// original stream-id
							sid=sid_cur;

						// is bundle specific?
						if((tmp=$.pub.isTypeOf(bundle))!='Object'){
							switch(tmp){
								// array-bundle [ config | use-data ]
								case 'Array':{

									if($.pub.isTypeOf(bundle[0], Object)){
										/* if there are other types >> switch(bundle[0].type){} */
										if(bundle[0].branch){
											// origin branch (string || true => 'root')
											if(bundle[0].origin){
													if(!$.pub.isTypeOf(bundle, String)){	bundle[0].origin='root';}
												branch=new $.prv.stream(bundle[0].branch,	bundle[0].origin);
											}else{branch=new $.prv.stream(bundle[0].branch, sid);}

											sid=branch.$.id;
										}
										bundle=bundle[1];
										// if bundle object break
										if($.pub.isTypeOf(bundle, Object)){break;}

									}else if($.prv.slots.loader[bundle[0]]){
										bundle=$.prv.slots.loader[bundle[0]](bundle[1], FX.$.__fx__.ns.id); break;
									}else{bundle={}; break;}

								}
								case 'String':{bundle={use:bundle}; break;}
							}
						}
						//------------------------------------------------>
						Object.keys(bundle).map(function(key){

								tmp=$.prv.formatrix.parse_namespace(bundle[key], FX.$.__fx__.ns.id);

							// assign fx required ns
							FX.$.__fx__.cb.use.push({
								key:	key,
								ns:	tmp.pointer,
								node:	tmp.node,
								data:	tmp.data,
							});

							// namespace not exist and is not in currently pending list
							if(!$.prv.$.ns[tmp.pointer] && $.prv.$.ns_req.indexOf(tmp.pointer)==-1){

								// register namespaces to currently pending list
								$.prv.$.ns_req.push(tmp.pointer);

				// < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < < <
								$.prv.$.stream[sid].$.request.push(tmp.pointer);

								    var pos=$.prv.$.stream[sid].$.execute.indexOf(tmp.pointer);
								if(pos>0){	$.prv.$.stream[sid].$.execute.splice(pos, 0, tmp.pointer);
								}else{	$.prv.$.stream[sid].$.execute.unshift(tmp.pointer);}

				// > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > > >

								$.prv.setNamespace(tmp);
								$.prv.$.ns[tmp.pointer].src=$.prv.formatrix.get_src(tmp.pointer);
							}
							/*
							}else if($.prv.$.ns[tmp.pointer]){
								console.log(tmp.pointer);
							}
							*/

						});
					}
				}

				if(!$.prv.$.stream[sid_org].$.status){
					$.prv.$.stream[sid_org].start();
				}else if($.prv.$.stream[sid_org].$.branches.length==0){
					$.prv.$.stream[sid_org].$.tm.routine();
				}else{$.prv.$.stream[sid_org].close();
				}

			},
			callnode:function(lvl, pub, args){
				lvl=lvl.split(/[.](?![^\(]*\))/);
				// go through the nodes
				for(var j=0;j<lvl.length; j++){


					// is a function()?
					var func=(/(.*?)\((.*?)\)/).exec(lvl[j]);
					if(func){lvl[j]=func[1];}


					//
					if(typeof pub[lvl[j]]==='undefined'){
						//var uni=Object.getOwnPropertyDescriptor(tmp, lvl[j]);
						//Object.defineProperty(tmp, lvl[j], uni);

						pub[lvl[j]]=null;
						j=lvl.length;
					// check: merge function }else if(func]){tmp=tmp[func[1]].apply(tmp, func[2].split(','));
					}else if(func && $.pub.isTypeOf(pub[func[1]], Function)){
						if(func[2].length!=0){
							func[2]=func[2].replace(/'/g,'"').split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)(?![^\(\[]*[\]\)])/);


							func[2].forEach(function(arg, i){
								var tmp;

								arg=arg.trim();

								if(!(tmp=parseInt(arg))){

									if(['""',"''","[]"].indexOf(arg[0]+arg.substring(arg.length-1))!=-1){
										tmp=arg.substring(1, arg.length-1);
										try {
											tmp=JSON.parse(tmp);
										}catch(e){
											// tmp is a string
										}
									}
								}
								func[2][i]=tmp;
							});
						}else{func[2]=[];}

						if(args){func[2]=func[2].concat(args);}

							pub=pub[func[1]].apply(pub, func[2]);
					}else{	pub=pub[lvl[j]];}

					return pub;
				}
			},
			// fx callback routine
			callback:function($this){
				//console.log('%c===['+$this.$.__fx__.ns.id+']===','color:#ff9;');

					var role, tmp;

				//------------------------------------------------------------> use
				while($this.$.__fx__.cb.use.length>0){

						// get role
						role=$this.$.__fx__.cb.use.shift();
						// get required namespace
						tmp=$.prv.$.ns[role.ns].fx.pub;

					// is just an node in namespace required?
					if(role.node && tmp && $.pub.isTypeOf(tmp, Object)){
						tmp=$.prv.callnode(role.node, tmp);
					}

					$this[role.key]=tmp;
				}


				if($this.$.__fx__.config.parent){
					$this.$.__fx__.ns.parent=$this.$.__fx__.config.parent;
				}


				//------------------------------------------------------------> pub
				while($this.$.__fx__.cb.pub.length>0){

						role=$this.$.__fx__.cb.pub.shift();

					switch($.pub.isTypeOf(role)){

						// array: inheritance logic [0] string (comma separated $.use keys [1] object/class/function
						case 'Array':{

								var key; tmp={};
								role[0]=role[0].split(',');

							for(var j = 0; j < role[0].length; j++){
								key=role[0][j].trim();
								if(typeof $this[key]=='object'){
									tmp=$.pub.object.merge(tmp, $this[key]);
								}else{tmp[key]=$this[key];}
							};
							if(typeof role[1]=='function'){
								if(!(key=role[1].name)){key='main';}
								tmp[key]=role[1];
							}else{tmp=$.pub.object.merge(tmp, role[1]);}

							role=tmp;
						}
						case 'Function':{

							if(role.name!='__return'){

								if(role.name){
									tmp=role.name;
								}else if($.pub.isTypeOf(role, Function, true)){
									tmp='class';
								}else{tmp='function';}

								if($this.$.__fx__.cb.pub.length==0){
									$.prv.$.ns[$this.$.__fx__.ns.id].fx.pub=role;
									$this[tmp]=role;

									break;
								}else{

									var	role_new={};

										role_new[tmp]=role;
										role=role_new;
								}

							}else{
								if($.pub.isTypeOf(role, Function, true)){
									role=role();
								}else{role=new role();}
							}
						}
						// object
						case 'Object':{
							//						console.log("---> "+$.pub.isTypeOf(role));
							Object.keys(role).map(function(key){

									var uni=Object.getOwnPropertyDescriptor(role, key);

								if(!$this[key]){
									Object.defineProperty($this, key, uni);
								}else{
									$this[key].value=$.pub.object.merge($this[key].value, uni.value);
								}

								if(!$.prv.$.ns[$this.$.__fx__.ns.id].fx.pub[key]){
									Object.defineProperty($.prv.$.ns[$this.$.__fx__.ns.id].fx.pub, key, uni);
								}else{
									//console.log("###############################################################");
									//console.log($.prv.$.ns[$this.$.__fx__.ns.id].fx.pub[key].value);
									//console.log(uni.value);

									$.prv.$.ns[$this.$.__fx__.ns.id].fx.pub[key].value=$.pub.object.merge(
										$.prv.$.ns[$this.$.__fx__.ns.id].fx.pub[key].value,
										uni.value
										//,{test:999999}
									);
								}

							});

						break;}
						// functions or classes
						default:{
							if(role.name){
								$this[role.name]=role;
							}else{$this=role;}
						break;}
					}
				}

				if($.prv.slots.cb.test){
					$.prv.slots.cb.test.call($this);
				}
				//------------------------------------------------------------> run
				while($this.$.__fx__.cb.run.length>0){
					   role=$this.$.__fx__.cb.run.shift();
					if(role.prototype){new role();}else{role();}
				}
				//------------------------------------------------------------> win
				if($this.$.__fx__.cb.win){
					$this.$.__fx__.cb.win.forEach((data) => {
						if($.pub.isTypeOf(data, Function)){
							data=data.call($this);
						}
						if($.pub.isTypeOf(data, Object)){

								let tmp;

							Object.keys(data).forEach(function(key){
								let tmp=$.pub.object.path(key, data[key]);
								root[key]=tmp[key];
							});
						}
					});
				}
			},
			//============================================================>
		},
		pub:{
			// value, object, special
			isTypeOf:function(v, o, s){

					if(s){s=v;}
					v=Object.prototype.toString.call(v).slice(8,-1);

				if(s){
					if(v.substr(0,4)=='HTML'){v='DomObject';}
					if(v=='Function'){
						if(/^class\s/.test(Function.prototype.toString.call(s))){
							v='Class';
						}else{v='Function';}
					}
				}
				// object or string 'object.name'
				if(o){return v === (o.name || o);
				}else{return v;}
			},
			object:{
				test:function(){},
				merge:function(){

						var	list=Array.prototype.slice.call(arguments),
							base=list.shift() || {};

					list.forEach(function(args){

						for(var k in args){

							if(	($.pub.isTypeOf(args[k], Object)) &&
								($.pub.isTypeOf(base[k], Object))
							){
									var d=Object.getOwnPropertyDescriptor(args, k);

								if( d && (d.get || d.set)){
									Object.defineProperty(base, k, d);
								}else{base[k]=$.pub.object.merge(base[k], args[k]);}
							}else{	base[k]=args[k];}
						}
					});

					return base;
				},
				path:function(path, value, obj, split='.'){
					if(!obj){obj={};}
					if($.pub.isTypeOf(path, String)){path=path.split(split);}
					if(path.length > 0){
						(function(o,p,v){
							for(var i=0; i<p.length-1; i++){
								o=o[p[i]]=o[p[i]] || {};
							}
							if($.pub.isTypeOf(v, Object)){
								o[p[p.length-1]]=$.pub.object.merge(o[p[p.length-1]], v);
							}else{o[p[p.length-1]]=v;}

						})(obj, path, value);
					}else{
						if($.pub.isTypeOf(v, Object)){
							obj=$.pub.object.merge(obj, value)
						}else{obj=value;}
					}
					return obj;
				},
				convert:function(obj, pre){

						var	p,k,v,str = [];

					for(p in obj){
						if(obj.hasOwnProperty(p)){
							k=pre ? pre + "[" + p + "]" : p;
							v=obj[p];
							str.push((v !== null && typeof v === "object") ?
								$.pub.object.convert(v, k) :
								encodeURIComponent(k) + "=" + encodeURIComponent(v));
						}
					}
					return str.join("&");
				},
			},
			request:{
				get:function(req){

						if(!$.pub.isTypeOf(req, Object)){
							req={};
						}

						req = req || {};
						req.url=req.url ? req.url : $.prv.$.config.ajax.url
						req.url=req.url+'?'+$.pub.object.convert(req.data);

					var	xhr=new XMLHttpRequest();

					xhr.open(
						req.method ? req.method : $.prv.$.config.ajax.method,
						req.url,
						req.async ? req.async : $.prv.$.config.ajax.async,
						req.user ? req.user : null,
						req.pswd ? req.pswd : null
					);

					if(req.headers){
						Object.keys(req.headers).forEach(function(key){
							xhr.setRequestHeader(key, req.headers[key]);
						});

					}

					xhr.onreadystatechange=function(e){

						if(!req.response){
							if(this.readyState == 4 && this.status == 200){
								req.success ? req.success.call(this) : null;
							}else if(this.readyState == 4){
								req.error ? req.error.call(this) : null;
							}
						}else{
							req.response.call(this);
						}
					};
					xhr.send(null);
				}
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
			uri:{
				parse_query:function(v){
					return v ? JSON.parse('{"' + decodeURI(v).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : null;
				}
			},
		},
	};
	//************************************************************************>
	//========================================================================> formatrix
	$.prv.formatrix=function(cfg){

			Fx.config=null;

			// push this. in current transmission-process list
			$.prv.$.tm_process.push(this);

			// settings
			this.$={

				__fx__:{
					// namespace reference object
					ns:null,
					// fx configuration
					config:{
						// predefine fx-namespace (e.g.:multi-units loading)
					   // ns:null,

						// inheritable
						inherit:false,
						// extensible
						extend:true,
					},
					// callbacks
					cb:{
						req:[], use:[],

						pub:[],
						run:[],

						win:[],
					},
				},
			};

		//------------------------------------------------------------------> all except base
		if($.prv.$.instance!==null){

			this['cmd']=$.prv.$.ns['sys://formatrix-'+$.prv.$.ver].fx.pub;

			if(typeof cfg=='string'){
				this.$.__fx__.config.ns=cfg;
			}

			// override default config
			this.$.__fx__.config=cfg=$.pub.object.merge(this.$.__fx__.config, cfg);
		}
		//------------------------------------------------------------------> unit
		if($.prv.$.instance){									//console.log('%cfx: unit','color:#070;');

			if($.prv.$.core.slots.fxInit){
				$.prv.$.core.slots.fxInit.call(this);
			}

			// set corebranch ns to base
			if(!$.prv.$.core.id && $.prv.$.core.ns!==null && cfg.ns==$.prv.formatrix.parse_namespace($.prv.$.core.ns).pointer){
				this.$.base=$;
			}
			//$.prv.slots.ns.finalize.call(this, id);
		//------------------------------------------------------------------> init
		}else if($.prv.$.instance===false){							//console.log('%cfx: init','color:#070;');
			// init config
			if(cfg.init){
				// merge main configurations
				$.prv.$.config=$.pub.object.merge($.prv.$.config, cfg.init);
				// if locator change build modifiers (web://, lib://, app://, ..)
				if(cfg.init.locator){$.prv.setModifiers();}
			}

			this.$.__fx__.ns=$.prv.formatrix.parse_namespace($.prv.$.ns['sys://formatrix-'+$.prv.$.ver].init, null)

			$.prv.$.init={
				ns:this.$.__fx__.ns
			};

			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~> set core if not null
			if(cfg.core!==null){							// set slot?
				//console.log('%cfx: core setup','color:#fa0;');
				// check if is core-config

				if(typeof cfg.core!='object'){cfg.core={};}
				// fx-core setup
				if(!cfg.core.ns){
					if(cfg.core.use){
						cfg.core.use=cfg.core.use.trim().split('-');
						if(!cfg.core.use[1]){
							cfg.core.use[1]=$.prv.$.core.default[cfg.core.use[0]];
						}
					}else{cfg.core.use=['pando', $.prv.$.core.default.pando]}
					cfg.core.ns='lib://webons.io/fx/core/'+cfg.core.use[0]+'/'+cfg.core.use[1]+'/';
				}
				// merge core setup
				$.prv.$.core=$.pub.object.merge(
					$.prv.$.core,
					cfg.core,
					{
						// ?
						id:null,
						status:false,
					}
				);
				this.use([
					{
						branch:'core',
					},
					{core:cfg.core.ns}
				]);
			}

			$.prv.$.instance=true;
		//------------------------------------------------------------------> base
		}else{											//> console.log('%cfx: base','color:#070;');
			/* // TODO: check root string?
					if(cfg.getAttribute('root')=='false'){return false;}
			*/
			this.$.__fx__.config.inherit=true;

			// set base-namespace
			var NS=$.prv.$.ns['sys://formatrix-'+$.prv.$.ver]={
				id:		'sys://formatrix-'+$.prv.$.ver,


				fx:{
					$:	this.$.__fx__,
					prv:	this,
					// check
					pub:	$.pub, // {}
				},

				sid:		new $.prv.stream('root').$.id,
				src:		cfg.src,

				//
				status:	true,
				// use init
				init:		cfg.getAttribute('root-ini'),
			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -> prepare
			// if min ecmas-ver rewrite shortcut modifies
			if($.prv.$.es_ver=$.prv.slots.base.esver()){
				$.prv.$.ns_scm['~?']='_es'+$.prv.$.es_ver;
			}
			// build modifiers (web://, lib://, app://, ..)
			$.prv.setModifiers();
			// unified Dom Objects (isTypeOf)
			window['DomObject']={name:'DomObject'}
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -> required polyfills
			if(!String.name){

				String.name='String';
				Array.name='Array';
				Object.name='Object';
				Function.name='Function';

				if(!document.baseURI){
					document.__defineGetter__("baseURI", function(){
						var base=document.getElementsByTagName('base');
						if(base.length > 0){
							return base[0].getAttribute('href');
						}else{return /^.*\//.exec(document.URL)[0];}
					});
				}
				if(!(function f(){}).name){
					Object.defineProperty(Function.prototype, 'name', {
						get:function(){
							var name=(this.toString().match(/^function\s*([^\s(]+)/) || [])[1];
							Object.defineProperty(this, 'name', {value:name});
							return name;
						}
					});
				}
			}
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -> loading of initial data
			// use
			if(NS.init){
				this.use([
					{
						branch:'init',
					},
					NS.init
				]);
			}
			// pub
			this.pub($.pub);
			// run
			this.run(function(){
				$.pub.dom.ready(function(){
					$.pub.dom.execute_scripts("fx/namespace");
				});
			});
			// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ->
			$.prv.$.instance=false;
			// trigger transmission finishing process
			$.prv.tm_finishing(NS.sid, NS.id);
		}
	}

	$.prv.formatrix.prototype={
		ns:null,
		use:function(b){this.$.__fx__.cb.req.push(b);},	// use required bundle
		pub:function(n){this.$.__fx__.cb.pub.push(n);}, // public nodes
		prv:{},							// private nodes

		//
		run:function(r){this.$.__fx__.cb.run.push(r);}, //
		win:function(n){this.$.__fx__.cb.win.push(n);},
		ini:function(e){

				if(!e){return false;}

			if(e instanceof Fx){
				e.$.__fx__.ns.childs.push(this)

				if(!this.$.__fx__.config.ns){
					this.$.__fx__.config.ns=e.$.__fx__.ns.id+'|'+e.$.__fx__.ns.childs.length;
				}
				this.$.__fx__.config.parent=e.$.__fx__.ns.id;
				$.prv.tm_finishing(null, e.$.__fx__.ns.id);
			}

		},

	};
//*****************************************************************************************

	$.prv.test={
		_funcs:{

		},
	};
	$.prv.formatrix.prototype.__defineSetter__("exe", function(cb){

		if($.pub.isTypeOf(cb, Function, true)){

			if(!$.prv.test._funcs[cb.name]){
				$.prv.test._funcs[cb.name]={};
			}

			let zzz=cb.call($.prv.test._funcs[cb.name], 1111111);

			console.log($.prv.test._funcs.css);
			console.log($.prv.test._funcs.css.arguments);

			console.log(zzz);

		}else{
		}

		if(cb.name==''){
			console.log('exe..');
		}

		if(!this.$.__fx__.cb[cb.name]){
			this.$.__fx__.cb[cb.name]=[];
		}
		this.$.__fx__.cb[cb.name].push(cb);
	});


	//========================================================================> formatrix/static
	$.prv.formatrix.parse_namespace=function(str, cur, ext){

			if(!str){return false;} var tmp;

		//------------------------------------------------------------------> local change in string
		if(cur && (tmp=/^(.\/)|^(..\/)/.exec(str))){
			// same directory ./
			if(tmp[0]=='./'){
				if(cur.slice(-1)!='/'){cur=cur.substr(0,cur.lastIndexOf('/')+1);}
				str=str.substring(2);
			// higher directory ../
			}else{
				while((str.indexOf('../')>-1) && (cur.lastIndexOf('/')>-1)){
					cur=cur.substr(0, cur.lastIndexOf('/', cur.lastIndexOf('/')-1)+1);
					str=str.substring(3);
				}
			}
			str=cur+str;
		}
		//------------------------------------------------------------------> extract uri data & nodes
		// TODO: optimze?

		// todo ?
		if(tmp=str.match(/[^~][?&].*$/)){

			tmp=[
				str.substr(0, str.length-tmp[0].length+1).split('::'),
				str.substr(str.length-tmp[0].length+2).split('#')
			];
		}else{



			if(tmp=str.match(/::|#/)){
				tmp=[
					[
						str.substr(0, tmp.index),
						(tmp[0]=='::') ? (
							str.substr(tmp.index+2).split('#')[0]
						) : null,
					],
					[
						null,
						(str.indexOf('#')!=-1) ? str.substr(str.indexOf('#')+1) : null

					]
				];

			}else{
				tmp=[[str, null],[null, null]];
			}
		}

		try {
			// namespace
			if(!ext){

					// TODO: check > without scheme://
					let locator=/\s*(.*?)\s*:\/\//.exec(str);

				return {

					locator:	locator ? locator.pop() : null,
					//pointer:	tmp[0][0] + ((tmp[0][0].slice(-1)=='/') ? 'index' : ''),
					pointer:	tmp[0][0].replace(/index($|.js$)/, ""),

					node:		tmp[0][1],
					//data: 	str.split(/\?(.*)#/)[1],
					data: 	tmp[1][0]
							? JSON.parse('{"' + decodeURI(tmp[1][0]).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}')
							: null,

					hash:		tmp[1][1],
				};
			// external files
			}else{

				return {
					// file source
					src:$.prv.formatrix.get_src(str),
					// file extesion
					ext:/\.\w*(?=($|\?|#))/.exec(str)[0].substr(1),
				}
			}
		}catch(e){return e;}
	}
	//========================================================================>
	$.prv.formatrix.get_src=function(str, hq){
		// TODO: full uri?
		var tmp;

		// modifier list
		Object.keys($.prv.$.ns_scm).forEach(function(key){
			str=str.replace(key, $.prv.$.ns_scm[key]);
		});
		//------------------------------------------------------------------> split query
		str=str.split("?");

		// short-cuts
		if(str[0].slice(-1)=='/'){str[0]+='index';}

		if(!/\.(js|css)$/.test(str[0])){str[0]+='.js';}

		if(!/\s*(.*?)\s*:\/\//.test(str[0])){
			str[0]=document.baseURI+str[0];
		}
		// hide query?
		if(!hq){
			return str[0]+(str[1] ? '?'+str[1] : '');
		}else{return str[0];}


	}

	// TODO: core
	$.prv.formatrix.call=function(ns, ns_cur){
		ns=$.prv.formatrix.parse_namespace(ns, ns_cur);
		if($.pub.isTypeOf(ns, Error)){return null;}

		if($.prv.$.ns[ns.pointer]){
			var args=Array.prototype.slice.call(arguments, 1);

			return $.prv.callnode(ns.node, $.prv.$.ns[ns.pointer].fx.pub, args);

		}else{

			//load
		}
	}

	//========================================================================> stream
	$.prv.stream=function(id, origin){

		// create id if not exist
		if(!$.pub.isTypeOf(id, String)){id='$'+Date.now();}
		// if stream exist return registered stream-object
		if($.prv.$.stream[id]){return $.prv.$.stream[id];}
		// register stream
		$.prv.$.stream[id]=this;

		//console.log('%cnew stream: '+id+'@'+origin,'color:#77F;');

		this.$={
			// stream id
			id:id,
			// transmission object
			tm:null,
			// stream status
			status:null,
			// origin stream
			origin:origin,
			// requested namespace-list
			request:[],
			// executed namespace-list
			execute:[],
			//----------------------------------------------------------->
			// branches
			branches:[],

			tmc:0,

		}
		if(origin){
			$.prv.$.stream[origin].$.branches.push(id);
		}
		// create transmission object
		this.$.tm=new $.prv.tm(this);
	},
	$.prv.stream.prototype={
		start:function(){
			//console.log('-------------------------------------------------------------------> fx: stream.start('+this.$.id+')');
			this.$.status=true;
			this.$.tm.routine();
		},
		close:function(){
			//console.log('-------------------------------------------------------------------> fx: stream.xxxxx('+this.$.id+')');

			if(this.$.branches.length!=0){
				$.prv.$.stream[this.$.branches.shift()].start();
			}else if(this.$.request.length!=0){
				this.$.tm.routine();
			}else{

					var ns;

				while((ns=this.$.execute.shift())!==undefined){
					if($.prv.$.ns[ns].fx.prv){
						$.prv.callback($.prv.$.ns[ns].fx.prv);
					}
				}
				//console.log('-------------------------------------------------------------------> fx: stream.close('+this.$.id+')');
				if(this.$.origin){

					$.prv.$.stream[this.$.origin].close();

				}
				//this.close();
			}
		}
	},
	//========================================================================> transmissions
	$.prv.tm=function(stream){
		this.stream=stream;

	},
	$.prv.tm.prototype={

		routine:function(){
			//console.log('-------------------------------------------------------------------> fx: transmission.routine('+this.stream.$.id+')');

				var ns, $this=this;

			while((ns=this.stream.$.request.shift())!==undefined){

					$this.stream.$.tmc++;

				if($.prv.slots.tm[$.prv.$.ns[ns].ns.locator]){
					$.prv.slots.tm[$.prv.$.ns[ns].ns.locator].call($this, $.prv.$.ns[ns].ns);
				}else{$.prv.slots.tm.default.call($this, ns, $.prv.$.ns[ns].src);}
			}
			if($this.stream.$.tmc==0){
				$this.stream.close();
			}
		}
	},

	$.pub.fx=$.prv.formatrix;
	//************************************************************************>
	//************************************************************************>
	//************************************************************************>

			root['Fx']=$.prv.formatrix;
		new	root['Fx'](document.querySelector('script[root]'));

})(window);
