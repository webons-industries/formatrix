((Namespace)=>{

  let $=new Namespace("[app]scripts~?/examples/pubFunction");
	//************************************************************************>
	$.pub(function(){
		console.log('pubFunction');
	});
//************************************************************************>
})(fx.namespace);
