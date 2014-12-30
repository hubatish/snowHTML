//pos is {x,y} and src is string path to image
var FullImage = function(src)
{
	var that = {};
	that.imgReady = false;
	that.image = new Image();
	that.image.src = src;
	that.image.onload = function()
	{
		that.imgReady = true;
	}
	that.draw = function(x,y)
	{
		if(that.imgReady)
			ctx.drawImage(that.image,x,y);
	}
	return that;
}

var Tree = function()
{
	var that = {};
	that.name = "tree";
	that.lifetime = 0;
	if (typeof Tree.image === "undefined")
		Tree.image = FullImage("images/tree.png");
	if (typeof Tree.youngImage === "undefined")
		Tree.youngImage = FullImage("images/treeSapling.png");
	that.isYoung = function()
	{
		if(that.lifetime<20)
			return true;
		else return false;
	};
	that.collideWithSnowflake = function(flake)
	{
		if(!that.isYoung() && Math.random()*10.0>2)
			flake.destroy();
		return that.name;
	};
	that.update = function(modifier)
	{
		that.lifetime += 1*modifier;
	};
	that.draw = function(x,y)
	{
		if(that.isYoung())
			Tree.youngImage.draw(x,y);
		else
			Tree.image.draw(x, y-67);
	}
	return that;
}

var Fire = function(point)
{
	var that = {};
	var pos = treeGrid.getIJFromXY(point);
	that.name = "fire";
	that.lifetime = 20;
	if (typeof Fire.image === "undefined")
		Fire.image = FullImage("images/fire.png");

	//Add nearby objects to heat up	
	var nearbySnow = [];
	nearbySnow.push( snowGrid.getSquareFromIJ({x:pos.x-1,y:pos.y}) );
	nearbySnow.push( snowGrid.getSquareFromIJ({x:pos.x+1,y:pos.y}) );
	nearbySnow.push( snowGrid.getSquareFromIJ({x:pos.x,y:pos.y-1}) );
	nearbySnow.push( snowGrid.getSquareFromIJ({x:pos.x,y:pos.y+1}) );
	nearbySnow.push( snowGrid.getSquareFromIJ({x:pos.x,y:pos.y}) );
	for(var s=nearbySnow.length-1;s>=0;s-=1)
	{
		if(nearbySnow[s]==null)
			nearbySnow.splice(s,1);
	}
	
	that.update = function(modifier)
	{
		that.lifetime -= 1*modifier;
		for(var s in nearbySnow)
		{
			nearbySnow[s].melt(modifier*10);
		}
		if(that.lifetime<=0)
		{
			fireGrid.placeObjectIJ(pos,null);
		}
	};
	that.draw = function(x,y)
	{
		Fire.image.draw(x,y);
	};
	that.collideWithSnowflake = function(flake)
	{
		flake.destroy();
		return that.name;
	};
	return that;
}

var SnowPile = function()
{
	var that = {};
	that.name = "SnowPile";
	SnowPile.width = 48;
	SnowPile.height = 48;
	that.snowVolume = 1.0;
	that.maxVolume = 20.0;
	that.collideWithSnowflake = function()
	{
		that.snowVolume+=1;
		if(that.snowVolume>that.maxVolume)
			that.snowVolume = that.maxVolume;
		return that.name;
	};
	that.melt = function(modifier)
	{
		that.snowVolume -= .2*modifier;
		if(that.snowVolume < 0)
			that.snowVolume = 0;
	}
	that.update = function(modifier)
	{
		//that.melt(modifier);
	}
	that.draw = function(x,y)
	{
		var alpha = that.snowVolume/that.maxVolume;
		ctx.fillStyle = "rgba(255,255,255,"+alpha+")";
		ctx.fillRect(x,y,SnowPile.width,SnowPile.height);
	}
	return that;
}
