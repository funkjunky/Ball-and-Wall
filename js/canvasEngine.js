function CanvasEngine(canvas, scale)
{
	this.container = 0;
	this.scale = 0;

	this.constructor = function(canvas, scale)
	{
		if(!canvas)
			throw "Canvas don't exist... that is no good.";
		this.container = canvas;
		this.scale = scale;

		this._getC2d().scale(scale, scale);
	};

	//Public Methods
	this.clear = function()
	{
		this._getC2d().clearRect(0,0, this.container.width / this.scale, 
											this.container.height / this.scale);
	};

	this.drawRect = function(x, y, width, height, rgba)
	{
		var ctx = this._getC2d();

		ctx.fillStyle = this.fillStyle(rgba);
		ctx.fillRect(x, y, width, height);
	};

	this.drawCircle = function(x, y, radius, rgba)
	{
		//var ctx = canvas.getContext('2d');
		var ctx = this._getC2d();

		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fillStyle = this.fillStyle(rgba);
		ctx.fill();
	};

	this.fillStyle = function(rgba)
	{
		debuggr["fillstyle"] = "red: " + rgba.r + " ~ alpha: " + rgba.a;
		return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + "," 
					+ rgba.a + ")";
	};

	//Private Methods

	this._getC2d = function()
	{
		return canvas.getContext('2d');
	};

	this.constructor(canvas, scale);
}

function RGBA(r, g, b, a)
{
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}
