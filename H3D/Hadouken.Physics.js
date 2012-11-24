H.Physics = {
	GravitySolver: {

		particles: [],

		Init: function(opts)
		{
			this.O = $.extend({}, {
				numParticles: 700,
				distThresh: 100,
				gen: {
					weightBounds: [0.5, 4]
				},

				width: 200,
				height: 200
			}, opts);
		},

		Generate: function()
		{
			for (var c = 0; c < this.O.numParticles; c++)
			{
				var w = Math.Random(1, 1.5);
				
				if(Math.RandomInt(0, 100) > 90)
					w = Math.Random(5, 7);

				var x = Math.RandomInt(0, this.O.width);
				var y = Math.RandomInt(0, this.O.height);

				this.particles.push({
					x: x,
					y: y,
					r: 1 * w,
					w: w,
					vx: 0,
					vy: 0
				});
			}
		},

		Update: function(C)
		{
			for(var pI1 in this.particles)
			{
				var p1 = this.particles[pI1];

				if (p1.x+p1.r > this.O.width) p1.x = p1.r;
				if (p1.y+p1.r > this.O.height) p1.y = p1.r;
				if (p1.x-p1.r < 0) p1.x = this.O.width - p1.r;
				if (p1.y-p1.r < 0) p1.y = this.O.height - p1.r;

				for(var pI2 = parseInt(pI1) + 1; pI2 < this.particles.length; pI2++)
				{
					var p2 = this.particles[pI2];
					
					var dx = p1.x - p2.x;
					var dy = p1.y - p2.y;
					var dist = Math.sqrt(dx*dx + dy*dy);

					if(dist <= this.O.distThresh)
					{
						
						var ax = dx / 165 / 3 / this.particles.length / 10;
						var ay = dy / 165 / 3 / this.particles.length / 10;

						p1.vx += ax * p2.w;
						p1.vy += ay * p2.w;

						p2.vx += ax * p1.w;
						p2.vy += ay * p1.w;

						p1.x -= p1.vx;
						p1.y -= p1.vy;

						if (p1.w >= 3 && p2.w >= 3)
						{
							C.beginPath();
							C.strokeStyle = "rgba(255, 255, 255, "+ (1.1-dist/this.O.distThresh) +")";
							C.moveTo(p1.x, p1.y);
							C.lineTo(p2.x, p2.y);
							C.stroke();
							C.closePath();
						}
					}
				}
			}
		},

		Render: function(C)
		{
			var fs = C.fillStyle;

			C.fillStyle = '#ffffff';

			for(var pI in this.particles)
			{
				var pt = this.particles[pI];

				C.beginPath();
				C.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
				C.stroke();
				C.fill();
			}

			C.fillStyle = fs;
		}
	}
}