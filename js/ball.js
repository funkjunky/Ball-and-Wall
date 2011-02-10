	function Ball(pos, radius, vel)
	{
		this.radius = 0;		//half a tile large.
		//TODO: Only for myPhysics... I'll fix this at some point.
		this.spokes = 0;
		this.linearVel = 0;
		this.conservedVelocity = 0;

		this.pos = 0;

		this.constructor = function(pos, radius, vel)
		{
			this.radius = radius;		
			//TODO: Only for myPhysics... I'll fix this at some point.
			this.spokes = new collisionSpokes(this.radius);
			this.linearVel = vel;
			this.conservedVelocity = 160;

			this.pos = pos;
		};

		//gameTime will probably be in milliseconds.
		this.update = function(gameTime)
		{
		};

		this.draw = function(graphics)
		{
			graphics.drawCircle(this.pos.x, this.pos.y, this.radius
										, new RGBA(255, 0, 0, 1.0));
		};

		this.constructor(pos, radius, vel);
	}
