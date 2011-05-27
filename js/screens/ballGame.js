//requires:
//	gameEngine.js
//	ball.js
//	maybe box2d... i unno.

//FYI no global variables... except the debugger... but that is obvious.

	function initGame(canvas)
	{
		var theEngine = new Engine(canvas);
		var game = new Game(theEngine.options, theEngine);		
		var startMenu = new StartMenu(theEngine);
		var gameEnd = new GameEnd(theEngine);
		var pause = new PauseScreen(theEngine);
		theEngine.addScreen("start", startMenu);
		theEngine.addScreen("gameplay", game);
		theEngine.addScreen("gameend", gameEnd);
		theEngine.addScreen("pause", pause);
		theEngine.init("start");
	}

	//takes the engineOptions, so the game knows what it's playground is.
	//TODO: remove either engineOptions or engine as a param.
	function Game(engineOptions, engine) {
		this.level = 0;		//The level you start with
			this.goalPercentage = 0; //this shoudl probably be incorporated into the level.
		this.stats = 0;		//eventually I wanna store the entire path the ball 
							//took in here.
		this.map = 0;		//current map state (so where are dividers, etc.)
		this.dynmap = 0;
		this._physMap = 0;

		this.balls = 0;		//he main focus of the game.
		this.walls = 0;
		this.squares = 0;
		this.dividers = 0;	//again, main focus of game.
		//this.objects;	//this is for later neat addins

		//some nice variables to know.
		this.numOfBlocksWide = 0;
		this.numOfBlocksHigh = 0;
		this.blockWidth = 0;
		this.blockHeight = 0;

		//this way I can add things to the physics engine fo the game engine.
		this.physics = 0;

		//this is just terrible... but I need it for getGridCoords.
		//Remove this later during clean up.
		this.graphics = 0;
		
		//every screen should probably have their own event engine... i unno
		this.events = 0;

		//TODO: reconsider... this is just for switching screens at endgame.
		//			In update.
		this.engine = 0;

		var self = this;

		this.constructor = function(engineOptions, engine)
		{
			//TODO: remove, see consideration above.
			this.engine = engine;

			//REMOVE ME WHEN YOU CAN!! (graphics)
			this.graphics = engineOptions.graphics;

			this.events = engine.getNewDefaultEventEngine();

			//some nice variables to know.
			this.numOfBlocksWide = 24;
			this.numOfBlocksHigh = 15;
			this.blockWidth 
					= this.graphics.applyScale(engineOptions.graphics.container.width)
								/ this.numOfBlocksWide;
			this.blockHeight 
					= this.graphics.applyScale(engineOptions.graphics.container.height)
								/ this.numOfBlocksHigh;

			this.events.addEvent("keyup", function(e) {
				if(e.keyCode == 80) {
					engine.openOverlay("pause");
				}
			});

			this.events.addEvent("swipe"
				, function(e, startCoords, endCoords, thisGame) {
					var isVert = Math.abs(endCoords.x - startCoords.x) < Math.abs(endCoords.y - startCoords.y);

					var coords =
						thisGame.getGridCoord(startCoords.x, startCoords.y);
					thisGame.addWall(new Wall(coords, isVert, thisGame));
				}, this);

			this.map = new Array();
			this.dynmap = new Array();

			this.balls = new Array();
			this.walls = [];
			this.squares = new Array();

			this.physics = engineOptions.physics;
		};

		this.init = function()
		{
			this.balls = [];
			this.walls = [];
			this.isolatedPercentage = 0;

			this.clearMap();
			//squares are added by setMapToDefault() including physics
			this.setMapToDefault();
			this.goalPercentage = 70;

			setWallFinishFnc(this.wallFinishedCB);
			setWallBrokenFnc(function() {
				self.engine.screens["gameend"].won = false;
				self.engine.switchScreenTo("gameend");
			});

			this.addBall(new Ball(new b2Vec2(160, 200)
									, this.blockWidth / 2 
									, new b2Vec2(160, 160)));

			this.markAvailableMap();
		};

		this.addWall = function(wall) {
			this.walls.push(wall);
		};

		this.addBall = function(ball) {
			this.balls[0] = ball;
			this.physics.addBall(ball);
		};

		this.setMapToDefault = function() {
			//top and bottom outer walls.
			for(var i=0; i!=this.numOfBlocksWide; ++i)
			{
				this.addTile(i, 0, 'b');
				this.addTile(i, this.numOfBlocksHigh - 1, 'b');
			}
			//left and right outer walls.
			for(var k=0; k!=this.numOfBlocksHigh; ++k)
			{
				this.addTile(0, k, 'b');
				this.addTile(this.numOfBlocksWide - 1, k, 'b');
			}
			//random square obstacles
			this.addTile(9, 10, 'b');
			this.addTile(12, 13, 'b');
			this.addTile(6, 3, 'b');
			this.addTile(2, 4, 'b');
			this.addTile(8, 1, 'b');
			this.addTile(7, 9, 'b');
		};

		this.markAvailableMap = function()
		{
			var Vecs = Directions.vecs;
			var Dirs = Directions.dirs;
			//copy dynmap to map. I should use jquery or something here.
			var map = [];
			for(var i=0; i!=this.dynmap.length; ++i) {
				map[i] = [];
				for(var k=0; k!= this.dynmap[i].length; ++k)
					map[i][k] = this.dynmap[i][k];
			}
			//
			var openCount = 0;
			//get ball position.
			var startPos = self.getGridCoord(self.balls[0].pos.x/2, self.balls[0].pos.y/2);
			document.getElementById("console").innerHTML += "["+startPos.x+","+startPos.y+"]: " + map[startPos.x][startPos.y] + "<br />";
			if(this.squareIsEmptyCustom(map, startPos)) {
				++openCount;
				map[startPos.x][startPos.y] = "checked";
			}
			//from ball position, spawn 4 seekers and add them an array.
			var seekers = [startPos]
			var curSeeker;
			//keep removing the last element. This is equivilent to:
			//depth-first search iterating
			var tempmax = 0;
			while(typeof (curSeeker = seekers.pop()) != "undefined")
			{
				for(i in Dirs) {
					var newSeeker = addVecs(curSeeker, Vecs[Dirs[i]]);
					if(this.squareIsEmptyCustom(map, newSeeker)){
						++openCount;
						map[newSeeker.x][newSeeker.y] = "checked";
						seekers.push(newSeeker);
						if(newSeeker.x + newSeeker.y > tempmax)
							tempmax = newSeeker.x + newSeeker.y;
					}
				}
			}
			document.getElementById("console").innerHTML += "tempmax: " + tempmax+"<br />";
			//when done, mark all other space as blocked off.
			this.markDynInaccessible(map);
			var percentageIsolated = 100 - (openCount / (this.numOfBlocksHigh * this.numOfBlocksWide) * 100);

			document.getElementById("console").innerHTML += "percent: "+percentageIsolated+"<br />";

			return percentageIsolated;
		};

		this.markDynInaccessible = function(map)
		{
			for(var i=0; i!=map.length; ++i)
				for(var k=0; k!=map[i].length; ++k)
					if(map[i][k] == "o")
						this.dynmap[i][k] = "i";//for isolated.
		};

		//takes a grid position and checks to see if the square is occupied.
		//For now it only checks the map...
		//TODO: have this check other walls too.
		this.squareIsEmpty = function(v2) {
			return this.squareIsEmptyCustom(this.dynmap, v2);
		};

		this.squareIsEmptyCustom = function(map, v2) {
			return map[v2.x][v2.y] == 'o';
		};

		this.clearMap = function() {
			//fil the tile map with open space.
			for(var i=0; i!=this.numOfBlocksWide; ++i) {
				this.map[i] = new Array();	
				this.dynmap[i] = new Array();
				for(var k=0; k!=this.numOfBlocksHigh; ++k) {
					this.map[i][k] = 'o';
					this.dynmap[i][k] = 'o';
				}
			}

			//clear the physical map.
			this._physMap = [];
		};

		this.addDynTile = function(x, y, tile)
		{
			this.dynmap[x][y] = tile;
			//this creates a plain block period... if i have more blocks in the future, I will need to add a switch case or something.
			//probably another function that grabs a Rectangle depending on the type.

			var newSquare = 
				this._physMap[this._physMap.length]
					= new Rectangle((x*this.blockWidth) + (this.blockWidth / 2),
											(y*this.blockHeight) + (this.blockHeight / 2), 
											this.blockWidth,
											this.blockHeight);

			//uncomment below line to draw the added tiles as if they were part of the map.
			//this.squares[this.squares.length] = newSquare;
			this.physics.addSquare(newSquare);
		};

		this.addTile = function(x, y, tile)
		{
			this.map[x][y] = tile;
			this.dynmap[x][y] = tile;
			//this creates a plain block period... if i have more blocks in the future, I will need to add a switch case or something.
			//probably another function that grabs a Rectangle depending on the type.
			var newSquare = 
				this._physMap[this._physMap.length]
					= new Rectangle((x*this.blockWidth) + (this.blockWidth / 2),
											(y*this.blockHeight) + (this.blockHeight / 2), 
											this.blockWidth,
											this.blockHeight);

			this.squares[this.squares.length] = newSquare;
			this.physics.addSquare(newSquare);
		};

		this.drawMap = function(graphics) {
			for(i = 0; i!=this.numOfBlocksWide; ++i) {
				for(k = 0; k!=this.numOfBlocksHigh; ++k) {
					if(this.dynmap[i][k] == 'b')
						graphics.drawRect
							(i*this.blockWidth, k*this.blockHeight, 
								this.blockWidth, this.blockHeight, 
								new RGBA(0,0,0,0.5));
					else if(this.dynmap[i][k] == 'i')
						graphics.drawRect
							(i*this.blockWidth, k*this.blockHeight, 
								this.blockWidth, this.blockHeight, 
								new RGBA(80,80,255,0.5));
				}
			}
		};

		this.getGridCoord = function(left, top)
		{
			return new b2Vec2(parseInt(this.graphics.applyScale(left)/this.blockWidth)
										, parseInt(this.graphics.applyScale(top)/this.blockHeight));
		};

		//for now, "this" refers to the wall, and self refers to the game.
		this.wallFinishedCB = function() {
			self.isolatedPercentage = self.markAvailableMap();
		};

		this.mapToString = function() {
			var str = "";
			for(var i=0; i!=this.dynmap.length; ++i) {
				for(var k=0; k!=this.dynmap.length; ++k)
					str += this.dynmap[i][k] + " ";
				str += "\n";
			}
			return str;
		};

		this.show = function() {
		};
		this.hide = function() {
		};

		this.update = function(gameTime) {
			//I don't like this here, but with screens, it needs to be
			//until I think of a better solution.
			this.physics.update(gameTime);
			//
			if(this.isolatedPercentage >= this.goalPercentage) {
				this.engine.GetScreen("gameend").won = true;
				this.engine.switchScreenTo("gameend");
			}
			for(var i=0; i!=this.balls.length; ++i)
				this.balls[i].update(gameTime);
			for(var i=0; i!=this.walls.length; ++i)
				this.walls[i].update(gameTime);
		};

		this.draw = function(graphics) {
			this.drawMap(graphics);
			for(var i=0; i!=this.balls.length; ++i)
				this.balls[i].draw(graphics);
			for(var i=0; i!=this.walls.length; ++i)
				this.walls[i].draw(graphics);
			for(var i=0; i!=this.squares.length; ++i)
				this.squares[i].draw(graphics);
		};

		this.constructor(engineOptions, engine);
	}
