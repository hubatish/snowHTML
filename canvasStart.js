// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.id = "mycanvas";
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

if (typeof Object.create !== 'function') {
     Object.create = function (o) {
		 var F = function () {};
		 F.prototype = o;
		 return new F();
	};
}