/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
 /**
 * @class MAF.element.SlideCarousel
 * @extends MAF.element.Container
 * * All cells are based on descendants of MAF.element.SlideCarouselCell
 * * cellCreator() is a required method that returns a cell with no data.
 * * cellUpdater() is a required method that will update a cell with data.
 * @example new MAF.element.SlideCarousel({
 *    visibleCells: 5,
 *    focusIndex: 3,
 *    orientation: 'horizontal',
 *    blockFocus: 'false',
 *    slideDuration: 0.3,
 *    cellCreator: function () {
 *       var cell = new MAF.element.SlideCarouselCell({
 *          events: {
 *             onSelect: function (event) {
 *                log('Selected', this.getDataItem());
 *             }
 *          }
 *       });
 *
 *       cell.text = new MAF.element.Text({
 *          styles: {
 *             color: 'white'
 *          }
 *       }).appendTo(cell);
 *       return cell;
 *    },
 *    cellUpdater: function (cell, data) {
 *       cell.text.setText(data.label);
 *    }
 * }).appendTo(this);
 * @config {string} [title] The new job title.
 */
 /**
 * @cfg {Number} rows Number of cells visible for the viewer.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} indicates which position is always focused.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {String} orientation Horizontal or verticale orientation of the SlideCarousel.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Boolean} blockFocus this determines whether the grid can be focus at all.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} slideDuration this determines how fast the cells will be moving to a new position.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {String} slideEase this determines with which easing cells will be moving to a new position.
 * @memberof MAF.element.SlideCarousel
 */

/**
 * @cfg {Boolean} [dynamicFocus = false] this enables focusing the other cells without sliding.
 * @memberof MAF.element.SlideCarousel
 */

/**
 * @cfg {Integer} [dynamicFocusStart = 0] this determines the threshold from the left before sliding.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Integer} [dynamicFocusEnd = 0] this determines the threshold from the right before sliding.
 * @memberof MAF.element.SlideCarousel
 */

/**
 * Fired when the data set of the grid has changed.
 * @event MAF.element.SlideCarousel#onDatasetChanged
 */
/**
 * Fired when state of the grid is updated/changed.
 * @event MAF.element.SlideCarousel#onStateUpdated
 */
 /**
  * Fired when the slide navigation is complete.
  * @event MAF.element.SlideCarousel#onSlideDone
  */
