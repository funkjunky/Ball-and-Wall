		//member variable
		this._varChangeListeners = {};

		//in constructor
			for(member in this)
				this._varChangeListeners[member] = [];

//member functions
		this.setX = function(x)
		{
			this.x = x;
			for(var i=0; i!=this._varChangeListeners["setX"].length; ++i)
				this._varChangeListeners["setX"][i].call();
		};

		this.setY = function(y)
		{
			this.y = y;
			for(var i=0; i!=this._varChangeListeners["setY"].length; ++i)
				this._varChangeListeners["setY"][i].call();
		};

		this.addVarChangeListener = function(memberName, fnc)
		{
			var args = Array.prototype.slice.call(arguments);

			var currentIndex = this._varChangeListeners[memberName].length;

			this._varChangeListeners[memberName][currentIndex] 
				= new Listener(this, fnc, args.slice(2));

			return currentIndex;
		};
		this.removeVarChangeListener = function(memberName, index)
		{
			this._varChangeListeners[memberName].splice(index,1);
		};
/////////////

