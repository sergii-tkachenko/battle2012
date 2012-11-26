var BIGDOT = 4;
var SELECTRADIUS = 20;

H.Physics = {
	GravitySolver: {

		particles: [],
		paths: [],

		Init: function(opts)
		{
			this.O = $.extend({}, {
				numParticles: 600,
				distThresh: 150,
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

		namedParticles: {},

		AddNamedPoint: function(name, x, y, tags)
		{
			var id = this.particles.length;

			var xtags = {};
			for(var tI in tags)
				xtags[tags[tI]] = true;
			
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
					tags: xtags,
					time: new Date().getTime()
				});
			}
			else
			{
				var pI = this.namedParticles[name];

				if(typeof this.particles[pI] == 'undefined')
					return;
				
				if(!(this.particles[pI].w + 2 >= BIGDOT * 4))
					this.particles[pI].w += 3;

				this.particles[pI].r = 0.7 * this.particles[pI].w;
				this.particles[pI].time = new Date().getTime();
				
				for (var tI in tags)
					this.particles[pI].tags[tI] = true;	
			}
		},

		FindPathVertices: function(pI)
		{
			for(var pI in this.paths)
			{
				var path = this.paths[pI];

				if(path[path.length-1] == pI)
					return path;
			}

			return false;
		},

		RenderHeavyLinks: function(C)
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

					if (p1.r >= BIGDOT && p2.r >= BIGDOT && (p1.tags[p2.name] === true || p2.tags[p1.name] === true))
					{
						C.beginPath();
						C.strokeStyle = "rgba(255, 255, 255, "+ (1.1-dist/this.O.distThresh) +")";
						C.lineWidth = 1;

						if (p1.r >= BIGDOT*2 || p2.r >= BIGDOT*2)
							C.lineWidth = 2;

						C.moveTo(p1.x, p1.y);
						C.lineTo(p2.x, p2.y);
						C.stroke();
						C.closePath();
					}
				}
			}
		},

		FindPointsUnderCursor: function(x, y)
		{
			var result = [];

			for(var pI in this.particles)
			{
				var pt = this.particles[pI];
				if(Math.abs(pt.x - x) <= SELECTRADIUS && Math.abs(pt.y - y) <= SELECTRADIUS)
					result.push(pt);
			}

			return result;
		},

		RenderHoverPoint: function(pt, C, renderedTags)
		{
			var ss = C.strokeStyle;
			var fs = C.fillStyle;

			C.strokeStyle = 'rgba(255, 255, 255, 0.3)';
			C.fillStyle = 'rgba(255, 255, 255, 0.3)';
			C.lineWidth = 1;

			C.beginPath();
			C.arc(pt.x, pt.y, pt.r + SELECTRADIUS, 0, Math.PI*2);
			C.stroke();
			C.closePath();

			C.globalAlpha = 1;
			C.font = 'normal 14px Arial';
			C.fillText(pt.name, pt.x + pt.r + 10, pt.y);

			renderedTags.push(pt.name);

			for(var tI in pt.tags)
			{
				var pI = this.namedParticles[tI];
				var p2 = this.particles[pI];

				if (typeof p2 == 'undefined')
					continue;

				if(renderedTags.indexOf(p2.name) >= 0)
					continue;

				C.beginPath();
				C.moveTo(pt.x, pt.y);
				C.lineTo(p2.x, p2.y);
				C.stroke();
				C.closePath();
				C.font = 'normal 10px Arial';
				C.fillText(p2.name, p2.x + p2.r + 10, p2.y);

			//	this.RenderHoverPoint(p2, C, renderedTags);
			}

			for(var tI in pt.tags)
			{
				var pI = this.namedParticles[tI];
				var p2 = this.particles[pI];

				if (typeof p2 == 'undefined')
					continue;

				renderedTags.push(p2.name);

				this.RenderPointDirectLinks(p2, C, true, true, renderedTags);
			}
			
			C.strokeStyle = ss;
			C.fillStyle = fs;
		},

		Update: function(C)
		{
			this.paths = [];

			var delUS = [];

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

				if(p1.vx == 0 || p1.vy == 0)
				{
					delUS.push(pI1);
					continue;
				}

				for( ; pI2 < pI2End; pI2++)
				{
					var p2 = this.particles[pI2];
					
					var dx = p1.x - p2.x;
					var dy = p1.y - p2.y;
					var dist = Math.sqrt(dx*dx + dy*dy);

					if(/*dist <= this.O.distThresh && */(p1.tags[p2.name] === true || p2.tags[p1.name] === true))
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

						if (p1.vx > H.Demo.Options.speedLimit) p1.vx = H.Demo.Options.speedLimit;
						else if (p1.vx < -H.Demo.Options.speedLimit) p1.vx = -H.Demo.Options.speedLimit;

						if (p1.vy > H.Demo.Options.speedLimit) p1.vy = H.Demo.Options.speedLimit;
						else if (p1.vy < -H.Demo.Options.speedLimit) p1.vy = -H.Demo.Options.speedLimit;

						if (p2.vx > H.Demo.Options.speedLimit) p2.vx = H.Demo.Options.speedLimit;
						else if (p2.vx < -H.Demo.Options.speedLimit) p2.vx = -H.Demo.Options.speedLimit;

						if (p2.vy > H.Demo.Options.speedLimit) p2.vy = H.Demo.Options.speedLimit;
						else if (p2.vy < -H.Demo.Options.speedLimit) p2.vy = -H.Demo.Options.speedLimit;
				
						p1.x += p1.vx;
						p1.y += p1.vy;
						p2.x += p2.vx;
						p2.y += p2.vy;
					}

					
					
				//	p2.x += p2.vx / 10;
				//	p2.y += p2.vy / 10;

				//	if (p1.r >= BIGDOT && p2.r >= BIGDOT && (p1.tags.indexOf(p2.name) != -1 || p2.tags.indexOf(p1.name) != -1))
					if (p1.r >= BIGDOT && p2.r >= BIGDOT && ((p1.tags[p2.name] === true || p2.tags[p1.name] === true) || (dist <= this.O.distThresh && H.Demo.Options.dynamicLinks)))
					{
						/*
						var path = this.FindPathVertices(pI1);
						if(path){
							path.push(pI1);
						}
						else
							path = [pI1, pI2];

						console.log(path);
						*/

						C.beginPath();
						C.strokeStyle = "rgba(255, 255, 255, "+ (1.1-dist / this.O.distThresh * 1.7) +")";
						C.lineWidth = 1;

						if (p1.r >= BIGDOT*2 || p2.r >= BIGDOT*2)
							C.lineWidth = 2;

						C.moveTo(p1.x, p1.y);
						C.lineTo(p2.x, p2.y);
						C.stroke();
						C.closePath();

					//	this.RenderPointDirectLinks(p2, C, true);
					}
				}

				/*var deccelerate = 0.0001;
				if(p1.vx > 0) p1.vx = Math.max(p1.vx - deccelerate, 0);
				else p1.vx = Math.min(p1.vx + deccelerate, 0);

				if(p1.vy > 0) p1.vy = Math.max(p1.vy - deccelerate, 0);
				else p1.vy = Math.min(p1.vy + deccelerate, 0);
				*/
			}

			for(var dI in delUS)
			{
				this.particles = this.particles.splice(delUS[dI], 1);
			}
		},

		RenderPointDirectLinks: function(pt, C, showNames, recursive, renderedTags)
		{
			var ss = C.strokeStyle;
			var fs = C.fillStyle;

			C.strokeStyle = 'rgba(255, 255, 255, 0.3)';
			C.fillStyle = 'rgba(255, 255, 255, 0.3)';
			C.lineWidth = 1;

			for(var tI in pt.tags)
			{
				var pI = this.namedParticles[tI];
				var p2 = this.particles[pI];

				if (typeof p2 == 'undefined')
					continue;

				if(renderedTags.indexOf(p2.name) >= 0)
					continue;

				C.beginPath();
				
				C.moveTo(pt.x, pt.y);
				C.lineTo(p2.x, p2.y);
				C.stroke();
				C.closePath();

				if(showNames)
				{
					C.font = 'normal 10px Arial';
					C.fillText(p2.name, p2.x + p2.r + 10, p2.y);
				}

				renderedTags.push(p2.name);
				this.RenderPointDirectLinks(p2, C, showNames, recursive, renderedTags);
			}

			C.strokeStyle = ss;
			C.fillStyle = fs;
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

				//	this.RenderPointDirectLinks(pt, C, false);
				}
			}

			C.fillStyle = fs;
		}
	}
}
