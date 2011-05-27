//This simple class houses the forces engine and collision engine,
//and provides accessor functions for each.
//
//Public Member methods:
//init
//addBall
//addSquare
//addEvent
//update

	function MyPhysics()
	{
		this.forcesEngine = new MyForces();
		this.collisionEngine = new MyCollisions();

		this.init = function()
		{
			this.collisionEngine
					.addGlobalColEvent(this.forcesEngine.bounce);
		};
		this.addBall = function(ball)
		{
			this.forcesEngine.addBall(ball);
			//return an ID. For balls is 2000+ index.
			return this.collisionEngine.addBall(ball);
		};
		this.addSquare = function(square)
		{
			this.forcesEngine.addSquare(square);
			//return an ID. For squares is 1000+ index.
			return this.collisionEngine.addSquare(square);
		};

		this.addObjEvent = function(objID, fnc)
		{
			return this.collisionEngine.addObjEvent(objID, fnc);
		};

		this.removeObjEvent = function(evtID)
		{
			this.collisionEngine.removeObjEvent(evtID);
		};

		this.update = function(gameTime)
		{
			this.forcesEngine.update(gameTime);
			this.collisionEngine.update(gameTime);
		};
	}
