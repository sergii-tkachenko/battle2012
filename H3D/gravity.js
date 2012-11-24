var w = 800;
var h = 600;

H.Init('hadouken', {
	width: w,
	height: h
});

window.onkeydown = function(event)
{
	var angleX = 0,
		angleY = 0,
		transX = 0,
		transZ = 0;
	switch (event.keyCode)
	{
		case 37:
			if (event.ctrlKey)
				transX = -5;
			else
				angleY = 5;
			break;
		case 38:
			if (event.ctrlKey)
				transZ = 5;
			else
				angleX = 5;
			break;
		case 39:
			if (event.ctrlKey)
				transX = 5;
			else
				angleY = -5;
			break;
		case 40:
			if (event.ctrlKey)
				transZ = -5;
			else
				angleX = -5;
			break;
	}
	if (angleX != 0)
		H.Physics.GravitySolver.O.transformMatrix = new Math.float4x4.RotateX(Math.Degree2Radian(angleX)).mul(H.Physics.GravitySolver.O.transformMatrix);
	if (angleY != 0)
		H.Physics.GravitySolver.O.transformMatrix = new Math.float4x4.RotateY(Math.Degree2Radian(angleY)).mul(H.Physics.GravitySolver.O.transformMatrix);
	if (transZ != 0 || transX != 0)
		H.Physics.GravitySolver.O.transformMatrix = new Math.float4x4.Translate(new Math.float3(transX, 0, transZ)).mul(H.Physics.GravitySolver.O.transformMatrix);

}

H.Ready(function(){

	var R = this.R;
	var C = this.R.ctx;

	this.R.Clear('#71C9F5');

	var points = [];
	for (var i=0; i<2000; i++)
	{
		var pt = new Math.float2(Math.RandomInt(0, 640), Math.RandomInt(0, 480));

		pt.speed = Math.Random(1, 5);
		pt.r1 = 1;
		pt.fill = "black";

		if (pt.speed >= 3)
		{
			pt.fill = "white";
		}

		points.push(pt);

		if (pt.speed > 3)
		{
			var p1 = new Math.float2(pt.x, pt.y);
			p1.r1 = 4;
			p1.speed = pt.speed;
			p1.fill = "rgba(255, 255, 255, 0.2)";
			points.push(p1);
		}
	}

	var RenderPoint = function(pt, r1, fill)
	{
		var fs = C.fillStyle;
		C.fillStyle = fill;

		var alpha = 0.2;

		C.beginPath();
		C.arc(pt.x, pt.y, r1, 0, Math.PI * 2);
		C.fill();
		C.fillStyle = fs;
	}

//	var camera = new H.Camera();

	var pivot = new Math.float2(300, 300);
//	var pt = new Math.float2(150 + pivot.x, 0 + pivot.y);

	H.Physics.GravitySolver.Init({width:w, height:h});
	H.Physics.GravitySolver.Generate();

	var RenderFrame = function()
	{
		C.globalAlpha = 0.75;
		R.Clear('#71C9F5');
		C.globalAlpha = 1;

		H.Physics.GravitySolver.Update(C);
		H.Physics.GravitySolver.Render(C);

		setTimeout(RenderFrame, 30);
	}

	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});