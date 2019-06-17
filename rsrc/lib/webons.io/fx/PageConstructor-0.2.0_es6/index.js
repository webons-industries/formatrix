/*!
*  formatrix 0.4.2 (http://formatrix.org)
*  >> PageConstructor 0.2.0
*
*  Copyright (c) webons.industries
*
*  This source code is licensed under the MIT license found in the
*  LICENSE file in the root directory of this source tree.
*
*////***************************************************************************>
(()=>{

  let $=new Namespace(Namespace.bundle('[lib]webons.io/fx/PageConstructor','0.2.0')+"~?/", {

		parent:'[lib]webons.io/fx/0.4.2/',
		called:'page',
  	});
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
			polyfill:	Namespace.bundle('[lib]webons.io/fx/PageConstructor')+'/polyfill',
		});
	}
	//************************************************************************> join
	$.use({
		evt:Namespace.bundle('[lib]webons.io/fx/PageConstructor')+'~?/events::generator',
		lib:Namespace.bundle('[lib]webons.io/fx/PageConstructor')+'~?/library',
	});
	//************************************************************************>
	$.pub({
		//==================================================================> instance
		get setup(){if($.prv.$.instance){return null;}else{ return {
			start:(config)=>{

				// override config
				$.prv.$.config=$.fx.object_merge($.prv.$.config, config);

				// events
				$.prv.$.events=new $.evt({
					singleton:true,
				});
				$.prv.$.events.register('window::scroll', window, 'scroll');
				$.prv.$.events.register('window::resize', window, 'resize');

				$.fx.dom.ready(()=>{

					// init library
					$.lib.init();

				});

				$.fx.pointer.register($.fx.pointer.current($.$.id)['called'], $.lib.$.provided);

			$.prv.$.instance=false;},
			//------------------------------------------------------------>
			close:()=>{

				//	$.fx.dom.execute_scripts("fx/namespace");

			$.prv.$.instance=true;},
		}}},
		//==================================================================> register
		$:{
			get prefix(){return $.prv.$.config.prefix;},
			get events(){return $.prv.$.events;},
		},
		//==================================================================> passthroughs
		get dom(){		return $.fx.dom;},
		get api(){		return $.lib.api;},
		get tools(){	return $.lib.tools;},
		//==================================================================>
	});
	//************************************************************************>
})();
