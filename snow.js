// Get the canvas
var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");

var SnowFlake = function(x,y,size)
{
	var that = {};
	that.x = x;
	that.y = y;
	that.size = size;
	that.lastPos = treeGrid.getIJFromXY({x:x,y:y});
	that.destroy = function()
	{
		snowScene.flakes.splice(snowScene.findFlake(that),1);
	}
	that.draw = function()
	{
		ctx.beginPath();
		ctx.fillStyle = "rgba(215,215,255,0.7)";
		ctx.moveTo(this.x,this.y);
		ctx.arc(this.x,this.y,this.size,0,Math.PI*2,true); 
		ctx.closePath();
		ctx.fill();
	};
	return that;
}

function SnowScene(number)
{
	this.spawnFlakeVertical = function()
	{
		var flake;
		if(this.wind.y>0)
			flake = SnowFlake(Math.random()*canvas.width,0,10);
		else flake = SnowFlake(Math.random()*canvas.width,canvas.height,10);
		return flake;
	}
	this.spawnFlakeHorizontal = function()
	{
		var flake;
		if(this.wind.x>0)
			flake = SnowFlake(0,Math.random()*canvas.height,10);
		else flake = SnowFlake(canvas.width,Math.random()*canvas.height,10);
		return flake;
	}
	
	this.flakes = [];
	this.timerSpawn = 0.0;
	this.timeSpawn = 1.0;
	this.numSpawn = 5;
	this.wind = new Vec2(5,-20);
	
}

SnowScene.prototype.findFlake = function(flake)
{
	for(var f=0;f<this.flakes.length;f+=1)
	{
		if(this.flakes[f]==flake)
			return f;
	}
}

SnowScene.prototype.collideWithGrid = function(g,flake)
{
	var square = g.getSquareFromXY({x:flake.x,y:flake.y});
	if(square!==null)
	{
		square.collideWithSnowflake(flake);
		return true;
	}
	else return false;
};

SnowScene.prototype.update = function(delta)
{
	//Create new snowflakes
	this.timerSpawn += delta;
	if(this.timerSpawn > this.timeSpawn)
	{
		this.timerSpawn = 0;
		//Spawn flakes off the correct side depending on wind direction so they will blow on
		var v = this.wind.normalize(); 
		//Make wind into a normal vector so we spawn correct ratio
		//ex if y=10, x=5, spawn 2:1 as many vertically as horizontally
		var spawnHorizontally = Math.round(Math.abs(this.numSpawn*v.x));
		var spawnVertically = Math.round(Math.abs(this.numSpawn*v.y));
		for(var i=0;i<spawnVertically;i+=1)
		{
			this.flakes.push(this.spawnFlakeVertical() );
		}
		for(var i=0;i<spawnHorizontally;i+=1)
			this.flakes.push(this.spawnFlakeHorizontal() );
	}
	
	//Update all the snowflakes
	for(var f=this.flakes.length-1;f>=0;f-=1)
	{
		var flake = this.flakes[f];
		//Move the snowflake
		flake.x += this.wind.x * delta;
		flake.y += this.wind.y * delta;
		//Check if snowflake is outside window
		var buffer = 0;
		if(flake.y > canvas.height+buffer || flake.y < 0-buffer || 
			flake.x > canvas.width+buffer || flake.x < 0-buffer)
		{
			this.flakes.splice(f,1);
			continue;
		}
		//Check for collisions with snowflake and Grid
		var pos = treeGrid.getIJFromXY({x:flake.x,y:flake.y});
		if(flake==null || flake.lastPos==null || pos==null)
			var x = 0;
		if(pos.y!==flake.lastPos.y || pos.x!==flake.lastPos.x) //moved to a new Grid, trigger collision
		{
			flake.lastPos = pos;
			//collide with each Grid
			this.collideWithGrid(snowGrid,flake);
			if(this.collideWithGrid(treeGrid,flake))
				continue;
			if(this.collideWithGrid(fireGrid,flake))
				continue;
		}
	}
};

SnowScene.prototype.draw = function()
{
	for(var f=this.flakes.length-1;f>=0;f-=1)
	{
		this.flakes[f].draw();
	}
};