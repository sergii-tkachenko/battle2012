var BIGDOT = 6;

H.Physics = {
	GravitySolver: {

		particles: [],

		Init: function(opts)
		{
			this.O = $.extend({}, {
				numParticles: 600,
				distThresh: 420,
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
				var w = Math.Random(4, 6);
				
				if(Math.RandomInt(0, 100) > 97)
					w = Math.Random(13, 16);

				var x = Math.RandomInt(0, this.O.width);
				var y = Math.RandomInt(0, this.O.height);

				var sign = Math.RandomInt(0, 100) > 500 ? 1 : -1

				this.particles.push({
					x: x,
					y: y,
					r: 0.3 * w,
					w: w,
					vx: 0,//Math.Random(-0.5, 0.5) * w / 10,
					vy: 0//Math.Random(-0.5, 0.5) * w / 10
				});
			}
		},

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
				r: 10,
				w: 10,
				vx: 0,
				vy: 0,
				name: '',
				tags: []
			});
		},

		namedParticles: [],

		AddNamedPoint: function(name, x, y, tags)
		{
			var id = this.particles.length;

			if (!this.namedParticles[name])
			{
				this.namedParticles[name] = id;

				this.particles.push({
					x: x,
					y: y,
					r: 2,
					w: 2,
					vx: Math.Random(-0.5, 0.5),
					vy: Math.Random(-0.5, 0.5),
					name: name,
					tags: tags
				});
			}
			else
			{
				var pI = this.namedParticles[name];
				
				if(!(this.particles[pI].w+2 >= BIGDOT * 3))
					this.particles[pI].w += 2;

				this.particles[pI].r = 0.7 * this.particles[pI].w;
				this.particles[pI].tags = this.particles[pI].tags.concat(tags);
			}
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

					if(/*dist <= this.O.distThresh && */(p1.tags.indexOf(p2.name) != -1 || p2.tags.indexOf(p1.name) != -1))
					{
						var ax = dx / 5000;
						var ay = dy / 5000;

						p1.vx -= ax * p2.w / 150;
						p1.vy -= ay * p2.w / 150;
						p2.vx += ax * p1.w / 150;
						p2.vy += ay * p2.w / 150;

						if (p1.x+p1.vx+p1.r > this.O.width && p1.vx > 0) p1.vx = -p1.vx;
						if (p1.y+p1.vy+p1.r > this.O.height && p1.vy > 0) p1.vy = -p1.vy;
						if (p1.x+p1.vx-p1.r < 0 && p1.vx < 0) p1.vx = -p1.vx;
						if (p1.y+p1.vy-p1.r < 0 && p1.vy < 0) p1.vy = -p1.vy;

						
						if (p1.vx > 0) p1.vx = Math.min(p1.vx, 0.4);
						else	p1.vx = Math.max(p1.vx, -0.4)

						if (p1.vy > 0) p1.vy = Math.min(p1.vy, 0.4);
						else	p1.vy = Math.max(p1.vy, -0.4)

						if (p2.vx > 0) p2.vx = Math.min(p2.vx, 0.4);
						else	p2.vx = Math.max(p2.vx, -0.4)

						if (p2.vy > 0) p2.vy = Math.min(p2.vy, 0.4);
						else	p2.vy = Math.max(p2.vy, -0.4)
						

						p1.x += p1.vx;
						p1.y += p1.vy;
						p2.x += p2.vx;
						p2.y += p2.vy;

						
											
					}

					
					
				//	p2.x += p2.vx / 10;
				//	p2.y += p2.vy / 10;

					if (p1.r >= BIGDOT && p2.r >= BIGDOT && (p1.tags.indexOf(p2.name) != -1 || p2.tags.indexOf(p1.name) != -1))
					{
						C.beginPath();
						C.strokeStyle = "rgba(255, 255, 255, "+ (1.1-dist/this.O.distThresh) +")";
						C.lineWidth = 1;
						C.moveTo(p1.x, p1.y);
						C.lineTo(p2.x, p2.y);
						C.stroke();
						C.closePath();
					}
				}

				/*var deccelerate = 0.0001;
				if(p1.vx > 0) p1.vx = Math.max(p1.vx - deccelerate, 0);
				else p1.vx = Math.min(p1.vx + deccelerate, 0);

				if(p1.vy > 0) p1.vy = Math.max(p1.vy - deccelerate, 0);
				else p1.vy = Math.min(p1.vy + deccelerate, 0);
				*/
			}
		},

		Render: function(C)
		{
			var fs = C.fillStyle;

			for(var pI in this.particles)
			{

				C.fillStyle = 'rgba(255, 255, 255, ' + 1 + ')';
				C.beginPath();
				C.strokeStyle = 'none';

				var pt = this.particles[pI];
				C.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);

				C.stroke();
				C.fill();
				C.closePath();

			//	var speed = 'dx: ' + pt.dx + "\nff: " + pt.ff;

				if(pt.r >= BIGDOT)
				{
					C.font = 'italic ' + Math.floor(1.5 * pt.w) + 'px Arial';
					C.fillText(pt.name, pt.x + pt.r + 10, pt.y);
				}

			}

			C.fillStyle = fs;
		}
	}
}