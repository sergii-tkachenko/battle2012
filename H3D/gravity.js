var w = 1200;
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
	H.Physics.GravitySolver.Generate();

	var frameCounter = 0;

	var RenderFrame = function()
	{
		C.globalAlpha = 0.5;
		R.Clear('#001133');
	//	R.Clear('#71C9F5');
		C.globalAlpha = 1;

		H.Physics.GravitySolver.Update(C);
		H.Physics.GravitySolver.Render(C);

		frameCounter++;
		
		setTimeout(RenderFrame, 30);
	}

	var FPSPrecision = 500;
	var $FPSLabel = document.getElementById('FPSLabel');

	setInterval(function(){
		$FPSLabel.innerHTML = (frameCounter * 1000 / FPSPrecision) + 'px';
	}, FPSPrecision);

	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});