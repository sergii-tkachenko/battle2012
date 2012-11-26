var w = 1200;
var h = 600;

H.Init('hadouken', {
	width: w,
	height: h
});

H.TwitPanel = {
	twits: [],
	lastY: -10,

	alpha: 0,

	AddTwit: function(tw)
	{
		$("<p></p>").html(tw.text).appendTo(this.$node);
	}
};

H.Ready(function(){
	
	var self = this;
	var R = this.R;
	var C = this.R.ctx;

	this.R.Clear('#71C9F5');

	H.Physics.GravitySolver.Init({width:w, height:h});
//	H.Physics.GravitySolver.Generate();

	var frameCounter = 0;
	var frameTime = 0;
	var frameDate = null;

	console.log(this);

	$(document).keydown(function(e){
		if(e.which == 27)
			$('#twitPanel').fadeOut();
	});

	var pause = false;

	$(document).keydown(function(e){
		if(e.which == 16)
			pause = true;
	});

	$(document).keyup(function(e){
		if(e.which == 16)
			pause = false;
	});

	H.TwitPanel.$node = $('#twitPanel');
	H.TwitPanel.$node.detach().appendTo('#hadouken');

	GS = H.Physics.GravitySolver;
	hoverPoints = [];

	var mouseEvent = null;

	$(H.canvas).mousemove(function(e){
	//	if(pause)
		{
			mouseEvent = e;
		}
	});

	$(H.canvas).click(function(e){

		if(pause)
		{
			var pts = GS.FindPointsUnderCursor(e.offsetX, e.offsetY);
			var tags = [];
			for(var pI in pts)
				tags.push(pI);

			socket.emit('hashtags', tags);
		}
	});

	var RenderHoverPoints = function(e)
	{
		if(mouseEvent == null) return;

		hoverPoints = GS.FindPointsUnderCursor(e.offsetX, e.offsetY);
			for(var pI in hoverPoints)
				GS.RenderHoverPoint(hoverPoints[pI], C, []);
	}

	var RenderFrame = function()
	{	
		frameDate = new Date().getTime();
		C.globalAlpha = pause ? 0.1 : 0.4;
		//	Frame clearing code
		var gradient = C.createLinearGradient(0, H.O.height, H.O.width, 0);
		gradient.addColorStop(0, "#0b0d24");
		gradient.addColorStop(1, "#55226c");
		R.Clear(gradient);
	//	R.Clear("white");
	//	R.Clear('#71C9F5');
		C.globalAlpha = 1;

		if (pause)
		{
			H.Physics.GravitySolver.RenderHeavyLinks(C);
		}
		else
			H.Physics.GravitySolver.Update(C);

		H.Physics.GravitySolver.Render(C);

		RenderHoverPoints(mouseEvent);

		C.globalCompositeOperation = "source-over";		

		frameTime = new Date().getTime() - frameDate;
		
		setTimeout(RenderFrame, 1);
	}

	var FPSPrecision = 300;
	var $FPSLabel = document.getElementById('FPSLabel');
	var $PointCounter = document.getElementById('PointCounter');

	
	/*setInterval(function(){
		$FPSLabel.innerHTML = (1000 / frameTime * 1000 / FPSPrecision).toFixed(3) + ' fps';
		$PointCounter.innerHTML = H.Physics.GravitySolver.particles.length + ' points';
		frameCounter = 0;
	}, FPSPrecision);*/


	R.Clear('#774040');

//	RenderFrame();

	var angle = 0;

	RenderFrame();

});