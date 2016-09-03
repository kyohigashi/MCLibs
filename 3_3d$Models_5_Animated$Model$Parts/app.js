// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
	baseUrl: 'lib',
	paths: {
		app: '../app',
		jquery: '../lib/jquery/jquery.mobile-1.3.2.min',
		vex: '../lib/vex/dist/vex.combined'
	}
});
requirejs(['app/main']);
requirejs(['vex'], function(vex) {
	vex.defaultOptions.className = 'vex-theme-os'
});