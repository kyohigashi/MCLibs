// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
	baseUrl: 'lib',
	paths: {
		app: '../core/app',
		jquery: '../core/lib/jquery/jquery-1.9.1.min',
		vex: '../core/lib/vex/dist/vex.combined',
	}
});
requirejs(['app/main'], function(main) {
	main.init();
});
