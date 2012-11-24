H.Init('hadouken', {
	width: 640,
	height: 480
});

H.Ready(function(){

	var deep = 300;

	var R = this.R;
	var C = this.R.ctx;

	this.R.Clear('#71C9F5');

	var points = [];
	for (var i=0; i<1000; i++)
	{
		var pt = new Math.float3(Math.RandomInt(0, 300), Math.RandomInt(0, 300), Math.RandomInt(0, 60));

		pt.speed = Math.Random(1, 5);
		pt.r1 = 2;
		pt.fill = "black";

		if (pt.speed >= 3)
		{
			pt.fill = "white";
		}

		points.push(pt);

		if (pt.speed > 3)
		{
			var p1 = new Math.float3(pt.x, pt.y, pt.z);
			p1.r1 = 5;
			p1.speed = pt.speed;
			p1.fill = "rgba(255, 255, 255, 0.2)";
			points.push(p1);
		}
	}

	var RenderPoint = function(pt, r1, fill)
	{
		var fs = C.fillStyle;
		C.fillStyle = fill;

		R.Circle(pt, r1);
		C.fillStyle = fs;
	}

//	var camera = new H.Camera();

	var pivot = new Math.float3(300, 300, 310);
	var pivotAngleMatrix = Math.float4x4.RotateX(Math.Degree2Radian(60));
//	var pt = new Math.float2(150 + pivot.x, 0 + pivot.y);

	var RenderFrame = function()
	{
		C.globalAlpha = 0.3;
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