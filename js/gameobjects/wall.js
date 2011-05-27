function Wall(coords, isVert, game)
{
	var Dirs = Directions.dirs;

	//TODO: rid... see other TODOs
	this.game = {};

	this.startCoords = {};
	this.isVert = 0;

	this.onFinishFnc = 0;

	this.speed = 4; //measured in squares complete per second.

	//some constants to take away random numbers everywhere.
	this.DONE = 1; //this indicates the progress on a square is done.
	this.INVALID = -2; //this indicates the element for progress is inv.

	this.finished = false;

	//wall arrays
	this._wall = [];

	//square in progress, location
	this._endPos = [];

	//square in progress... progress
	this._endProg = [];
	this._squareDoneFlag = 0;	//used to indicate a square finished.

	//indicates the end is done.
	this._endDone = [];

	//TODO: find a replacement for passing the entire game. Preferably nothin
	this.constructor = function(coords, isVert, game) {
		//Initialize the end arrays.
		this._endPos = [0,0,0,0];
		this._endProg
			= [this.INVALID, this.INVALID, this.INVALID, this.INVALID];
		this._endDone = [false, false, false, false];

		//set the starting coords of the wall.
		//TODO: I would really like to see this code cleaned up to the point where their is only one variable set.
		this.game = game;
		this.startCoords = coords;
		this.onFinishFnc = getWallFinishFnc();
		if(this.game.squareIsEmpty(this.startCoords))
		{
				  var coordRect = createPhysRectFromCoords(this.startCoords, this.game);
					this.game.addDynTile(this.startCoords.x, this.startCoords.y, 'w');
				  var id = this.game.physics.addSquare(coordRect);
		  var self = this;
				  this._wall.push(this.startCoords);

				  this.isVert = isVert;
				  
				  //Set the start positions of each end of the wall.
				  if(this.isVert) {
					  this._endPos[Dirs.UP]
						  = this._addDirToVec(this.startCoords, Dirs.UP);
					  this._endPos[Dirs.DOWN]
						  = this._addDirToVec(this.startCoords, Dirs.DOWN);
				  } else {
					  this._endPos[Dirs.LEFT]
						  = this._addDirToVec(this.startCoords, Dirs.LEFT);
					  this._endPos[Dirs.RIGHT]
						  = this._addDirToVec(this.startCoords, Dirs.RIGHT);
				  }
		}
		else this.finished = true;
	};

	this.setFinishFnc = function(fnc) {
		this.onFinishFnc = fnc;
	};

	this.update = function(gameTime) {
		if(this.finished == true)
			return;
		if(this.isVert) {
			var up = this.extensionUpdate(gameTime, Dirs.UP);
			var down = this.extensionUpdate(gameTime, Dirs.DOWN);
			if(up && down)
				this.finished = true;
		} else {
			var right = this.extensionUpdate(gameTime, Dirs.RIGHT);
			var left = this.extensionUpdate(gameTime, Dirs.LEFT);
			if(left && right)
				this.finished = true;
		}
		//this will only be reachable the first time finished becomes true.
		if(this.finished)
			//This should perhaps be more robust, allowing a different this,
			//or atleast additional parameters.
			this.onFinishFnc.call(this);
	};

	this._addDirToVec = function(v2, dir) {
		return addVecs(v2, Directions.vecs[dir]);
	};

	this.prevEvtID = {};
	this.prevEvtID[Dirs.UP] = false;
	this.prevEvtID[Dirs.DOWN] = false;
	this.prevEvtID[Dirs.RIGHT] = false;
	this.prevEvtID[Dirs.LEFT] = false;
	this.extensionUpdate = function(gameTime, dir)
	{
			//very redundent... clean up.
			if(!this.game.squareIsEmpty(this._endPos[dir]))
				this._endDone[dir] = true;
		//only if this end isn't finished yet.
		//TODO: if this is the case, we should somehow unregister the wall
		//			from the update cycle.
		if(this._endDone[dir])
			return true;
		else
		{
			this.iterateSquare(gameTime, dir);
			while(this._squareDoneFlag >= this.DONE) {
				//decrement the number of square done flags we've handled.
				--this._squareDoneFlag;
				//add the completed square to the walls.
				var coordRect = createPhysRectFromCoords(this._endPos[dir], this.game);
				this.game.addDynTile(this._endPos[dir].x, this._endPos[dir].y, 'w');
				var id = this.game.physics.addSquare(coordRect);
var self = this;

				//this means that only the green squares trigger the event!
				if(this.prevEvtID[dir] !== false)
					this.game.physics.removeObjEvent(this.prevEvtID[dir]);
				this.prevEvtID[dir]
					= this.game.physics.addObjEvent(id, getWallBrokenFnc());
				this._wall.push(this._endPos[dir]);
				//step the end position in the direction dir.
				this._endPos[dir] = this._addDirToVec(this._endPos[dir], dir);
				//If the next square is not empty, then consider this end done.
				if(!this.game.squareIsEmpty(this._endPos[dir])) {
					this._endDone[dir] = true;
					this.game.physics.removeObjEvent(this.prevEvtID[dir]);
					return true;
				}
			}
			return false;
		}
		//DO NOT PUT ANYTHING HERE. It is unreachable.
	}

	this.iterateSquare = function(gameTime, dir) {
		this._endProg[dir] += gameTime * this.speed;
		debuggr["dir"+dir] = "dir "+dir+" prog: " + this._endProg[dir];
		//incase their is epic lag, I use while...
		while(this._endProg[dir] >= 1)
		{
			--this._endProg[dir];
			++this._squareDoneFlag;
		}
	};

	this.draw = function(graphics) {
			  //TODO: using game here is bad too... find better way.
		for(var i=0; i != this._wall.length; ++i) { 
			graphics.drawRect(this.game.blockWidth*this._wall[i].x,
									this.game.blockHeight*this._wall[i].y,
									this.game.blockWidth,
									this.game.blockHeight,
									new RGBA(255,0,0,0.5));
		}
	
		var Dirs = Directions.dirs;

		if(this.isVert) {
			graphics.drawRect(this.game.blockWidth*this._endPos[Dirs.UP].x,
									this.game.blockHeight*this._endPos[Dirs.UP].y,
									this.game.blockWidth,
									this.game.blockHeight,
									new RGBA(0,255,0,this._endProg[Dirs.UP]));
			graphics.drawRect(this.game.blockWidth*this._endPos[Dirs.DOWN].x,
									this.game.blockHeight*this._endPos[Dirs.DOWN].y,
									this.game.blockWidth,
									this.game.blockHeight,
									new RGBA(0,255,0,this._endProg[Dirs.DOWN]));
		} else {
			graphics.drawRect(this.game.blockWidth*this._endPos[Dirs.LEFT].x,
									this.game.blockHeight*this._endPos[Dirs.LEFT].y,
									this.game.blockWidth,
									this.game.blockHeight,
									new RGBA(0,255,0,this._endProg[Dirs.LEFT]));
			graphics.drawRect(this.game.blockWidth*this._endPos[Dirs.RIGHT].x,
									this.game.blockHeight*this._endPos[Dirs.RIGHT].y,
									this.game.blockWidth,
									this.game.blockHeight,
									new RGBA(0,255,0,this._endProg[Dirs.RIGHT]));
		}
	};

	this.constructor(coords, isVert, game);
}

var _wallFinishFnc = function(){};
function setWallFinishFnc(fnc)
{
	_wallFinishFnc = fnc;
};
function getWallFinishFnc(fnc)
{
	return _wallFinishFnc;
};

var _wallBrokenFnc = function(){};
function setWallBrokenFnc(fnc)
{
	_wallBrokenFnc = fnc;
};
function getWallBrokenFnc()
{
	return _wallBrokenFnc;
};

var Directions = {
	dirs: {
		UP: 0,	//this is an index representing a direction in:
		DOWN: 1,	//this._endPos
		LEFT: 2,	//this._endProg
		RIGHT: 3,
	},
	vecs: [
		new b2Vec2(0,-1), //normalized vectors in dirs
		new b2Vec2(0, 1),
		new b2Vec2(-1, 0),
		new b2Vec2(1, 0),
	],
};

//this is totally out of place...
function addVecs(v1, v2)
{
	return new b2Vec2(v1.x + v2.x, v1.y + v2.y);
}

function createPhysRectFromCoords(coords, game)
{
	return new Rectangle(coords.x*game.blockWidth + (game.blockWidth/2),
								coords.y*game.blockHeight + (game.blockHeight/2),
								game.blockWidth,
								game.blockHeight);
}
