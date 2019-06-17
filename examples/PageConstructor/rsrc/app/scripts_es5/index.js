'use strict';

(function () {

	var $ = new Namespace('[app]scripts~?/', {

		init: {
			config: {
				locator: {
					app: './rsrc/app/',
					lib: '../../rsrc/lib/'
				}
			},
			// init-preloads
			use: ['[lib]webons.io/fx/PageConstructor-0.2.0~?/']
		}
	});
	//************************************************************************> join
	$.use({
		page: '[lib]webons.io/fx/PageConstructor-0.2.0~?/'
	});
	//************************************************************************> autorun
	$.run(function () {
		console.log("%c---[app/index]---", "color:#99a;");
		$.page.setup.start();

		console.log($);
		console.log($.page);

		$.page.setup.close();
	});
	//************************************************************************> public
	$.pub({
		get page() {
			return $.page;
		},
		init: function init() {
			return 'hello world';
		}
	});
	//************************************************************************>
})();