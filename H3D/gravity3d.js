var w = 800;
var h = 600;

H.Init('hadouken', {
	width: w,
	height: h
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

	H.Physics.GravitySolver.Init({width:w, height:h});
	H.Physics.GravitySolver.Generate();

	var RenderFrame = function()
	{
		C.globalAlpha = 0.75;
		R.Clear('#71C9F5');
		C.globalAlpha = 1;

		var newPoints = {};
		for (var pI in points)
		{
			var pt = points[pI];

			var xpt = pt;
			// pt.z = (pt.x - 200 + pt.y - 200) > 0 ? (pt.x - 200 + pt.y - 200) * 60 : 10;
			// xpt = xpt.sub(pivot);

			var angleR = Math.Degree2Radian(angle * points[pI].speed);
			var aV = pivotAngleMatrix.mul(Math.float4x4.RotateZ(angleR));

			/*
			//	Этот код рисует знак бесконечности
			pt.x = pt.x * aV.y - pt.y * aV.x;
			pt.y = pt.x * aV.x + pt.y * aV.y;
			*/

			xpt = aV.mulFloat3(xpt);

			xpt = xpt.add(pivot);
			// xpt = Math.float4x4.Projection(pivot).mulFloat3(xpt);
			// pt2d = xpt.projection(deep);
			if (!(xpt.z in newPoints))
				newPoints[xpt.z] = [];
			var r = xpt.z * (points[pI].r1) / 300;
			if (r > 0)
				newPoints[xpt.z].push({point: xpt, r: r, fill: points[pI].fill});
		}
		// newPoints = newPoints.sort(function(e){ return -e.point.z; } );
		for (var pI in newPoints)
		{
			for (var ppI in newPoints[pI])
			{
				var xpt = newPoints[pI][ppI];
				if (xpt.point.z > 0)
					RenderPoint(xpt.point, xpt.r, xpt.fill);
			}
		}

		H.Physics.GravitySolver.Update(C);
		H.Physics.GravitySolver.Render(C);

		setTimeout(RenderFrame, 30);
	}

	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});