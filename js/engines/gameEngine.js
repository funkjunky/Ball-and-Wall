//Contains the classes:
//	Game
//	Options
//	vector2
//Relies on the following files:
//	ball.js
// box2dPersonal (maybe)
// box2d library (maybe)

	var debuggr = {};
	var _engine_ = {};

	function Engine(_canvas)
	{
		_engine_ = this;
		var self = this;
		//Member Variables

		//initiate everything to 0. Constructor sets values.

		//System Variables
		this.ticker = 0;
		this.debuggr = 0;
		
		//Engines plugged into the gameEngine
		this.physics = 0;
		this.graphics = 0;
		this.events = 0;

		//screens
		this.screens = {};
		this.currentScreen = 0;
		this.overlayScreens = []; //an array of screen keys, NOT screens.
		
		//Game Engine options.
		this.options = 0;

		//the container we are running the game in.
		this.container = 0;

		//

		//called at the end of the class.
		this.constructor = function(_canvas)
		{
			this.container = _canvas;

			this.options = new Options(this);

			//physics engine
			this.physics = this.options.physics = new Box2dPhysics();
			//this.physics = this.options.physics = new MyPhysics();

			//graphics engine.
			this.graphics = this.options.graphics = 
				new CanvasEngine(_canvas, this.options.scale);
			//this.graphics = this.options.graphics = 
			//	new DOMGraphicsEngine(_canvas.parentElement, this.options.scale);

			//event listener
			this.events = this.options.events = this.getNewDefaultEventEngine();
			//necessary for the engine, because the default is paused for screens.
			this.events.unpauseAll();
			
			//This is a sandboxing issue... during production, comment this out
			//that will disable th debugger, and take away the reference to a
			//global variable.
			this.debuggr = debuggr;
		};
		//called after the constructor, but before.... ummm... the main loop?
		//TODO: shouldn't need the screen param. If currentScreen is not set, then don't update or draw anything.
		this.init = function(screenName)
		{
			this.physics.init();
			this.switchScreenTo(screenName);

			//I pass this to mainLoop, to maintain context with mainLoop.
			this.lastUTC = this.getUTC();
			this.ticker = setInterval(this.mainLoop
												, this.options.intervalSpeed, this);

			//set up pausing. Currently we pause on any keyboard input.
			//Note: you can only catch keydown if you make canvas focusable.
			this.events.addEvent("keydown", function(e, thisEngine)
				{
					if(e.keyCode == 27)
					{
						if(thisEngine.isPaused())
							thisEngine.unpauseGame();
						else
							thisEngine.pauseGame();
					}
				}, this);
		};

		//eventually this will be an engine member function.
		this.isPaused = function ()
		{
			return this.ticker == 0;
		};
	
		//this loses context with timers. so instead i pass this.
		//myself = this
		this.lastUTC = 0;
		this.mainLoop = function(myself)
		{
				var nowUTC = myself.getUTC();
				var diffUTCinSeconds = (nowUTC - myself.lastUTC)/1000;
				diffUTCinSeconds *= myself.options.gameSpeed;
				myself.lastUTC = nowUTC;
				debuggr["mainLoop"] 
					= "diff passed to update: " + diffUTCinSeconds;
				if(myself.overlayScreens.length == 0)
					myself.screens[myself.currentScreen].update(diffUTCinSeconds);
				else
					myself.screens[peek(myself.overlayScreens)]
								.update(diffUTCinSeconds);
	
				myself.graphics.clear();
				myself.screens[myself.currentScreen].draw(myself.graphics);
debuggr["mainloopddd"] = "overlay screens open: "+myself.overlayScreens.length+"\n";
				for(var i=0; i != myself.overlayScreens.length; ++i)
					myself.screens[myself.overlayScreens[i]].draw(myself.graphics);

				document.getElementById("debug").innerHTML = "Debug:<br />";
				for(message in myself.debuggr)
					document.getElementById("debug").innerHTML 
						+= myself.debuggr[message] + "<br />";
				for(message in myself.debuggr)
					myself.debuggr[message] = "";
		};

		//TODO: rename to pauseEngine
		this.pauseGame = function()
		{
			clearInterval(this.ticker);
			this.ticker = 0;
			if(this.overlayScreens.length == 0)
				this.screens[this.currentScreen].events.pauseAll();
			else
				this.screens[peek(this.overlayScreens)].events.pauseAll();
		};
	
		this.unpauseGame = function()
		{
			this.lastUTC = this.getUTC();
			if(this.overlayScreens.length == 0)
				this.screens[this.currentScreen].events.unpauseAll();
			else
				this.screens[peek(this.overlayScreens)].events.unpauseAll();
			this.ticker = setInterval(this.mainLoop
					, this.options.intervalSpeed, this);
		};

		//unix time stamp
		this.getUTC = function()
		{
			var date = new Date();

			return Date.UTC(date.getFullYear(),
									date.getMonth(),
									date.getDay(),
									date.getHours(),
									date.getMinutes(),
									date.getSeconds(),
									date.getMilliseconds());
		};

		this.getNewDefaultEventEngine = function() 
		{
			return new DOMEventListener(this.container);
		};

		this.addScreen = function(screenName, screen)
		{
			this.screens[screenName] = screen;
		};

		this.removeScreen = function(screenName)
		{
			delete this.screens[screenName];
		};

		this.switchScreenTo = function(screenName)
		{
			//pauseAll on current screen events.
			//TODO: check against screens instead, and throw if not in them.
			if(this.currentScreen != 0)
				this.screens[this.currentScreen].events.pauseAll();
			this.currentScreen = screenName;
			//unpauseAll on new screen events.
			this.screens[this.currentScreen].events.unpauseAll();
		};

		this.openOverlay = function(screenName)
		{
				  //TODO: overlay screens are ugly as fuck. They should just hold a reference of the screen so I don't need to do this crap.
			if(this.overlayScreens.length != 0)
				this.screens[peek(this.overlayScreens)].events.pauseAll();
			else
				this.screens[this.currentScreen].events.pauseAll();

			this.overlayScreens.push(screenName);
			//A hack to stop the current event to propogate to create a loop with a new screen going back to the hold screen, etc.
			//(see: pausing)
			setTimeout(function() {
				self.screens[peek(self.overlayScreens)].events.unpauseAll();
			}, 1);
		};

		this.closeOverlay = function()
		{
			this.screens[this.overlayScreens.pop()].events.pauseAll();
			if(this.overlayScreens.length == 0)
				setTimeout(function() {
					self.screens[self.currentScreen].events.unpauseAll();
				}, 1);
		};

		this.GetScreen = function(text)
		{
			return this.screens[text];
		};

		this.constructor(_canvas);
	}

	function vector2(leftt,topp)
	{	
		this.left = leftt;
		this.top = topp;
	}

	//this object represents all of the exposed attributes of the
	//game engine.
	function Options(engine)
	{
		this.scale = 0;

		//unused yet... eventually I'll have the speed regulated...
		//at that point this will be useful... should be in scale with
		//60 fps
		this.gameSpeed = 0;

		//useful attributes of the engine
		this.physics = 0;
		this.graphics = 0;
		this.events = 0;
		
		//low level stuff
		//this is the exact value the interval uses
		this.intervalSpeed = 0;	
		
		this.constructor = function(engine)
		{	
			this.scale = 0.5;
			this.gameSpeed = 1; 
			//50 frames per second (1000ms)
			this.intervalSpeed = 1000/50;	
			//FUTURE: When I'm willing to do interpolation to save framerate
			//I'll implement this along with ticks and remove passing
			//gametime to update.
			//this.updateSpeed = 1000/25;
		};
			
		this.constructor(engine);
	}


function PauseEngine() {
	_engine_.pauseGame();
}

function peek(arr) {
	return arr[arr.length-1];
}
