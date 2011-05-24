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

		//The game using this engine.
		this.game = 0;

		//

		//called at the end of the class.
		this.constructor = function(_canvas)
		{
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
			this.events = this.options.events = new DOMEventListener(_canvas);
			
			//This is a sandboxing issue... during production, comment this out
			//that will disable th debugger, and take away the reference to a
			//global variable.
			this.debuggr = debuggr;
		};
		//called after the constructor, but before.... ummm... the main loop?
		this.init = function(_game)
		{
			this.physics.init();
			this.game = _game;
			this.screens["play"] = this.game;
			this.currentScreen = "play";

			//I pass this to mainLoop, to maintain context with mainLoop.
			this.lastUTC = this.getUTC();
			this.ticker = setInterval(this.mainLoop
												, this.options.intervalSpeed, this);

			//set up pausing. Currently we pause on any keyboard input.
			//Note: you can only catch keydown if you make canvas focusable.
			this.events.addEvent("keydown", function(e, thisEngine)
				{
					if(thisEngine.isPaused())
						thisEngine.unpauseGame();
					else
						thisEngine.pauseGame();
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
				for(var i=myself.overlayScreens.length-1; i >= 0; --i)
					myself.screens[myself.overlayScreens[i]].draw(myself.graphics);

				document.getElementById("debug").innerHTML = "Debug:<br />";
				for(message in myself.debuggr)
					document.getElementById("debug").innerHTML 
						+= myself.debuggr[message] + "<br />";
				for(message in myself.debuggr)
					myself.debuggr[message] = "";
		};

		this.pauseGame = function()
		{
			clearInterval(this.ticker);
			this.ticker = 0;
		};
	
		this.unpauseGame = function()
		{
			this.lastUTC = this.getUTC();
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
