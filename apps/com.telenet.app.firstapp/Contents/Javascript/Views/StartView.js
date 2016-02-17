var MainView = new MAF.Class({
	ClassName: 'StartView',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		var view = this;
		view.parent();
	},

	createView: function () {
	var view = this;
	this.elements.ourText = new MAF.element.Text({
		label: $_('Hello World!'),
		styles:{
			width: view.width,
			height: view.height,
			fontSize: 60,
			anchorStyle: 'center'
		}
	}).appendTo(view);
	},

	updateView: function () {

	}
});
