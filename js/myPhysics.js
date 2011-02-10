//Public members:
//
//addBall(ball)
//addSquare(square)
//checkCollision()
//

	function MyPhysics()
	{
		this.balls = new Array();
		//squares is an array of Physicable squares with positions and such.
		this.squares = new Array();

		this.addBall = function(ball)
		{
			this.balls[this.balls.length] = ball;
		};
		this.addSquare = function(square)
		{
			this.squares[this.squares.length] = square;
		};

		this.update = function(gameTime)
		{
			var speedModifier = 100;
			for(var i=0; i!=this.balls.length; ++i)
			{
				//update velocity.
				this.balls[i].pos.x += this.balls[i].linearVel.x 
												* speedModifier * gameTime/60;
				this.balls[i].pos.y += this.balls[i].linearVel.y 
												* speedModifier * gameTime/60;
			}

			//check and update for collisions.
			this._resolveCollisions();
		};

		this._resolveCollisions = function() {
			for(var i=0; i!=this.balls.length; ++i)
				for(var j=0; j!=this.squares.length; ++j)
					for(var k=0; k!=this.balls[i].spokes.length; ++k) 
						if(this._checkSquare
								(this.balls[i].spokes[k].left + this.balls[i].pos.x
									, this.balls[i].spokes[k].top 
											+ this.balls[i].pos.y
									, this.squares[j]))
							this._bounce(i, k);
		};
		this._checkSquare = function(left, top, square)
		{
			if((left < square.right()) && (left > square.left())
						&& (top < square.bottom()) && (top > square.top()))
				debuggr["checkSquare"] = 
					"collide info: " +
					"(" + left + ", " + top + ") - (" 
						+ square.left() + "-" + square.right() 
						+ ", " + square.top() + "-" 
							+ square.bottom() + ")";

			return ((left < square.right()) && (left > square.left())
						&& (top < square.bottom()) && (top > square.top()));
		};
//New method
//everytime an odd angle is hit, increase the ANGLE of the trajectory by +-9 or some constant. Obviously stopping at 9 and 81 degrees, so it can potentially recover.
//Or better yet have levels. So 6, 9, 18, 27, 45, 63, 75, 81, 84 
//Or use a function to normalize-out the error.
		this._bounce = function(ballIndex, spokeIndex)
		{
			var degree30effect = .5;
			var degree60effect = .866;
			//30 effect times the remainder, which is the x val.
			var y30portion 
				= degree30effect*this.balls[ballIndex].linearVel.x / 2;
			var x30portion 
				= degree30effect*this.balls[ballIndex].linearVel.y / 2;
			//var y60portion	= degree60effect*this.balls[ballIndex].linearVel.y	/	2;
			//var x60portion = degree60effect*this.balls[ballIndex].linearVel.x	/	2;
			switch(spokeIndex)
			{
				case 0:	if(this.balls[ballIndex].linearVel.x < 0) 
								this.balls[ballIndex].linearVel.x *= -1;
							var normalizer = (this.balls[ballIndex].conservedVelocity / Math.sqrt(
									this.balls[ballIndex].linearVel.x*this.balls[ballIndex].linearVel.x 
									+ this.balls[ballIndex].linearVel.y *this.balls[ballIndex].linearVel.y ));
							this.balls[ballIndex].linearVel.x *= normalizer;
							this.balls[ballIndex].linearVel.y *= normalizer;
															break;
				case 1: 	if(this.balls[ballIndex].linearVel.y < 0) 
								this.balls[ballIndex].linearVel.y *= -1;
							var normalizer = (this.balls[ballIndex].conservedVelocity / Math.sqrt(
									this.balls[ballIndex].linearVel.x*this.balls[ballIndex].linearVel.x 
									+ this.balls[ballIndex].linearVel.y *this.balls[ballIndex].linearVel.y ));
							this.balls[ballIndex].linearVel.x *= normalizer;
							this.balls[ballIndex].linearVel.y *= normalizer;
															break;
				case 2: 	if(this.balls[ballIndex].linearVel.x > 0) 
								this.balls[ballIndex].linearVel.x *= -1;
							var normalizer = (this.balls[ballIndex].conservedVelocity / Math.sqrt(
									this.balls[ballIndex].linearVel.x*this.balls[ballIndex].linearVel.x 
									+ this.balls[ballIndex].linearVel.y *this.balls[ballIndex].linearVel.y ));
							this.balls[ballIndex].linearVel.x *= normalizer;
							this.balls[ballIndex].linearVel.y *= normalizer;
															break;
				case 3: 	if(this.balls[ballIndex].linearVel.y > 0) 
								this.balls[ballIndex].linearVel.y *= -1;
							var normalizer = (this.balls[ballIndex].conservedVelocity / Math.sqrt(
									this.balls[ballIndex].linearVel.x*this.balls[ballIndex].linearVel.x 
									+ this.balls[ballIndex].linearVel.y *this.balls[ballIndex].linearVel.y ));
							this.balls[ballIndex].linearVel.x *= normalizer;
							this.balls[ballIndex].linearVel.y *= normalizer;
															break;
				//another method... allow these angles to hit repeatidly, until an axis hits.
				//The more it hits, the more the angle is affected. So do small increments.
				//Then above, the speed will be normalized during x/y inversion.
				case 4: if(this.balls[ballIndex].linearVel.x < 0) {
								if(this.balls[ballIndex].linearVel.y < 0)
									y30portion *= -1;
								this.balls[ballIndex].linearVel.y -= y30portion;
							} break;
				case 5: if(this.balls[ballIndex].linearVel.y < 0) {
								if(this.balls[ballIndex].linearVel.x < 0)
									x30portion *= -1;
								this.balls[ballIndex].linearVel.x -= x30portion;
							} break;
				case 6: if(this.balls[ballIndex].linearVel.x > 0) {
								if(this.balls[ballIndex].linearVel.x < 0)
									x30portion *= -1;
								this.balls[ballIndex].linearVel.x -= x30portion;
							} break;
				case 7: if(this.balls[ballIndex].linearVel.y < 0) {
								if(this.balls[ballIndex].linearVel.y < 0)
									y30portion *= -1;
								this.balls[ballIndex].linearVel.y -= y30portion;
							} break;
				case 8: if(this.balls[ballIndex].linearVel.x < 0) {
								if(this.balls[ballIndex].linearVel.y < 0)
									y30portion *= -1;
								this.balls[ballIndex].linearVel.y -= y30portion;
							} break;
				case 9: if(this.balls[ballIndex].linearVel.y > 0) {
								if(this.balls[ballIndex].linearVel.x < 0)
									x30portion *= -1;
								this.balls[ballIndex].linearVel.x -= x30portion;
							} break;
				case 10: if(this.balls[ballIndex].linearVel.x > 0) {
								if(this.balls[ballIndex].linearVel.x < 0)
									x30portion *= -1;
								this.balls[ballIndex].linearVel.x -= x30portion;
							} break;
				case 11: if(this.balls[ballIndex].linearVel.y > 0) {
								if(this.balls[ballIndex].linearVel.y < 0)
									y30portion *= -1;
								this.balls[ballIndex].linearVel.y -= y30portion;
							} break;

			}
		};
	}

	//this stores where the spoke edgesa re for the circle.
	//these spokes are relative to the centre of the circle.
	//this struct is merely a tool to be used for collision detection.
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
