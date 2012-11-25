var w = 1440;
var h = 700;

H.Init('hadouken', {
	width: w,
	height: h,
	deep: 400,
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

	H.Physics.GravitySolver.Init({width:w, height:h});
	H.Physics.GravitySolver.Generate();

	var frameCounter = 0;
	var frameTime = 0;
	var frameDate = null;

	console.log(this);

	var RenderFrame = function()
	{
		frameDate = new Date().getTime();
		C.globalAlpha = 0.5;
		//	Frame clearing code
		var gradient = C.createLinearGradient(0, H.O.height, H.O.width, 0);
		gradient.addColorStop(0, "#080c24");
		gradient.addColorStop(1, "#d00206");
	//	R.Clear(gradient);
		R.Clear("white");
	//	R.Clear('#71C9F5');
		C.globalAlpha = 1;

		H.Physics.GravitySolver.Update(C);
		H.Physics.GravitySolver.Render(C);

		C.globalCompositeOperation = 'darker'
	//	C.globalAlpha = 0.5;

		var gradient = C.createLinearGradient(0, H.O.height, H.O.width, 0);
		gradient.addColorStop(0, "#080c24");
		gradient.addColorStop(1, "#d00206");
	//	R.Clear(gradient);

	//	C.globalAlpha = 1;

		C.globalCompositeOperation = "source-over";

		frameTime = new Date().getTime() - frameDate;

		setTimeout(RenderFrame, 1);
	}

	var FPSPrecision = 100;
	var $FPSLabel = document.getElementById('FPSLabel');

	setInterval(function(){
		$FPSLabel.innerHTML = (FPSPrecision / frameTime).toFixed(3) + ' fps';
		frameCounter = 0;
	}, FPSPrecision);

	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});
