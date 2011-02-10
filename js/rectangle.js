//addEventListener, works similar to the standard one.
//You pass it the name of a member variable you want to listen to for change
//You then pass it your callback function, then specify any parameters 
//you wish to pass to the callback function.

//x and y are in the centre of the rectangle.
//so the anchor is the centre.
function Rectangle(x, y, width, height)
{
	this.pos = 0;
	this.width = 0;
	this.height = 0;

	this.constructor = function(x, y, width, height)
	{
		this.pos = new b2Vec2(x, y);
		this.width = width;
		this.height = height;
	};

	this.left = function()
	{
		return this.pos.x - (this.width / 2);
	};

	this.right = function()
	{
		return this.pos.x + (this.width / 2);
	};

	this.top = function()
	{
		return this.pos.y - (this.height / 2);
	};

	this.bottom = function()
	{
		return this.pos.y + (this.height / 2);
	};

	this.draw = function(graphics)
	{
		graphics.drawRect(this.left(), this.top(), this.width, this.height,
								new RGBA(0,0,0,1.0));
	};

	this.constructor(x, y, width, height);
}
