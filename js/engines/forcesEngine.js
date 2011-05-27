//Public members:
//
//addBall(ball)
//addSquare(square)
//checkCollision()
//

	function MyForces()
	{
		this.balls = new Array();
		//squares is an array of Physicable squares with positions and such.
		this.squares = new Array();
		this.events = {};

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
			for(var i=0; i!=this.balls.length; ++i)
			{
				//update velocity.
				this.balls[i].pos.x += this.balls[i].linearVel.x * gameTime;
				this.balls[i].pos.y += this.balls[i].linearVel.y * gameTime;
			}
		};

//collisionAngle: the angle from the centre of the ball pointing to where the collision occured..
//This function is called out of context.
		this.bounce = function(ball, collisionAngle)
		{
			var degree30effect = .5;
			var degree60effect = .866;
			//30 effect times the remainder, which is the x val.
			var y30portion 
				= degree30effect*ball.linearVel.x / 2;
			var x30portion 
				= degree30effect*ball.linearVel.y / 2;
			//var y60portion	= degree60effect*this.balls[ballIndex].linearVel.y	/	2;
			//var x60portion = degree60effect*this.balls[ballIndex].linearVel.x	/	2;

			//very simply flips the x and y when a wall is hit.
			if(ball.linearVel.x < 0 && collisionAngle == Math.PI*1.5
					  || ball.linearVel.x > 0 && collisionAngle == Math.PI*0.5)
				ball.linearVel.x *= -1;
			else if(ball.linearVel.y < 0 && collisionAngle == 0
					  || ball.linearVel.y > 0 && collisionAngle == Math.PI)
				ball.linearVel.y *= -1;

//Implement later... after simple implementation is done.
/*
			if(ball.linearVel.x < 0 && collisionAngle > Math.PI
					|| ball.linearVel.x > 0 && collisionAngle < Math.PI)
				ball.linearVel.x *= -1;
			else if(ball.linearVel.y < 0
					  		&& inAnyRange(ball.linearVel.y
					  				, [[Math.PI*1.5, Math.PI*2], [0, Math.PI*0.5]])
						|| ball.linearVel.y > 0
							&& inRange(ball.linearVel.y, Math.PI*0.5, Math.PI*1.5))
				ball.linearVel.y *= -1;
*/

//OLD Code
/*
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
*/
		};
	}
