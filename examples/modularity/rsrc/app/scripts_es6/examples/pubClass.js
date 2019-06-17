((Namespace)=>{

  let $=new Namespace("[app]scripts~?/examples/pubClass");
	//************************************************************************>
	$.pub(class {
		constructor(){
			console.log('pubClass');
		}
	});
//************************************************************************>
})(fx.namespace);
