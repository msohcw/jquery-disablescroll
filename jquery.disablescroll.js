console.log("test")
/**
 * $.disablescroll
 * Author: Josh Harrison - aloofdesign.com
 *
 * Disables scroll events from mousewheels, touchmoves and keypresses.
 * Use while jQuery is animating the scroll position for a guaranteed super-smooth ride!
 */

;(function($) {

	"use strict";


	// Privates

	var instance;

	var _handleKeydown = function(event) {
		for (var i = 0; i < this.opts.scrollEventKeys.length; i++) {
			if (event.keyCode === this.opts.scrollEventKeys[i]) {
				event.preventDefault();
				return;
			}
		}
	};

	var _handleWheel = function(event) {
		event.preventDefault();
		// var dD = this.opts.disabledDirections; //alias
		// if (event.type === "mousewheel"){
		// 	//webkit
		// 	if(event.originalEvent.wheelDeltaY){
		// 		if(event.originalEvent.wheelDeltaY > 0 && dD[0]) event.preventDefault(); // up
		// 		if(event.originalEvent.wheelDeltaY < 0 && dD[1]) event.preventDefault(); // down
		// 	}
		// 	if(event.originalEvent.wheelDeltaX){
		// 		if(event.originalEvent.wheelDeltaX > 0 && dD[2]) event.preventDefault(); // left
		// 		if(event.originalEvent.wheelDeltaX < 0 && dD[3]) event.preventDefault(); // right
		// 	}
		// }
	};

	function addIfNotExist(array,item){
		if($.inArray(array,item) === -1) array.push(item);
	}


	// The object

	function UserScrollDisabler($container, options) {

		// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
		// left: 37, up: 38, right: 39, down: 40

		//disabledDirections up, down, left, right

		this.opts = $.extend({
			handleKeys : true,
			scrollEventKeys : [32, 33, 34, 35, 36, 37, 38, 39, 40],
			disabledDirections : [1,1,1,1]
		}, options);
		
		this.$container = $container;
		this.$document = $(document);

		this.disable();

	}

	UserScrollDisabler.prototype = {
		
		disable : function() {
			var t = this;

			t.$container.on("mousewheel.UserScrollDisabler DOMMouseScroll.UserScrollDisabler touchmove.UserScrollDisabler", function(event) {
				_handleWheel.call(t, event);
			});

			if(t.opts.handleKeys) {

				if(t.opts.disabledDirections) {
					var dD = t.opts.disabledDirections; //alias
					if (dD[0]){
						addIfNotExist(t.opts.scrollEventKeys,33); //pageup
						addIfNotExist(t.opts.scrollEventKeys,36); //home
						addIfNotExist(t.opts.scrollEventKeys,38); //pageup
					}
					if (dD[1]){
						addIfNotExist(t.opts.scrollEventKeys,32); //spacebar
						addIfNotExist(t.opts.scrollEventKeys,34); //pagedown
						addIfNotExist(t.opts.scrollEventKeys,35); //end
						addIfNotExist(t.opts.scrollEventKeys,40); //down
					}
					if (dD[2]) addIfNotExist(t.opts.scrollEventKeys,37); //left
					if (dD[3]) addIfNotExist(t.opts.scrollEventKeys,39); //right
				}

				t.$document.on("keydown.UserScrollDisabler", function(event) {
					_handleKeydown.call(t, event);
				});
			}
		},
		
		undo : function() {
			var t = this;
			t.$container.off(".UserScrollDisabler");
			if(t.opts.handleKeys) {
				t.$document.off(".UserScrollDisabler");
			}
		}
		
	};


	// Plugin wrapper for object

	$.fn.disablescroll = function(method) {

		// If calling for the first time, instantiate the object and cache in this closure.
		// Plugin can therefore only be instantiated once per page.
		// Can pass options object in through the method parameter.
		if( ! instance && (typeof method === "object" || ! method)) {
			instance = new UserScrollDisabler(this, method); // this = jquery collection to act on = $(window), hopefully!
		}

		// Instance already created, and a method is being explicitly called, e.g. .disablescroll('undo');
		else if(instance && instance[method]) {
			instance[method].call(instance);
		}

		// No method called explicitly, so assume 'disable' is intended.
		// E.g. calling .disablescroll(); again after a prior instantiation and undo.
		else if(instance) {
			instance.disable.call(instance);
		}

	};

})(jQuery);