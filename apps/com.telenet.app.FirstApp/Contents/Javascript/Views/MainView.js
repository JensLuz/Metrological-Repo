var MainView = new MAF.Class({
	ClassName: 'MainView',

	Extends: MAF.system.FullscreenView,

	createView: function () {		// called when view is opent for the first time
		var view = this,
		
		buttons = [
			{ label: $_('Subscriptions'), view: 'view-SlideCarouselView' },
			{ label: $_('Redeem Vouchers'), view: 'view-SlideCarouselView' }
/* 			{ label: $_('Control Grid'), view: 'view-ControlGridView' },
			{ label: $_('Element Grid'), view: 'view-ElementGridView' },
			{ label: $_('Horizontal Grid'), view: 'view-HorizontalGridView' },
			{ label: $_('Vertical Grid'), view: 'view-VerticalGridView' },
			{ label: $_('Slide Carousel'), view: 'view-SlideCarouselView' } */
		];
		
		var TitleText = new MAF.element.Text({
			label: $_('TV-Shop'),
			styles:{
				width: view.width,
				height: 100,
				fontSize: 60,
				anchorStyle: 'center',
				color: '#FFBF00'
			}
		}).appendTo(view);

		// Create a list of buttons based on an array and
		// set guid for keeping focus state on previous view
		buttons.forEach(function (button, i) {
			// Generate a unqiue name for the view.controls and the guid
			var id = 'myButton' + i;
			view.controls[id] = new MAF.control.TextButton({
				guid: id,
				theme: false, // Remove default theme
				label: button.label,
				styles: {
					height: 80,
					width: 400,
					//vOffset: 150 + (i * 100),
					//hOffset: (view.width - 400) / 2,
					hOffset: (view.width) / 2,
					borderRadius: 10
				},
				textStyles: {
					fontSize: 35,
					anchorStyle: 'center'
				},
				events: {
					onFocus: function () {
						this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
					},
					onBlur: function () {
						this.setStyle('backgroundColor', null);
					},
					onSelect: function (event) {
						MAF.application.loadView(button.view);
					}
				}
			}).appendTo(view);
		});
	},
	
	updateView: function () {		// called when view is navigated to (not for the first time)
		var view = this;
	}
});
