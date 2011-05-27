

function MyCollisions()
{
	this.balls = new Array();
	this.squares = new Array();

	this.objEvents = {};
	this.globalColEvents = {};

	this.addBall = function(ball)
	{
		this.balls.push(ball);
		//return an ID for this ball, being 2000+index, to differentiate
		//between other kinds of objects, I think...
		return 2000 + this.balls.length - 1;
	};
	this.addSquare = function(square)
	{
		this.squares.push(square);
		return 1000+this.squares.length - 1;
	};

	this.genObjEventID = -1;
	this.addObjEvent = function(objID, fnc)
	{
		if(typeof this.objEvents[objID] == "undefined")
			this.objEvents[objID] = {};

		this.objEvents[objID][++this.genObjEventID] = fnc;
		return this.genObjEventID;
	};

	this.removeObjEvent = function(evtID)
	{
		for(objID in this.objEvents)
			for(i in this.objEvents[objID])
				if(i == evtID) {
					delete this.objEvents[objID][i];
					return;
				}

		throw "JASON: (evtID: "+evtID+") tried to remove an objEvent that doesn't exist";
	};

	this.callObjEvent = function(objID)
	{
		for(i in this.objEvents[objID])
			this.objEvents[objID][i]();
	}

	this.update = function(gameTime)
	{
		for(var i=0; i!=this.balls.length; ++i)
			for(var j=0; j!=this.squares.length; ++j)
				for(var k=0; k!=this.balls[i].spokes.length; ++k)
						if(this._checkSquare
								(this.balls[i].spokes[k].left + this.balls[i].pos.x
									, this.balls[i].spokes[k].top 
											+ this.balls[i].pos.y
									, this.squares[j], i, j))
							this.callGlobalEvents(this.balls[i], SPOKEANGLE[k]);
	};

	this._checkSquare = function(left, top, square, ballID, squareID)
	{
		if((left < square.right()) && (left > square.left())
					&& (top < square.bottom()) && (top > square.top())) {
			debuggr["checkSquare"] = 
				"collide info: " +
				"(" + left + ", " + top + ") - (" 
					+ square.left() + "-" + square.right() 
					+ ", " + square.top() + "-" 
						+ square.bottom() + ")";

			if(typeof this.objEvents[1000+squareID] != "undefined")
				this.callObjEvent(1000+squareID);
			if(typeof this.objEvents[2000+ballID] != "undefined")
				this.callObjEvent(2000+ballID);
		}

		return ((left < square.right()) && (left > square.left())
					&& (top < square.bottom()) && (top > square.top()));
	};

	this.genGlbEventID = -1;
	this.addGlobalColEvent = function(fnc)
	{
		this.globalColEvents[++this.genGlbEventID] = fnc;
		return this.genGlbEventID;
	}

	this.callGlobalEvents = function(ball, angle)
	{
		for(i in this.globalColEvents)
			this.globalColEvents[i](ball, angle);
	}
}

	//this stores where the spoke edgesa re for the circle.
	//these spokes are relative to the centre of the circle.
	//this struct is merely a tool to be used for collision detection.
	//See SPOKEANGLE below for angles of each spoke.
	function collisionSpokes(radius)
	{
		//this turns the object into an array. Lawls.
		this.length = 12;

		//first some constants.
		sin30 = 0.5;
		cos30 = 0.8660254;

		this[0] = new vector2(-radius,0); //left
		this[1] = new vector2(0,-radius); //top
		this[2] = new vector2(radius, 0); //right
		this[3] = new vector2(0,radius);  //bottom
		this[4] = new vector2(-cos30*radius, -sin30*radius);	//NWW
		this[5] = new vector2(-sin30*radius, -cos30*radius);	//NNW
		this[6] = new vector2(sin30*radius, -cos30*radius);		//NNE
		this[7] = new vector2(cos30*radius, -sin30*radius);		//NEE
		this[8] = new vector2(cos30*radius, sin30*radius);		//SEE
		this[9] = new vector2(sin30*radius, cos30*radius);		//SSE
		this[10]= new vector2(-sin30*radius, cos30*radius);		//SSW
		this[11]= new vector2(-cos30*radius, sin30*radius);		//SWW
	}

	//this is short right now. All I need are the basic sides.
	var SPOKEANGLE = 
		[Math.PI*1.5, 0, Math.PI*0.5, Math.PI,
			2,2,2,2,2,2,2,2];
