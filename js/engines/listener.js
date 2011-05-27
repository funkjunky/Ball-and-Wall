
//Parameters:
//fnc: the function to be called.
//params: the parameters to pass to fnc.
function Listener(_this, fnc, params)
{
	this._this = 0;
	this.fnc = 0;
	this.params = 0;

	this.constructor = function(_this, fnc, params)
	{
		this._this = _this;
		this.fnc = fnc;
		this.params = params;
	};

	this.call = function()
	{
		this.fnc.apply(this._this, this.params);
	}

	this.constructor(_this, fnc, params);
}
