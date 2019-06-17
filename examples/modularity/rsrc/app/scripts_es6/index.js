(()=>{

  let $=new Namespace("[app]scripts~?/",{

		// init settings
		init:{
			// override config
			config:{
				// locator paths
				locator:{
					app:'./rsrc/app/',
					lib:'../../rsrc/lib/',
				},
			}
		},
	});
	//************************************************************************> join
	$.use({

		// namespace
		example:	'[app]scripts~?/example',
		// function
		HelloWorld:	'[app]scripts~?/example::HelloWorld',
		// function(value)
		direct:	'[app]scripts~?/example::direct(aaa,bbb,ccc)',
		// mixed levels
		lvl1:		'[app]scripts~?/example::lvl1.lvl2.lvl3()',
		lvl2:		'[app]scripts~?/example::lvl1.lvl2b(1).lvlA.lvlB()',
		lvl3:		'[app]scripts~?/example::lvl1.lvl2b(2).lvlX()',

	});
	//************************************************************************> autorun
	$.run(function(){

		// $.HelloWorld() == $.example.HelloWorld()
		console.log($.HelloWorld());

		//extend live: still failed!
		/*
		$.use({test: '[app]scripts~?/extra::test'});
		$.run(function(){
			console.log('loaded XYZ');
			console.log($.test());
		})
		*/
	});
	//************************************************************************> private
	$.prv=({
		// register
		$:{

		},
		// function / classes / levels ..
		example(){
		},
	});
	//************************************************************************> public
	$.pub({
		get examplesHelloWorld(){
			return $.HelloWorld();
		},
		cross_call(){
			return 'cross call';
		},
	});
//************************************************************************>
})();
