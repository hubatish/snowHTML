// Game objects
var Hero = function()
{
	var that = {};
	that.speed = 256; // movement in pixels per second
	that.image = FullImage("images/hero.png");
	that.pos = new Vec2(canvas.width/2,canvas.height/2);
	that.x = canvas.width / 2;
	that.y = canvas.height / 2;
	that.numtrees = 5;
	Hero.maxTemp = 100;
	that.temperature = Hero.maxTemp;
	that.cursor = null;
	that.lost = false;
	that.collide = function(gridPos,modifier)
	{
		var snow = snowGrid.getSquareFromIJ(gridPos);
		that.temperature -= (snow.snowVolume/snow.maxVolume)*6.0*modifier;
		var Fire = fireGrid.getSquareFromIJ(gridPos);
		if(Fire!==null)
			that.temperature += 25*modifier;
	};
	that.update = function(modifier)
	{
		if(that.cursor!==null)
		{
			//Move towards cursor
			var toMove = that.pos.subV(that.cursor.pos).normalize();
			toMove = toMove.mulS(that.speed*modifier);
			that.pos = that.pos.subV(toMove);
			
			//Check if at cursor
			if(that.pos.subV(that.cursor.pos).length()<that.speed*modifier*2)
			{
				var p = that.cursor.pos;
				//Perform action at position
				var t = treeGrid.getSquareFromXY(p);
				var f = fireGrid.getSquareFromXY(p);
				if(t == null)
				{
					if(f == null && that.numtrees > 0)
					{
						that.numtrees -= 1;
						treeGrid.placeObject(p,Tree());
					}
				}
				else if(!t.isYoung())
				{
					treeGrid.placeObject(p,null);
					fireGrid.placeObject(p,Fire(p));
				}
				that.cursor = null;
			}
		}
		//detect "collisions" with different object
		var gridPos = treeGrid.getIJFromXY(that.pos);
		if(gridPos!==null)
			that.collide(gridPos,modifier);
		//var square = treeGrid.getSquareFromXY({x:that.pos.x,y:that.pos.y});
		//that.collideWithObject(square,modifier);
		
		//check end game condition
		if(that.temperature < 0 && !that.lost)
		{
			alert("You lose.  Try again.");
			that.lost = true;
			location.reload();
		}
		else if(that.temperature > Hero.maxTemp)
			that.temperature = Hero.maxTemp;
	};
	that.draw = function()
	{
		that.image.draw(that.pos.x-24,that.pos.y-24);
		if(that.cursor!=null)
			that.cursor.draw();
	};
	that.click = function(ev)
	{
		var p = new Vec2(ev.offsetX,ev.offsetY);
		that.cursor = Cursor(p);
	};
	return that;
};

//returns an unit vector pointing from p1 to p2
/*var vectorTowardsPoint = function(p1,p2)
{
	var r = {};
	r.x = p1.x-p2.x;
	r.y = p1.y-p2.y;
	return unitVector(r);
};

//returns vector v as a unit vector
var unitVector = function(v)
{
	var d = magnitude(v);
	return {x:v.x/d,y:v.y/d};
};

//returns magnitude of a vector
var magnitude = function(v)
{
	return Math.sqrt(v.x*v.x+v.y*v.y);
};*/

var Cursor = function(pos)
{
	var that = {};
	that.pos = pos;
	if (typeof Cursor.image === "undefined")
		Cursor.image = FullImage("images/cursor.png");
	that.draw = function()
	{
		Cursor.image.draw(that.pos.x-16,that.pos.y-16);
	}
	return that;
};

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

var $window = $(window);
$window.on("click",function(ev)
{
	hero.click(ev);
});
