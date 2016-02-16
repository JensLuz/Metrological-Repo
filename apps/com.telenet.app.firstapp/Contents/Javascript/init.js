// Include your views
include('Javascript/Views/StartView.js');

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-StartView', viewClass: StartView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-StartView', // Declare what view to be loaded when opening the app
	settingsViewId: 'view-About' // Declare what view is opened when a used loads the settings
});
