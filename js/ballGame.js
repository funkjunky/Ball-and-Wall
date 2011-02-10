//requires:
//	gameEngine.js
//	ball.js
//	maybe box2d... i unno.

//FYI no global variables... except the debugger... but that is obvious.

	function initGame(canvas)
	{
		var theEngine = new Engine(canvas);
		var game = new Game(theEngine.options);		
		game.init();
		theEngine.init(game);
	}

	//takes the engineOptions, so the game knows what it's playground is.
	function Game(engineOptions) {
		this.level = 0;		//The level you start with
		this.stats = 0;		//eventually I wanna store the entire path the ball 
							//took in here.
		this.map = 0;		//current map state (so where are dividers, etc.)
		this._physMap = 0;

		this.balls = 0;		//he main focus of the game.
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


		this.constructor = function(engineOptions)
		{
			//some nice variables to know.
			this.numOfBlocksWide = 15;
			this.numOfBlocksHigh = 15;
			this.blockWidth 
					= (engineOptions.graphics.container.width 
							/ engineOptions.scale)
								/ this.numOfBlocksWide;
			this.blockHeight 
					= (engineOptions.graphics.container.height 
							/ engineOptions.scale)
								/ this.numOfBlocksHigh;

			engineOptions.events.addEvent("mousemove", function(thisGame)
				{
					var v2 = thisGame.getGridCoord(event.offsetX, event.offsetY);
					debuggr["mmove"] = "cursor coord: " +v2.x+", "+v2.y;
				}, this);

			this.map = new Array();

			this.balls = new Array();
			this.squares = new Array();

			this.physics = engineOptions.physics;
		};

		this.init = function()
		{
			this.clearMap();
			//squares are added by setMapToDefault() including physics
			this.setMapToDefault();

			this.balls[0] = new Ball(new b2Vec2(160, 200)
										, 10
										, new b2Vec2(80, 80));
			this.physics.addBall(this.balls[0]);
		};

		this.setMapToDefault = function() {
			//top and bottom outer walls.
			for(var i=0; i!=this.numOfBlocksWide; ++i)
			{
				this.addTile(i, 0, 'b');
				this.addTile(i, this.numOfBlocksWide - 1, 'b');
			}
			//left and right outer walls.
			for(var k=0; k!=this.numOfBlocksHigh; ++k)
			{
				this.addTile(0, k, 'b');
				this.addTile(this.numOfBlocksHigh - 1, k, 'b');
			}
			//random square obstacles
			this.addTile(9, 10, 'b');
			this.addTile(12, 13, 'b');
			this.addTile(6, 3, 'b');
			this.addTile(2, 4, 'b');
			this.addTile(8, 1, 'b');
			this.addTile(7, 9, 'b');
		};

		this.clearMap = function() {
			//fil the tile map with open space.
			for(var i=0; i!=this.numOfBlocksWide; ++i) {
				this.map[i] = new Array();	
				for(var k=0; k!=this.numOfBlocksHigh; ++k)
					this.map[i][k] = 'o';
			}

			//clear the physical map.
			this._physMap = [];
		};

		this.addTile = function(x, y, tile)
		{
			this.map[x][y] = tile;
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
			for(i = 0; i!=this.numOfBlocksWide; ++i)
				for(k = 0; k!=this.numOfBlocksHigh; ++k)
					if(this.map[i][k] == 'b')
						graphics.drawRect
							(i*this.blockWidth, k*this.blockHeight, 
								this.blockWidth, this.blockHeight, 
								new RGBA(0,0,0,0.5));
		};

		this.getGridCoord = function(left, top)
		{
			return new b2Vec2(parseInt(left/this.numOfBlocksWide)
										, parseInt(top/this.numOfBlocksHigh));
		}

		this.makeVerticalWall = function() {
		};

		this.makeHorizontalWall = function() {
		};

		this.update = function(gameTime) {
			for(var i=0; i!=this.balls.length; ++i)
				this.balls[i].update(gameTime);
		};

		this.draw = function(graphics) {
			this.drawMap(graphics);
			for(var i=0; i!=this.balls.length; ++i)
				this.balls[i].draw(graphics);
			for(var i=0; i!=this.squares.length; ++i)
				this.squares[i].draw(graphics);
		};

		this.constructor(engineOptions);
	}
