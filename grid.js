//Takes start position and end position as
//{x:myX,y:myY}
var drawLine = function(start,end)
{
	ctx.beginPath();
	ctx.moveTo(start.x,start.y);
	ctx.lineTo(end.x,end.y);
	ctx.stroke();
}

var Grid = function(startObjectFunction)
{
	var that = {};
	that.squares = new Array();
	that.width = 48;
	that.height = 48;
	for(var i = 0; i<20; i+=1)
	{
		that.squares[i] = new Array();
		for(var j =0; j<20; j+=1)
		{
			var object = null;
			if(startObjectFunction!==null)
				object = startObjectFunction();
			that.squares[i][j] = object;
			//if(j%3==0 && i%3==0)
				//that.squares[i][j] = Tree();
		}
	}
	
	that.getIJFromXY = function(point)
	{
		var ijPoint = {};
		ijPoint.x = Math.floor(point.x/that.width);
		ijPoint.y = Math.floor(point.y/that.height);
		if(ijPoint.x in that.squares && ijPoint.y in that.squares[0])
			return ijPoint;
		else return null;
	}
	
	//Takes object point = {x: x, y: y}
	//Returns object found in Grid at that location
	that.getSquareFromXY = function(point)
	{
		var p = that.getIJFromXY(point);
		if(p==null)
			return null;
		else return that.squares[p.x][p.y];
	}
	
	that.getSquareFromIJ = function(point)
	{
		if(point.x in that.squares && point.y in that.squares[0])
			return that.squares[point.x][point.y];
		else return null;
	}
	
	that.placeObject = function(point,object)
	{
		var p = that.getIJFromXY(point);
		if(p!==null)
			that.squares[p.x][p.y] = object;
	}
	
	that.placeObjectIJ = function(point,object)
	{
		if(point.x in that.squares && point.y in that.squares[0])
		{
			that.squares[point.x][point.y] = object;
		}
	}
	
	that.update = function(modifier)
	{
		for(var i=0; i<that.squares.length;i+=1)
		{
			for(var j=0;j<that.squares.length;j+=1)
			{
				if(that.squares[i][j]!==null)
					that.squares[i][j].update(modifier);
			}
		}
	}
	
	that.draw = function()
	{
		for(var i=0; i<that.squares.length;i+=1)
		{
			for(var j=0; j<that.squares[i].length;j+=1)
			{
				if(that.squares[i][j]!==null)
					that.squares[i][j].draw(that.width*i,that.height*j);
					
				//draw horizontal line
				drawLine({x:0,y:j*that.height},{x:800,y:j*that.height});
			}
			//draw vertical line
			drawLine({x:i*that.width,y:0},{x:i*that.width,y:800});
		}
	}
	return that;
}

var Map1 = function()
{
	var that = {};
	that.points = [];
	var x_off = 5;
	var y_off = 5;
	that.points.push({x:x_off,y:y_off-2});
	that.points.push({x:x_off,y:y_off});
	that.points.push({x:x_off-2,y:y_off});
	that.points.push({x:x_off-4,y:y_off-1});
	that.points.push({x:x_off+2,y:y_off+2});
	that.points.push({x:x_off+3,y:y_off+4});
	that.loadOnToGrid = function(g)
	{
		for(l=0;l<that.points.length;l+=1)
		{
			g.placeObjectIJ(that.points[l],Tree());
		}
	};
	return that;
};

var map1 = Map1();


