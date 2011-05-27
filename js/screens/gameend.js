function GameEnd(engine)
{
	this.score = -1;
	this.won = -1;

	this.events = 0;

	var self = this;

	this.constructor = function(engine)
	{
		this.events = engine.getNewDefaultEventEngine();

		var closeMe = function() {
			self.won = -1;
			self.score = -1;
			engine.switchScreenTo("start");
		};
		this.events.addEvent("keyup", closeMe);
		this.events.addEvent("mouseup", closeMe);
	};

	this.update = function(gameTime) {};
	this.draw = function(graphics) {
		var text = "UNSPECIFIED CONCLUSION";

		if(this.won)
			text = "You Win!";
		else
			text = "You lose...";

		graphics.setOptions({font: "24pt Arial"});
		//150, 150, is a bad idea. Use screen width and height references, so this doesn't break if I make the screen smaller.
		graphics.drawText(text, 150, 150);
	};

	this.constructor(engine);
}
