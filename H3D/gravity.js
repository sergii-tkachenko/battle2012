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

	H.Physics.GravitySolver.Init({width:w, height:h});
//	H.Physics.GravitySolver.Generate();

	var frameCounter = 0;
	var frameTime = 0;
	var frameDate = null;

	console.log(this);

	var RenderFrame = function()
	{	
		frameDate = new Date().getTime();
		C.globalAlpha = 0.75;
		//	Frame clearing code
		var gradient = C.createLinearGradient(0, H.O.height, H.O.width, 0);
		gradient.addColorStop(0, "#080c24");
		gradient.addColorStop(1, "#d00206");
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
		$PointCounter.innerHTML = H.Physics.GravitySolver.particles.length + ' points';
		frameCounter = 0;
	}, FPSPrecision);


	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});