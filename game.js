// Background image
var backImage = FullImage("images/background.png");
backImage.oldDraw = backImage.draw;
backImage.draw = function()
{
	backImage.oldDraw(0,0);
}

var Hud = function()
{
	var that = {};
	that.treeImage = FullImage("images/treeSapling.png");
	that.draw = function()
	{
		// Health
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.font = "24px Helvetica";
		ctx.textAlign = "left";
		ctx.textBaseline = "top";
		ctx.fillText("Current Temperature: " + Math.round(hero.temperature), 32, 16);
		that.treeImage.draw(32,48);
		ctx.fillText(": " + hero.numtrees, 32+48,48);
	};
	return that;
};

var Timeline = function()
{
	var that = {};
	that.time = 0.0;
	that.stage = 0;
	var changeTime = 60;
	that.update = function(delta)
	{
		that.time += delta;
		if(that.time>changeTime && that.stage==0)
		{
			that.stage = 1;
			snowScene.wind.x = -(snowScene.wind.x + Math.random()*10.0);
		}
		else if(that.stage ==1 && that.time>changeTime*2)
		{
			that.stage = 2;
			snowScene.wind.y = -snowScene.wind.y;
		}
	};
	return that;
}

var hud = Hud();
var timeline = Timeline();
var hero = Hero();
snowScene = new SnowScene(120);
snowGrid = Grid(SnowPile);
treeGrid = Grid(null);
map1.loadOnToGrid(treeGrid);
fireGrid = Grid(null);

// Update game objects
var update = function (modifier) {
	
	hero.update(modifier);
	snowGrid.update(modifier);
	treeGrid.update(modifier);
	fireGrid.update(modifier);
	snowScene.update(modifier);
	timeline.update(modifier);
};

// Draw everything
var render = function () {
	backImage.draw();
	
	snowGrid.draw();
	treeGrid.draw();
	fireGrid.draw();
	
	hero.draw();

	snowScene.draw();
	hud.draw();
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	if(delta>1000)
		delta = 1000;
	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible