function Swipe(container) {
	
	this.callbacks = [];
	this.container = 0;
	this.startCoords = 0;
	this.mouseIsDown = false;

	this.constructor = function(container) {
		this.container = container;
		var self = this;

		this.mouseDownFnc =
			function() {
				//see if I can remove this or not.
				if(!self.mouseIsDown) {
					self.startCoords = {x: event.offsetX, y: event.offsetY};
					self.mouseIsDown = true;
				}
			};
		this.mouseUpFnc =
			function(e) {
				self.mouseIsDown = false;
				var endCoords = {x: event.offsetX, y: event.offsetY};

				for(var i=0; i!= self.callbacks.length; ++i)
					self.callbacks[i](e, self.startCoords, endCoords);
			};
	};

	this.create = function() {
		this.container.addEventListener("mousedown", this.mouseDownFnc,false);
		this.container.addEventListener("mouseup", this.mouseUpFnc, false);
	};

	this.destroy = function() {
		this.container.removeEventListener
			("mousedown", this.mouseDownFnc, false);
		this.container.removeEventListener
			("mouseup", this.mouseUpFnc, false);
	};

	this.addCallback = function(callback) {
		if(this.callbacks.length == 0)
			this.create();

		this.callbacks.push(callback);
	};

	this.removeCallback = function(callback) {
		this.callbacks.slice(this.callbacks.indexOf(callback), 1);

		if(this.callbacks.length == 0)
			this.destroy();
	};

	this.constructor(container);
}
