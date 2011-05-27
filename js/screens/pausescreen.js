function PauseScreen(engine)
{
	this.events = 0;

	this.constructor = function(engine)
	{
		this.events = engine.getNewDefaultEventEngine();

		this.events.addEvent("keyup", function(e) {
			if(e.keyCode == 80)
				engine.closeOverlay();
		});
	};

	this.update = function(gameTime) {};
	this.draw = function(graphics)
	{
		graphics.drawRect(20, 20, graphics.ScaleWidth()-40
								, graphics.ScaleHeight()-40, new RGBA(0,0,0,0.3));
		graphics.setOptions({font: "24pt Arial", textBaseline: "middle", textAlign: "center"});
		graphics.drawText("Paused", graphics.ScaleWidth()/2
								, graphics.ScaleHeight() / 2);
	};

	this.constructor(engine);
}
