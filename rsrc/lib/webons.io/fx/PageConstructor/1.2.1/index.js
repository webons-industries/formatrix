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
(config => {

  let $=new Fx(config);
	//************************************************************************>
	$.prv=({
		//==================================================================> register
		$:{	instance:null,
			//------------------------------------------------------------>
			config:{
				// fx-css prefix
				prefix:'fx_',
			},
			// main events-obj
			events:{},
		},
	});
	if(!Array.from){
		$.use({
			polyfill:'./polyfill',
		});
	}
	//************************************************************************> join
	$.use({
		evt: './events::generator',
		lib: './library',
	});
	//************************************************************************>
	$.pub({
		//==================================================================> instance
		get setup(){if($.prv.$.instance){return null;}else{ return {
			start:(config)=>{

				// override config
				$.prv.$.config=$.cmd.object.merge($.prv.$.config, config);

				// events
				$.prv.$.events=new $.evt({
					singleton:true,
				});




				$.prv.$.events.register('window::scroll', window, 'scroll');
				$.prv.$.events.register('window::resize', window, 'resize');

				$.cmd.dom.ready(()=>{

					// init library
					$.lib.init($.prv.$.events);

				});
				//$.cmd.pointer.register($.cmd.pointer.current($.$.id)['called'], $.lib.$.provided);

			$.prv.$.instance=false;},
			//------------------------------------------------------------>
			close:()=>{

				//	$.cmd.dom.execute_scripts("fx/namespace");

			$.prv.$.instance=true;},
		}}},
		//==================================================================> register
		$:{
			get prefix(){return $.prv.$.config.prefix;},
		},
		//==================================================================> passthroughs
		get dom(){		return $.cmd.dom;},
		get api(){		return $.lib.api;},
		get tools(){	return $.lib.tools;},
		get cookies(){	return $.lib.cookies;},
		//==================================================================>
	});

})(Fx.config ?? null);
