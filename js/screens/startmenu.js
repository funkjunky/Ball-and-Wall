function StartMenu(engine)
{
	this.options = [];
	this.currentChoice = 0;

	this.events = 0;

	var self = this;

	this.constructor = function(engine)
	{
		this.events = engine.getNewDefaultEventEngine();

		this.options.push(new Option("Start Playing"
			, 	function() {
					 engine.GetScreen("gameplay").init();
					 engine.switchScreenTo("gameplay");
				}));
		this.options.push(new Option("does nothing.", function() {}));
		this.options.push(new Option("does nothing 2.", function() {}));

		this.events.addEvent("keydown", function(event) {
			if(event.keyCode == 38) {
				//stop underflow
				if(--self.currentChoice < 0)
					self.currentChoice = 0;
			}
			else if(event.keyCode == 40) {
				//stop overflow
				if(++self.currentChoice ==self.options.length)
					self.currentChoice = self.options.length-1;
			}
			else if(event.keyCode == 32 || event.keyCode == 13 || event.keyCode == 14)
				self.options[self.currentChoice].cb.call();
		});
	};

	this.show = function(){};
	this.hide = function() {};

	this.update = function(gameTime)
	{
	};

	this.draw = function(graphics)
	{
		var numOptions = this.options.length;
		var fontSize = 40; //in pixels
		var font = "Arial";
		var spaceBetween = 10;//in pixels.
		var iteration = fontSize+spaceBetween;

		//calculate where to start to be centered.
		var curTop;
		var top = curTop = (graphics.ScaleHeight() / 2)
									- ((numOptions-1) * (iteration));
		var centred = graphics.ScaleWidth() / 2;

		graphics.setOptions({font: fontSize+"px "+font, textAlign: "center", textBaseline: "middle"});
		for(var i=0; i!=this.options.length; ++i) {
			if(i == this.currentChoice) {
				graphics.setOptions({font: (fontSize*1.25)+"px "+font});
				graphics.drawText(this.options[i].text, centred
											, curTop+=iteration);
				graphics.setOptions({font: fontSize+"px "+font});
			}
			else
				graphics.drawText(this.options[i].text, centred
											, curTop+=iteration);
		}
	};

	this.constructor(engine);
}

function Option(text, cb)
{
	this.text = text;
	this.cb = cb;
}
