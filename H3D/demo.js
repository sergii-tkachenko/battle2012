H.Init('hadouken', {
	width: 640,
	height: 480
});

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

	var RenderFrame = function()
	{
		C.globalAlpha = 0.3;
		R.Clear('#71C9F5');
		C.globalAlpha = 1;

		for (var pI in points)
		{
			var pt = points[pI];

			var xpt = pt;
			pt = pt.sub(pivot);

			var angleR = Math.Degree2Radian(angle * points[pI].speed);
			var aV = new Math.float2(Math.sin(angleR), Math.cos(angleR));

			/*
			//	Этот код рисует знак бесконечности
			pt.x = pt.x * aV.y - pt.y * aV.x;
			pt.y = pt.x * aV.x + pt.y * aV.y;
			*/

			var ptx = pt.x * aV.y - pt.y * aV.x;
			pt.y = pt.x * aV.x + pt.y * aV.y;
			pt.x = ptx;

			pt = pt.add(pivot);

			RenderPoint(pt, points[pI].r1, points[pI].fill);
		}

	//	RenderPoint(pivot, 20, 30, "#773300");
	//	RenderPoint(pt, 5, 10, "#007733");

		angle += 0.2;
		setTimeout(RenderFrame, 10);
	}

	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});