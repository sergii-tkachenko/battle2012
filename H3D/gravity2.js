var w = 1000;
var h = 550;

H.Init('hadouken', {
	width: w,
	height: h,
});

window.onkeydown = function(event)
{
	var angleX = 0,
		angleY = 0,
		transX = 0,
		transY = 0,
		transZ = 0;
	switch (event.keyCode)
	{
		case 104:
			H.Physics.GravitySolver.speed += 1;
			break;
		case 98:
			H.Physics.GravitySolver.speed -= 1;
			break;
		case 17:
			// transY = -5;
			break;
		case 32:
			// transY = 5;
			if (H.Physics.GravitySolver.speed == 0)
			{
				H.Physics.GravitySolver.speed = this.__prevSpeed;
			}
			else
			{
				this.__prevSpeed = H.Physics.GravitySolver.speed;
				H.Physics.GravitySolver.speed = 0;
			}
			break;
		case 83:
			transZ = event.shiftKey ? 15 : 5;
			break;
		case 87:
			transZ = event.shiftKey ? -15 : -5;
			break;
		case 65:
			transX = event.shiftKey ? 15 : 5;
			break;
		case 68:
			transX = event.shiftKey ? -15 : -5;
			break;
		case 37:
			angleY = event.shiftKey ? 5 : 1;
			break;
		case 38:
			angleX = event.shiftKey ? 5 : 1;
			break;
		case 39:
			angleY = event.shiftKey ? -5 : -1;
			break;
		case 40:
			angleX = event.shiftKey ? -5 : -1;
			break;
	}
	if (angleX != 0)
		H.Physics.GravitySolver.O.transformMatrix = new Math.float4x4.RotateX(Math.Degree2Radian(angleX)).mul(H.Physics.GravitySolver.O.transformMatrix);
	if (angleY != 0)
		H.Physics.GravitySolver.O.transformMatrix = new Math.float4x4.RotateY(Math.Degree2Radian(angleY)).mul(H.Physics.GravitySolver.O.transformMatrix);
	if (transZ != 0 || transX != 0 || transY != 0)
		H.Physics.GravitySolver.O.transformMatrix = new Math.float4x4.Translate(new Math.float3(transX, transY, transZ)).mul(H.Physics.GravitySolver.O.transformMatrix);

}

H.Ready(function(){

	var R = this.R;
	var C = this.R.ctx;

	H.canvas.mousemove(function(e){
		// console.log(e);
		H.Physics.GravitySolver.mouseCoords = new Math.float2(e.layerX, e.layerY);
		//H.Physics.GravitySolver.AddPoint(e.offsetX, e.offsetY, 0);
	});

	this.R.Clear('#71C9F5');

	H.Physics.GravitySolver.Init({width:w, height:h});
	// H.Physics.GravitySolver.Generate();

	var frameCounter = 0;
	var frameTime = 0;
	var frameDate = null;

	var RenderFrame = function()
	{
		frameDate = new Date().getTime();
		C.globalAlpha = 0.75;
		//	Frame clearing code
		var gradient = C.createLinearGradient(0, H.O.height, H.O.width, 0);
		gradient.addColorStop(0, "#aaa");
		gradient.addColorStop(1, "#484FF1");
		R.Clear(gradient);
	//	R.Clear("white");
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

	var FPSPrecision = 300;
	var $FPSLabel = document.getElementById('FPSLabel');
	var $PointCounter = document.getElementById('PointCounter');


	setInterval(function(){
		$FPSLabel.innerHTML = (1000 / frameTime * 1000 / FPSPrecision).toFixed(3) + ' fps';
		// $PointCounter.innerHTML = H.Physics.GravitySolver.particles.length + ' points';
		frameCounter = 0;
	}, FPSPrecision);


	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});
