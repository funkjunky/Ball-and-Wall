function DOMEventListener(container)
{
	this.container = 0;
	this.eventListeners = 0;
	this.customEventsCBs = {};
	this.customEvents;

	this.constructor = function(container)
	{
		this.container = container;
		this.eventListeners = [];

		//setup the custom events.
		this.customEvents = {
			swipe: new Swipe(container),
		};

		//setup the custom events callbacks arrays.
		for(i in this.customEvents)
			this.customEventsCBs[i] = [];
	};

	//pass any additional parameters as deemed necessary.
	//this.addEvent("click", foo, param1, param2, param3);
	this.addEvent = function(type, callback)
	{
		var finalcb = 0;

		if(arguments.length >= 3)
		{
			var additionalArgs = Array.prototype.slice.call(arguments, 2);
			finalcb = function(e)
			{
				//concat additionalArgs to arguments.
				for(var i=0; i!= additionalArgs.length; ++i)
					arguments[arguments.length++] = additionalArgs[i];

				callback.apply(this.container, arguments);
			};
		}
		else
			finalcb = callback;

		if(typeof this.customEvents[type] == "undefined")
			this.container.addEventListener(type, finalcb, false);
		else {
			this.customEvents[type].addCallback(finalcb);
		}

		var currentIndex = this.eventListeners.length;
		this.eventListeners[currentIndex] = {type: type, callback: callback};

		return currentIndex;
	};

	//returns the  number of events registered, after the removal... just
	//'cause i can.
	this.removeEvent = function(currentIndex)
	{
		if(typeof this.customEvents[this.eventListeners[currentIndex].type]
				  == "undefined")
			this.container.removeEventListener(
				this.eventListeners[currentIndex].type,
				this.eventListeners[currentIndex].callback,
				false);
		else
			this.customEvents[type].removeCallback
				(this.eventListeners[currentIndex].callback);
	};

	this.constructor(container);
}
