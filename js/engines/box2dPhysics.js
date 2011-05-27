//This js file has all the functions that help me use box2D.

//var timeStep = 1.0/60;
//var iteration = 1;
//world.Step(timeStep, iteration);

function Box2dPhysics()
{
	this.world = 0;
	this.balls = 0;
	this.squares = 0;
	this.collisionEngine = 0;

	this.constructor = function()
	{
		//TODO: remove _engine_ reference.
		this.world = getWorld(_engine_.container.width / _engine_.options.scale, _engine_.container.height / _engine_.options.scale);
		this.balls = [];
		this.squares = [];
		this.collisionEngine = new MyCollisions();
	};

	this.init = function() {
	};

	this.addBall = function(ball)
	{
		//ball.supressMovement(true);

		var phyBall = createBall(this.world, ball.pos, ball.radius);
		phyBall.m_linearVelocity = ball.linearVel;

		this.balls[this.balls.length] = new ObjectsContainer(phyBall, ball);

		return this.collisionEngine.addBall(ball);
	};
	this.addSquare = function(square)
	{
		this.squares[this.squares.length]
			= new ObjectsContainer(
				createBox(this.world, square.pos 
								, square.width / 2
								, square.height / 2, true)
				, square);

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

	this.update = function(gameTime) {
		debuggr["box2DResolve0"] = "my balls[0]: ("
											+ this.balls[0].myObject.pos.x
											+ ", "
											+ this.balls[0].myObject.pos.y + ")";

		debuggr["box2DResolve"] = "phy balls[0]: ("
											+ this.balls[0].phyObject.m_position.x
											+ ", "
											+ this.balls[0].phyObject.m_position.y + ")";

		this.collisionEngine.update(gameTime);

  		this.world.Step(gameTime, 1);
	};

	this.constructor();
}

function updatePhyFromGameObject(phyObject, memberName)
{
	phyObject[memberName] = this[memberName];
}

function ObjectsContainer(phyObject, myObject)
{
	this.phyObject = 0;
	this.myObject = 0;
	
	this.constructor = function(phyObject, myObject)
	{
		this.phyObject = phyObject;
		this.myObject = myObject;
	}

	this.constructor(phyObject, myObject);
}

function getWorld(width, height)
{
	var worldAABB = new b2AABB();
	worldAABB.minVertex.Set(-width, -height);
	worldAABB.maxVertex.Set(width, height);
	var gravity = new b2Vec2(0, 0);
	var doSleep = true;
	return new b2World(worldAABB, gravity, doSleep);
}

function createBall(world, pos, radius) {
	var ballSd = new b2CircleDef();
	ballSd.density = 1.0;
	ballSd.radius = radius;
	ballSd.restitution = 1.0;
	ballSd.friction = 0;
	var ballBd = new b2BodyDef();
	ballBd.AddShape(ballSd);
	phyBall = world.CreateBody(ballBd);
	phyBall.m_position = pos;
	return phyBall;
}

function createBox(world, pos, width, height, fixed) {
	if (typeof(fixed) == 'undefined') fixed = true;
	var boxSd = new b2BoxDef();
	if (!fixed) boxSd.density = 1.0;
	boxSd.extents.Set(width, height);
	var boxBd = new b2BodyDef();
	boxBd.AddShape(boxSd);
	boxBd.position = pos;
	return world.CreateBody(boxBd)
}

//////////////////////////////
//Drawing functions for showing objects in the physics engine.
/////////////////////////////

function drawWorld(world, context) {
	for (var j = world.m_jointList; j; j = j.m_next) {
		drawJoint(j, context);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}
function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = '#00eeee';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
			context.lineTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}

function drawShape(shape, context) {
	context.strokeStyle = '#000000';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;

			var msg = "drawing circle:\n";
			msg += "(x,y): " + pos.x + ", " + pos.y + "\n";
			msg += "radius: " + r + "\n";	
			document.getElementById("debug").innerHTML += msg;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
	
			// draw radius
			context.moveTo(pos.x, pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x, pos2.y);
		}
		break;
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
		}
		break;
	}
	context.stroke();
}
