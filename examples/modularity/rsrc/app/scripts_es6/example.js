(()=>{

  let $=new Namespace("app://scripts~?/example");
	//************************************************************************> private
	$.prv={
		$:{
			var:'hello world',
		}
	};
	//************************************************************************> public
	$.pub({
		HelloWorld(){
			return $.prv.$.var;
		},
		direct(list=''){
			console.log('direct call: '+list);
		},
		lvl1:{
			lvl2:{
				lvl3(){console.log('lvl1.lvl2.lvl3()');}
			},
			lvl2b(val=''){
				if(val==1){
					return {
						lvlA:{
							lvlB(){console.log('lvl1.lvl2b(1).lvlA.lvlB()');}
						},
						abc:{
						},
					}
				}else{
					return {
						lvlX(){console.log('lvl1.lvl2b(2).lvlX()');}
					}
				}
			}
		}
	});
	//************************************************************************>
})();
