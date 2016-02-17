Theme.set({
	BaseFocus: {
		styles: {
			backgroundColor: 'rgba(3,138,224,.5)'
		}
	}
});
// Include your views
include('Javascript/Views/StartView.js');

// Init application with view config
MAF.application.init({
	views: [
		{ id: 'view-Apps', viewClass: StartView }
	],
	defaultViewId: 'view-Apps',
	settingsViewId: null
});