define('MAF.element.SlideCarousel', function () {
	var ParentCell = MAF.Class({
		ClassName: 'SlideCarouselParentCell',
		Extends: MAF.element.Container,

		Protected: {
			registerEvents: function (types) {
				this.parent(['navigateoutofbounds'].concat(types || []));
			},

			dispatchEvents: function (event) {
				this.parent(event);
				switch (event.type) {
					case 'navigate':
						var parent = this.grid;
						if (parent.animating || parent.config.blockFocus) {
							event.preventDefault();
							return;
						}
						parent.animating = true;
						parent.navigating = true;

						var dir = event.detail.direction,
							pos = parent.cells.indexOf(this),
							dyn = parent.config.dynamicFocus,
							fi = parent.config.focusIndex,
							start = dyn && pos === parent.config.dynamicFocusStart + 1,
							end = dyn && pos === parent.config.visibleCells - parent.config.dynamicFocusEnd,
							ds = parent.currentDataset,
							tCurrent = hasFocus(parent.cells),
							ct = tCurrent[0],
							rt = tCurrent[1];

						var withFlow = 	(parent.config.orientation === 'vertical' && (dir === 'down' || dir === 'up')) ||
										(parent.config.orientation === 'horizontal' && (dir === 'left' || dir === 'right'));
						var againstFlow = 	(parent.config.orientation === 'vertical' && (dir === 'left' || dir === 'right')) ||
											(parent.config.orientation === 'horizontal' && (dir === 'down' || dir === 'up'));
						var plus = dir === 'right' || dir === 'down';

						if (withFlow) {
							ct += (plus ? 1 : -1);
							if (ds[ct] !== null) {
								event.preventDefault();
								if (ds[ct].items[rt] === undefined) {
									for (var i = rt; i >= 0; i--) {
										if (ds[ct].items[i]) {
											rt = i;
											parent.cells[ct].subCells[rt].focus();
											break;
										}
									}
								} else {
									parent.cells[ct].subCells[rt].focus();
								}
							}
							if ((end && (dir === 'right' || dir === 'down')) ||
								(start && (dir === 'left' || dir === 'up')) ||
								(!dyn && pos === fi)) {
								parent.shift(dir, pos);
							} else {
								parent.animating = false;
							}
						} else if (againstFlow) {
							rt += (plus ? 1 : -1);
							if ((ds[ct].items[rt] === undefined && !dyn) || parent.cells[ct].subCells[rt] === undefined) {
								parent.animating = false;
								parent.manageBounds(false);
								parent.fire('onNavigateOutOfBounds', event.detail);
								return;
							} else {
								event.preventDefault();
								parent.animating = false;
								parent.cells[ct].subCells[rt].focus();
							}
						} 
						parent.navigating = false;
						break;
				}
			}
		},

		config: {
			styles: {
				overflow: 'visible'
			}
		},

		initialize: function () {
			this.parent();
		},
		suicide: function () {
			delete this.grid;
			Object.forEach(this, function (key, obj) {
				if (key !== 'owner' && typeOf(obj) === 'instance' && obj.suicide && obj !== this) {
					delete this[key];
					obj.suicide();
				}
			}, this);
			this.parent();
		}
	});
	function hasFocus(cells) {
		for (var i = 0; i < cells.length; i++) {
			if (cells[i].subCells && cells[i].subCells.length > 0) {
				for (var j = 0; j < cells[i].subCells.length; j++) {
					if (cells[i].subCells[j].element.hasFocus) {
						return [i,j];
					}
				}
			}
			if (cells[i].element.hasFocus)
				return i;
		}
		return null;
	}
	function animateCells(cells, dir, parent) {
		if (cells) {
			var foc = hasFocus(cells);
			cells.forEach(function (cell, i) {
				if (cell) {
					var cd = parent.currentDataset.length,
						hOffset = (parent.config.orientation === 'horizontal') ? parent.offsets[i] : 0,
						vOffset = (parent.config.orientation === 'vertical') ? parent.offsets[i] : 0,
						end = (i === cd-1 && (dir === 'right' || dir === 'down')),
						start = (i === 0 && (dir === 'left' || dir === 'up'));
					if (end || start) {
						cell.freeze();
					}
					cell.animate({
						visible: cell.visible,
						transform: getSetting('gpu') === false ? 'translate('+hOffset+'px,'+vOffset+'px)' : 'translate3d('+hOffset+'px,'+vOffset+'px, 0)',
						duration: parent.config.slideDuration,
						timingFunction: parent.config.slideEase,
						events: {
							onAnimationEnded: function (slideAnimator) {
								slideAnimator.reset();
								if ((end || start) && !isEmpty(parent.currentDataset[i])) {
									cell.thaw();
								}

								cell.element.allowNavigation = parent.ableToNavigate(i);
								if (i === cd-1) {
									var cf = hasFocus(cells);
									if (parent.config.subCells > 1) {
										parent.setCurrent(cf[0], cf[1]);
									} else {
										parent.setCurrent(cf);
									}
									parent.animating = false;
									parent.fire('onSlideDone');
								}
							}
						}
					});
				}
			}, this);
		}
	}
	function isEmpty(obj) {
		if (obj === null)
			return true;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				return false;
			}
		}
		return true;
	}
	return new MAF.Class({
		ClassName: 'SlideCarousel',
		Extends: MAF.element.Container,
		Protected: {
			registerEvents: function (types) {
				this.parent(['navigateoutofbounds', 'scroll'].concat(types || []));
			},
			dispatchEvents: function (event, payload) {
				this.parent(event, payload);
				if (event.type === 'scroll') {
					this.element.scrollTop = 0;
					this.element.scrollLeft = 0;
					return;
				}
				if (this.animating || this.config.blockFocus) {
					event.preventDefault();
					return;
				}
				if (this.config.subCells === 1 && event.type === 'navigate') {
					if (event.defaultPrevented) {
						return;
					}
					this.navigating = true;
					this.animating = true;
					var dir = event.detail.direction,
						pos = this.cells.indexOf(this.getCurrentCell()),
						tar = pos,
						dyn = this.config.dynamicFocus,
						fi = this.config.focusIndex,
						start = dyn && pos === this.config.dynamicFocusStart + 1,
						end = dyn && pos === this.config.visibleCells - this.config.dynamicFocusEnd,
						ds = this.currentDataset;

					var withFlow = 	(this.config.orientation === 'vertical' && (dir === 'down' || dir === 'up')) ||
									(this.config.orientation === 'horizontal' && (dir === 'left' || dir === 'right'));
					var againstFlow = 	(this.config.orientation === 'vertical' && (dir === 'left' || dir === 'right')) ||
										(this.config.orientation === 'horizontal' && (dir === 'down' || dir === 'up'));
					var plus = dir === 'right' || dir === 'down';

					if (withFlow) {
						tar += (plus ? 1 : -1);
						if (ds[tar] !== null) {
							event.preventDefault();
							this.cells[tar].focus();
						}
					} else if (againstFlow) {
						this.animating = false;
						this.manageBounds(false);
						this.fire('onNavigateOutOfBounds', event.detail);
						return;
					}
					this.navigating = false;
					if ((end && (dir === 'right' || dir === 'down')) ||
						(start && (dir === 'left' || dir === 'up')) ||
						(!dyn && pos === fi)) {
						this.shift(dir, pos);
					} else {
						this.animating = false;
					}
				}
			},
			collectedPage: function (event) {
				var slider = this.retrieve('slider'),
					cell;
				switch(slider.status) {
					case 'reset':
					case 'empty':
						this.store('slider', {status: 'building'});
						this.updateCells();
						break;
					case 'focusCell':
						var index = slider.page;
						this.store('slider', {status: 'building', target: slider.page, sub: slider.sub});
						this.updateCells(index);
						break;
					case 'navigating':
						switch(slider.direction) {
							case 'up':
							case 'left':
								cell = this.cells.pop();
								cell.freeze();
								this.cells.unshift(cell);
								this.currentDataset.unshift(this.currentDataset.pop());
								this.currentDataset[0] = event.payload.data;
								this.updateCollection(this.cells[0], 0);
								break;
							case 'down':
							case 'right':
								cell = this.cells.shift();
								cell.freeze();
								this.cells.push(cell);
								this.currentDataset.shift();
								this.currentDataset.push(event.payload.data);
								this.updateCollection(this.cells[this.cells.length-1], this.currentDataset.length-1);
								break;
						}
						this.store('slider', {status: 'idle'});
						this.fire('onStateUpdated');
						animateCells(this.cells, slider.direction, this);
						break;
				}
			},
			updateCells: function (page) {
				var cellUpdater = this.config.cellUpdater,
					dataLength = this.pager.getNumPages(),
					buildFrom = this.config.focusIndex;
				this.animating = false;
				this.currentDataset = [];
				this.collection = [];
				this.page = page || 0;

				var test = (this.config.visibleCells - this.config.dynamicFocusEnd) - (this.config.focusIndex + this.config.dynamicFocusStart);
				if ((dataLength > this.config.visibleCells+2) && 
					(this.page >= dataLength - test && this.page <= dataLength-1) && 
					this.config.dynamicFocus) {
					buildFrom = this.config.visibleCells - (dataLength - this.page);
				}
				if (dataLength > 0) {
					if (dataLength === 1) {
						this.currentDataset.push(this.pager.getPage(0));
					} 
					else {
						var cellsToFill = this.config.visibleCells + 2;
						if (dataLength + 1 + buildFrom < cellsToFill) {
							cellsToFill = dataLength + buildFrom;
						}
						for(var i = 0; i < cellsToFill; i++) {
							var dif = buildFrom - i,
								difABS = Math.abs(dif),
								index = null;
							if ((difABS > dataLength-1 || dif > 0) && this.customPager) {
								var tmp = (this.page > 0) ? this.page - dif : null;
								index = (tmp === null || tmp < 0) ? null : tmp;
							} else if (difABS > dataLength-1 && !this.customPager) {
								index = 0;
							} else if (dif > 0) {
								index = (this.page !== 0) ? this.page - difABS : dataLength - difABS;
								if (index < 0) {
									index = dataLength - Math.abs(index);
								}
							} else if (dif < 0) {
								index = this.page + difABS;
								if (index >= dataLength) {
									index = !this.customPager ? index - dataLength : null;
								}
							} else {
								index = (this.page === dataLength) ? 0 : this.page;
							}
							if (index === null) {
								this.currentDataset.push(null);
							} else {
								this.currentDataset.push((this.pager.getPage(index*this.config.subCells)));
							}
							this.collection.push(index);
						}
					}
				}
				var self = this;
				if (this.config.carousel && this.cells.length && this.cells.length === this.currentDataset.length) {
					this.cells.forEach(function (cell, pos) {
						self.updateCollection(cell, pos);
					}, this);
				}
				else {
					this.freeze();
					while (this.cells.length) {
						var cell = this.cells.pop();
						if (this.config.subCells > 1) {
							while (cell.subCells.length) {
								cell.subCells.pop().suicide();
							}
							delete cell.subCells;
						}
						cell.suicide();
					}
					if (this.generateCells() > 0) {
						this.cells.forEach(function (cell, pos) {
							self.updateCollection(cell, pos);
						}, this);
					}
					this.thaw();
				}
				var state = this.retrieve('slider');
				if (state.target >= 0 && !this.config.blockFocus) {
					if(this.currentDataset.length === 1){
						buildfrom = 0;
					}
					if (state.sub !== null) {
						this.cells[buildFrom].subCells[state.sub].focus();
					} else {
						this.cells[buildFrom].focus();
					}
				}
				this.fire('onStateUpdated');
			},
			updateCollection: function (cell, pos) {
				var self = this,
					cellUpdater = self.config.cellUpdater;
				if (!isEmpty(self.currentDataset[pos])) {
					cell.thaw();
					if (self.config.subCells > 1) {
						cell.subCells.forEach(function (sc, j) {
							if (!isEmpty(self.currentDataset[pos].items[j])) {
								sc.thaw();
								cellUpdater.call(self, sc, self.currentDataset[pos].items[j]);
							} else {
								sc.freeze();
							}
						}, self);
					} else {
						cellUpdater.call(self, cell, self.currentDataset[pos].items[0]);
					}
				} else {
					cell.freeze();
				}
			},
			setCellConfiguration: function (pos, cd, or, data) {
				var cell;
				var vOffset = (or === 'vertical') ? -cd.height + pos * cd.height : 0;
				var hOffset = (or === 'horizontal') ? -cd.width + pos * cd.width : 0;
				var dims = Object.merge(cd, {
					transform: getSetting('gpu') === false ? 'translate('+hOffset+'px,'+vOffset+'px)' : 'translate3d('+hOffset+'px,'+vOffset+'px, 0)'
				});
				if (this.config.subCells > 1) {
					cell = new ParentCell({
						styles: dims
					});
					var scDims = this.getCellDimensions();
					cell.subCells = [];
					for (var i = 0; i < this.config.subCells; i++) {
						var tmp = Object.merge(scDims, {
							transform: getSetting('gpu') === false ? 'translate(' + ((or === 'vertical') ? scDims.width * i : 0) + 'px,' + ((or === 'horizontal') ? scDims.height * i : 0) + 'px)' : 'translate3d(' + ((or === 'vertical') ? scDims.width * i : 0) + 'px,' + ((or === 'horizontal') ? scDims.height * i : 0) + 'px, 0)'
						});
						var tmpCell = this.config.cellCreator.call(this).setStyles(tmp);
						tmpCell.grid = this;
						tmpCell.appendTo(cell);
						cell.subCells.push(tmpCell);
					}
				} else {
					cell = this.config.cellCreator.call(this).setStyles(dims);
				}
				cell.grid = this;
				cell.appendTo(this);
				cell.element.allowNavigation = this.ableToNavigate(pos);
				this.cells.push(cell);
			},
			generateCells: function () {
				var self = this,
					ds = self.currentDataset,
					or = self.config.orientation;
				if (ds.length > 0) {
					var cd = {
						width: (or === 'horizontal') ? Math.floor(this.width / this.config.visibleCells) : this.width,
						height: (or === 'vertical') ? Math.floor(this.height / this.config.visibleCells) : this.height
					};
					self.offsets = [];
					if (ds.length === 1) {
						self.setCellConfiguration(self.config.focusIndex, cd, or, self.currentDataset[0]);
					} else {
						ds.forEach(function (data, pos) {
							self.offsets.push((or === 'horizontal') ? -cd.width + pos * cd.width : -cd.height + pos * cd.height);
							self.setCellConfiguration(pos, cd, or, data);
						}, self);
					}
				}
				return this.cells.length;
			}
		},
		config: {
			visibleCells: 1,
			subCells: 1,
			focusIndex: 1,
			slideEase: 'ease',
			carousel: true,
			orientation: 'horizontal',
			blockFocus: false,
			render: true,
			dynamicFocus: false,
			dynamicFocusStart: 0,
			dynamicFocusEnd: 0,
			styles:{
				transform: 'translateZ(0)'
			}
		},
		initialize: function () {
			this.config.visibleCells = this.config.visibleCells || 1;
			this.config.subCells = this.config.subCells || 1;
			this.config.focusIndex = this.config.focusIndex || 1;
			this.config.orientation = this.config.orientation || 'horizontal';
			this.config.slideEase = this.config.slideEase || 'ease';
			this.config.blockFocus = this.config.blockFocus || false;
			this.config.slideDuration = this.config.slideDuration || 0.1;
			this.customPager = (this.config.carousel && this.config.carousel === true) ? false : true;
			this.inBounds = false;
			this.current = null;
			this.parent();
			this.cells = [];

			if (this.config.pager) {
				this.customPager = true;
				this.pager = this.config.pager;
				delete this.config.pager;
			} else {
				this.pager = new MAF.utility.Pager(this.config.subCells, this.config.visibleCells*this.config.subCells);
			}

			if (!this.config.carousel) {
				this.customPager = true;
			}

			this.currentDataset = [];
			this.offsets = [];
			this.animating = false;
			this.store('slider', {status: 'empty'});
			this.collectedPage.subscribeTo(this.pager, 'pageDone', this);
		},

		setVisibleCells: function (visibleCells) {
			this.config.visibleCells = visibleCells;
		},

		getVisibleCells: function () {
			return this.config.visibleCells;
		},

		setFocusIndex: function (index) {
			this.config.focusIndex = index;
		},

		getFocusIndex: function () {
			return this.config.focusIndex;
		},

		changeDataset: function (data, reset, dataLength) {
			data = data && data.length ? data : [];
			dataLength = (dataLength && (dataLength > data.length)) ? dataLength : data.length;
			this.current = null;
			this.pager.initItems(data, dataLength);
			this.store('slider', {status: 'reset'});
			this.collectPage(0);
			this.fire("onDatasetChanged");
		},

		focus: function () {
			this.manageBounds(true);
			var currentCell = this.getCurrentCell();
			if (currentCell)
				currentCell.focus();
		},

		collectPage: function (pagenum) {
			this.pager.getPage(pagenum);
		},

		ableToNavigate: function (pos) {
			if (this.config.blockFocus || isEmpty(this.currentDataset[pos]))
				return false;
			var s = this.inBounds ? 1 : 0,
				dyn = ((this.config.dynamicFocus && (pos >= (1 + this.config.dynamicFocusStart) - s && pos <= (this.config.visibleCells - this.config.dynamicFocusEnd) + s))),
				foc = pos >= this.config.focusIndex-s && pos <= this.config.focusIndex+s;
			return (dyn || foc);
		},

		manageBounds: function (bounds) {
			if (bounds === this.inBounds)
				return;
			var self = this;
			this.inBounds = bounds;
			this.cells.forEach(function (cell, pos) {
				cell.element.allowNavigation = self.ableToNavigate(pos);
			}, this);
		},

		getCellDataItem: function (c) {
			var cell = c || this.getCurrentCell();
			if (this.config.subCells > 1)
				return this.currentDataset[this.cells.indexOf(cell.owner)].items[cell.owner.subCells.indexOf(cell)];
			else
				return this.currentDataset[this.cells.indexOf(cell)].items[0];
		},

		getCellByDataIndex: function (index) {
			var cellIndex = this.collection.indexOf(Math.floor(index/this.config.subCells)),
				subCellIndex = index % this.config.subCells;
			return (cellIndex !== -1)?this.cells[cellIndex].subCells[subCellIndex] : undefined;
		},

		/**
		 * @method MAF.element.SlideCarousel#getCellDataIndex
		 * @return {Object} returns the dataIndex
		 */
		getCellDataIndex: function (c) {
			var cell = c || this.getCurrentCell();
			if (this.config.subCells > 1)
				return this.collection[this.cells.indexOf(cell.owner)]*this.config.subCells + cell.owner.subCells.indexOf(cell);
			else
				return this.collection[this.cells.indexOf(cell)];
		},

		/**
		 * @method MAF.element.SlideCarousel#getCurrentPage
		 * @return The zero-based index of the current page of data.
		 */
		getCurrentPage: function () {
			var cell = hasFocus(this.cells);
			if (cell === null)
				cell = this.getCurrent();
			return (this.collection && this.collection[(this.config.subCells > 1 ? cell[0] : cell)]) || 0;
		},

		getCurrentCell: function () {
			if (this.cells && this.cells.length) {
				var cell = this.getCurrent();
				if (this.config.subCells > 1) {
					return this.cells[cell[0]].subCells[cell[1]];
				} else {
					return this.cells[cell];
				}
			}
		},

		getCurrent: function () {
			var hf = hasFocus(this.cells);
			this.current = (!this.config.dynamicFocus || hf !== null) ? hf : this.current;
			if (this.current === null) {
				if (this.currentDataset.length === 1) {
					this.current = (this.config.subCells > 1) ? [0,0] : 0;
				} else {
					this.current = (this.config.subCells > 1) ? [this.config.focusIndex, 0] : this.config.focusIndex;
				}
			}
			return this.current;
		},

		setCurrent: function (index, row) {
			var sl = this;
			if (sl.config.subCells > 1) {
				sl.current = [index||0, row||0];
			} else {
				sl.current = index||0;
			}
			sl.manageBounds(true);
		},

		/**
		 * @method MAF.element.SlideCarousel#getPageCount
		 * @return this.mainCollection.length. The number of items in the dataset.
		 */
		getPageCount: function () {
			return this.pager.getNumPages();
		},

		/**
		 * Method for focussing a specific cell or dataitem in your grid.
		 * @method MAF.element.SlideCarousel#focusCell
		 * @param {integer} target index which as to be focused and aligned with the proper focusIndex cell.
		 */
		focusCell: function (target) {
			var sub = null;
			if (this.config.subCells > 1) {
				sub = target % this.config.subCells;
				target = (target-sub)/this.config.subCells;
			}
			if (target >= this.getPageCount()) {
				return;
			}
			this.store('slider', {status: 'focusCell', page: target, sub: sub});
			this.pager.getPage(target);
		},

		/**
		 * Attach a accessory component to this component so it can update on grid events.
		 * @method MAF.element.SlideCarousel#attachAccessory
		 * @param {Class} accessory The accessory component.
		 * @return This component.
		 */
		attachAccessory: function (accessory) {
			if (accessory && accessory.attachToSource) {
				accessory.attachToSource(this);
			}
			return this;
		},

		/**
		 * Attach multiple accessory components to this component.
		 * @method MAF.element.SlideCarousel#attachAccessories
		 * @param {Array} arguments Contains muliple accessory components.
		 * @return This component.
		 */
		attachAccessories: function () {
			Array.slice(arguments).forEach(this.attachAccessory, this);
			return this;
		},

		/**
		 * Method for animating your SlideCarousel with a different component.
		 * @method MAF.element.SlideCarousel#shift
		 * @param {String} the direction the carousel has to slide.
		 */
		shift: function (direction, origin) {
			if (this.config.orientation === 'vertical' && (direction === 'right' || direction === 'left')) {
				return;
			}
			if (this.config.orientation === 'horizontal' && (direction === 'up' || direction === 'down')) {
				return;
			}
			if (direction && this.retrieve('slider').status !== 'navigating') {
				var from = origin || this.config.focusIndex;
				this.animating = true;
				if (this.cells.length === 1) {
					return;
				}
				if (this.cells.length > 1) {
					var dataLength = this.pager.getNumPages(),
						cell;
					switch(direction) {
						case 'up':
						case 'left':
							if (isEmpty(this.currentDataset[from-1])) {
								this.fire('onNavigateOutOfBounds', {direction:direction});
								this.animating = false;
								return;
							}
							var oldStart = this.collection[0],
								newStart = this.collection.pop();
							if (oldStart === null) {
								newStart = null;
							} else if (oldStart - 1 < 0) {
								newStart = !this.customPager ? dataLength-1 : null;
							} else {
								newStart = oldStart - 1;
							}
							this.collection.unshift(newStart);
							if (newStart === null) {
								this.cells.unshift(this.cells.pop());
								this.currentDataset.pop();
								this.currentDataset.unshift(null);
								this.updateCollection(this.cells[0], 0);
								animateCells(this.cells, direction, this);
							} else {
								this.store('slider', {status: 'navigating', direction: direction});
								this.pager.getPage(newStart*this.config.subCells);
							}
							break;
						case 'down':
						case 'right':
							if (isEmpty(this.currentDataset[from+1])) {
								this.fire('onNavigateOutOfBounds', {direction:direction});
								this.animating = false;
								return;
							}
							var oldEnd = this.collection[this.collection.length-1],
								newEnd = this.collection.shift();
							if (oldEnd === null) {
								newEnd = null;
							} else if (oldEnd + 1 >= dataLength) {
								newEnd = !this.customPager ? 0 : null;
							} else {
								newEnd = oldEnd + 1;
							}
							this.collection.push(newEnd);
							if (newEnd === null) {
								this.cells.push(this.cells.shift());
								this.currentDataset.shift();
								this.currentDataset.push(null);
								this.updateCollection(this.cells[this.cells.length-1], this.currentDataset.length-1);
								animateCells(this.cells, direction, this);
							} else {
								this.store('slider', {status: 'navigating', direction: direction});
								this.pager.getPage(newEnd*this.config.subCells);
							}
							break;
					}
				}
			}
		},

		/**
		 * @method MAF.element.SlideCarousel#getCellDimensions
		 * @return {Object} With the width and height of the cells for the grid.
		 */
		getCellDimensions: function () {
			var or = this.config.orientation,
				vc = this.config.visibleCells,
				sc = this.config.subCells;
			var result = {
				width: (or === 'horizontal') ? Math.floor(this.width / vc): this.width,
				height: (or === 'vertical') ? Math.floor(this.height / vc) : this.height
			};
			if (this.config.subCells > 1) {
				return {
					width: (or === 'vertical') ? result.width / this.config.subCells : result.width,
					height: (or === 'horizontal') ? result.height / this.config.subCells : result.height
				};
			}
			return result;
		},

		suicide: function () {
			if (this.pager) this.pager.suicide();
			delete this.current;
			delete this.currentDataset;
			delete this.offsets;
			delete this.pager;
			delete this.collection;
			if (this.cells) {
				while (this.cells.length) {
					var cell = this.cells.pop();
					if (this.config.subCells > 1) {
						while (cell.subCells.length) {
							cell.subCells.pop().suicide();
						}
						delete cell.subCells;
					}
					cell.suicide();
				}
				delete this.cells;
			}
			if (this.body) {
				this.body.suicide();
				delete this.body;
			}
			this.parent();
		}
	});
});
