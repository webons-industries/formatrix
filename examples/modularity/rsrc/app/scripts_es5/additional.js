'use strict';

(function () {

	var $ = new Namespace("[app]scripts~?/additional");
	//************************************************************************> join
	$.use({

		app: '[app]scripts~?/'

	});
	//************************************************************************> autorun
	$.run(function () {

		console.log('additional: ' + $.app.examplesHelloWorld);
	});
	//************************************************************************>
})();