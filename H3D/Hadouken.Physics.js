H.Physics = {
	GravitySolver: {

		particles: [],

		Init: function(opts)
		{
			this.O = $.extend({}, {
				numParticles: 800,
				distThresh: 80,
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
				var w = Math.Random(2, 4);
				
				if(Math.RandomInt(0, 100) > 90)
					w = Math.Random(10, 14);

				var x = Math.RandomInt(0, this.O.width);
				var y = Math.RandomInt(0, this.O.height);

				this.particles.push({
					x: x,
					y: y,
					r: 0.4 * w,
					w: w,
					vx: 0,
					vy: 0
				});
			}
		},

		/*
		Generate: function()
		{
			var x = 0;
			var y = 0;

			var step = 20;

			for (var c = 0; c < this.O.numParticles; c++)
			{
				var w = Math.Random(4, 8);
				
				if(Math.RandomInt(0, 100) > 70)
					w = Math.Random(15, 17);

				x += step;
				if (x > this.O.width)
				{
					y += step;
					if (y > this.O.height) y = 0;

					x = 0;
				}

				this.particles.push({
					x: x,
					y: y,
					r: 0.3 * w,
					w: w,
					vx: 0,
					vy: 0
				});
			}
		},
		*/

		FGenerate: function()
		{
			this.particles = [/*
				{
					x: 100,
					y: 100,
					r: 1 * 5,
					w: 3,
					vx: 0,
					vy: 0
				},
				{
					x: 200,
					y: 150,
					r: 1 * 7,
					w: 3,
					vx: 0,
					vy: 0
				}*/

				/*,
				{
					x: 220,
					y: 80,
					r: 1 * 9,
					w: 6,
					vx: 0,
					vy: 0
				}
				*/
			];
		},

		AddPoint: function(x, y)
		{
			this.particles.push({
				x: x,
				y: y,
				r: 5,
				w: 5,
				vx: 0,
				vy: 0
			});
		},

		Update: function(C)
		{
			for(var pI1 in this.particles)
			{
				var p1 = this.particles[pI1];
				var pI2 = parseInt(pI1) + 1;
				var pI2End = this.particles.length
				if (pI2 >= this.particles.length)
				{
					pI2 = 0;
					pI2End = 0;
				}

				for( ; pI2 < pI2End; pI2++)
				{
					var p2 = this.particles[pI2];
					
					var dx = p1.x - p2.x;
					var dy = p1.y - p2.y;
					var dist = Math.sqrt(dx*dx + dy*dy);

					if(dist <= this.O.distThresh)
					{
						var ax = dx / 9000;
						var ay = dy / 9000;

						p1.vx -= ax;
						p1.vy -= ay;
						p2.vx += ax;
						p2.vy += ay;

						if (p1.x+p1.vx+p1.r > this.O.width && p1.vx > 0) p1.vx = -p1.vx;
						if (p1.y+p1.vy+p1.r > this.O.height && p1.vy > 0) p1.vy = -p1.vy;
						if (p1.x+p1.vx-p1.r < 0 && p1.vx < 0) p1.vx = -p1.vx;
						if (p1.y+p1.vy-p1.r < 0 && p1.vy < 0) p1.vy = -p1.vy;

						p1.x += p1.vx * p2.w / 150;
						p1.y += p1.vy * p2.w / 150;
						p2.x += p2.vx * p1.w / 150;
						p2.y += p2.vy * p1.w / 150;
											
					}

					

				//	p2.x += p2.vx / 10;
				//	p2.y += p2.vy / 10;

					if (p1.w >= 10 && p2.w >= 10)
					{
						C.beginPath();
						C.strokeStyle = "rgba(255, 255, 255, "+ (1.1-dist/this.O.distThresh) +")";
						C.moveTo(p1.x, p1.y);
						C.lineTo(p2.x, p2.y);
            C.lineWidth = 2;
						C.stroke();
						C.closePath();
					}
				}
			}
		},

		Render: function(C)
		{
			var fs = C.fillStyle;

			for(var pI in this.particles)
			{

				C.fillStyle = 'rgba(255, 255, 255, ' + 1 + ')';
				C.beginPath();

				var pt = this.particles[pI];
				C.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);

				C.stroke();
				C.fill();
				C.closePath();

			//	var speed = 'dx: ' + pt.dx + "\nff: " + pt.ff;
			//	C.fillText(speed, pt.x+10, pt.y+10);

			}

			C.fillStyle = fs;
		}
	}
}
