((Namespace)=>{

  let $=new Namespace("[app]scripts~?/examples/pubObject");
	//************************************************************************>
	$.pub({
		aFunction(){
			console.log('pubObject:aFunction');
		},
		aClass:class {
			constructor(){
				console.log('pubObject:aClass');
			}
		},
		aObject:{

			value:'pubObject:aObject.value',

			aFunction(){
				console.log('pubObject:aObject.aFunction');
			},
		},
	});
//************************************************************************>
})(fx.namespace);
