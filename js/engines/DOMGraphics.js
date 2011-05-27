//TODO: scale is not implemented yet. Implement later.
function DOMGraphicsEngine(div, scale)
{
	this.container = 0;
	this.scale = 0;

	//for caching
	this.objects = 0;

	this.objs = [];

	//public methods
	this.constructor = function(div, scale)
	{
		if(!div)
			throw "wtf... at least provide a div";

		//hack for now. Use engineOptions
		div.style.width = "600px";
		div.style.height = "600px";
		div.width = 300;
		div.height = 300;
		//
		this.container = div;
		this.scale = scale;

		this.initiateObjectsArray();
	};

	//does nothing! we don't want to erase any divs...
	this.clear = function()
	{
		debuggr["cleardd"] = "dom objs: " + this.objs.length;
		debuggr["cleardd"] = "dom objs[0]: " + this.objs[0];
		for(var i=0; i!=this.objs.length; ++i)
			this.container.removeChild(this.objs[i]);

		this.objs.length = 0;
	};

	this.drawRect = function(x, y, width, height, rgba)
	{
		var newRect = document.createElement("div");
		newRect.style.border = "solid 1px black";
		newRect.style.backgroundColor = "black";//this.fillStyle(rgba);
		newRect.style.position = "absolute";
		newRect.style.left = x + "px"; 
		newRect.style.top = y + "px"; 
		newRect.style.width = width + "px";
		newRect.style.height = height + "px";

		this.container.appendChild(newRect);

		this.objs[this.objs.length] = newRect;
	};

	this.drawCircle = function(x, y, radius, rgba)
	{
		this.drawRect(x-radius, y-radius,radius*2,radius*2,rgba);
	};

	this.fillStyle = function(rgba)
	{
		return "rgba(" + rgba.r + "," + rgba.g + "," + rgba.b + ","
					+ rgba.a + ")";
	};

	//private methods
	this.initiateObjectsArray = function()
	{
		this.objects = {};
		this.objects["rect"] = [];
		this.objects["circle"] = [];
	};

	this.constructor(div, scale);
}
