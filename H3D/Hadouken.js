var Hadouken3D = {
	
	Init: function(containerID, opts)
	{
		this.O = $.extend({}, {
			width: 640,
			height: 480
		}, opts);

		var self = this;

		$(function(){
			var container = $('#' + containerID);
			var canvas = $('<canvas></canvas>').attr({
				'width' : self.O.width,
				'height' : self.O.height
			});

			canvas.appendTo(container);

			self.Render.ctx = canvas[0].getContext('2d');

			self.selfReady = true;
			self.OnReady();
		});
	},

	/////////////////////////////////////////////////
	//        READINESS

	onReadyCB: function(){},

	Ready: function(cb)
	{
		this.onReadyCB = cb;
	},

	OnReady: function()
	{
		this.onReadyCB.call(this);
	}

};

var H = Hadouken3D;