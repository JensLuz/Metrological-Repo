// Include your views
include('Javascript/Views/MenuView.js');

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-Menu', viewClass: MenuView },
		{ id: 'view-About', viewClass: MAF.views.AboutBox } // Use standard About view
	],
	defaultViewId: 'view-Menu', // Declare what view to be loaded when opening the app
	settingsViewId: 'view-About' // Declare what view is opened when a used loads the settings
});
