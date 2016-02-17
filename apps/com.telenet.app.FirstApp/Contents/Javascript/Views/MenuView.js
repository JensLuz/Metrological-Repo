// Create a class and extended it from the MAF.system.SidebarView
var MenuView = new MAF.Class({
	ClassName: 'MenuView',

	Extends: MAF.system.SidebarView,

	createView: function () {
		// Reference to the current view-first view the app will show
		var view = this;
	},

	// After create view and when returning to the view
	// the update view is called
	updateView: function () {
		// Reference to the current view
		var view = this;
	}
});
