H.Render = {
	Line: function(from, to)
	{
		this.ctx.moveTo(from.x, from.y);
		this.ctx.lineTo(to.x, to.y);
	},

	Rect: function(lt, rb)
	{
		this.ctx.rect(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
		this.ctx.stroke();
	},

	FillRect: function(lt, rb, fill)
	{
		this.ctx.fillStyle = fill;
		this.ctx.fillRect(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y);
	},

	Clear: function(fill)
	{
		var fs = this.ctx.fillStyle;
		var gco = this.ctx.globalCompositeOperation;
		var ga = this.ctx.globalAlpha;

		this.ctx.fillStyle = fill;
		this.ctx.fillRect(0, 0, H.O.width, H.O.height);

		this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.globalAlpha = ga;
		this.ctx.fillStyle = fs;
	},

	Circle: function(center, r)
	{
		this.ctx.beginPath();
		this.ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
		this.ctx.fill();
	}
};

H.R = H.Render;