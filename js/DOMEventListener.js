function DOMEventListener(container)
{
	this.container = 0;
	this.eventListeners = 0;

	this.constructor = function(container)
	{
		this.container = container;
		this.eventListeners = [];
	};

	//pass any additional parameters as deemed necessary.
	//this.addEvent("click", foo, param1, param2, param3);
	this.addEvent = function(type, callback)
	{
		var finalcb = 0;

		if(arguments.length >= 3)
		{
			var additionalArgs = Array.prototype.slice.call(arguments, 2);
			finalcb = function()
			{
				callback.apply(this.container, additionalArgs);
			};
		}
		else
			finalcb = callback;

		this.container.addEventListener(type, finalcb, false);

		var currentIndex = this.eventListeners.length;
		this.eventListeners[currentIndex] = {type: type, callback: callback};

		return currentIndex;
	};

	//returns the  number of events registered, after the removal... just
	//'cause i can.
	this.removeEvent = function(currentIndex)
	{
		this.container.removeEventListener(
			this.eventListeners[currentIndex].type,
			this.eventListeners[currentIndex].callback,
			false);

		return this.eventListeners.splice(currentIndex,1).length;
	};

	this.constructor(container);
}
