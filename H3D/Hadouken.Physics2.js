H.Physics = {
	GravitySolver: {

		particles: [],

		_connected: [],

		Init: function(opts)
		{
			this.O = $.extend({}, {
				numParticles: 500,
				distThresh: 50,
				gen: {
					weightBounds: [0.5, 4]
				},

				width: 200,
				height: 200,
				deep: 400,
				visionLimit: 1000,
				transformMatrix: Math.float4x4.Translate(new Math.float3(0, 0, 400)).mul(Math.float4x4.RotateX(Math.Degree2Radian(-60))),

			}, opts);
			if (this.O.center == null)
				this.O.center = new Math.float3(this.O.width / 2, this.O.height / 2, this.O.deep / 2);
			// this.O.transformMatrix = this.O.transformMatrix;
		},


		Generate: function()
		{
			var x = 10;
			var y = 10;
			var z = 10;
			var w = 15;

			var step = 32;

			for (var c = 0; c < this.O.numParticles; c++)
			{
				w = Math.Random(4, 8);

				if (Math.RandomInt(0, 100) > 70)
					w = Math.Random(15, 17);

				x += step;

				if (x > this.O.width)
				{
					y += step;
					if (y > this.O.height)
					{
						y = 0;
						z += step;
					}

					x = 0;
				}

				var p = new Math.float3(x, y, z);
				p.r = 0.3 * w;
				p.w = w;
				p.vx = 0;
				p.vy = 0;
				p.vz = 0;
				this.particles.push(p);
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

		AddPoint: function(x, y, z)
		{
			var w = 4;
			var p = new Math.float3(x, y, z);
			p.r = 0.3 * w;
			p.w = w;
			p.vx = 0;
			p.vy = 0;
			p.vz = 0;
			this.particles.push(p);
		},

		Update: function(C)
		{
			this._connected = [];
			for(var pI1 in this.particles)
			{
				var p1 = this.particles[pI1];
				var f = false;

				for(var pI2 = parseInt(pI1) + 1; pI2 < this.particles.length; pI2++)
				{
					var p2 = this.particles[pI2];

					var dist = p1.dist(p2);

					if (dist <= this.O.distThresh)
					{
						f = true;

						var diff = p1.sub(p2);

						var F = 1 / dist / 200;

						var a1 = -(p2.w / p1.w) * F;
						p1.vx += a1 * diff.x;
						p1.vy += a1 * diff.y;
						p1.vz += a1 * diff.z;

						var a2 = (p1.w / p2.w) * F;
						p2.vx += a2 * diff.x;
						p2.vy += a2 * diff.y;
						p2.vz += a2 * diff.z;

						// if (p1.x + p1.r >= this.O.width || p1.y + p1.r >= this.O.height ||
						// 	p1.z + p1.r >= this.O.deep || p1.x - p1.r <= 0 ||
						// 	p1.y - p1.r <= 0 || p1.z - p1.r <= 0)
						// 	f = false;

						if (p1.w >= 15 && p2.w >= 15)
						{
							this._connected.push({p1: pI1, p2: pI2, dist: dist});
						}
					}
				}


				// p1.vx -= p1.vx / 5000;
				// p1.vy -= p1.vy / 5000;
				// p1.vz -= p1.vz / 5000;

				// if (!f)
				// {
				// 	var diff = p1.sub(this.O.center);

				// 	var Fx = diff.x == 0 ? 0 : -(p1.w) / diff.x;
				// 	var Fy = diff.y == 0 ? 0 : -(p1.w) / diff.y;
				// 	var Fz = diff.z == 0 ? 0 : -(p1.w) / diff.z;

				// 	p1.vx += diff.x * Fx;
				// 	p1.vy += diff.y * Fy;
				// 	p1.vz += diff.z * Fz;

				// 	p1.x += p1.vx;
				// 	p1.y += p1.vy;
				// 	p1.z += p1.vz;

				// }

			}

			for(var pI1 in this.particles)
			{
				var p1 = this.particles[pI1];

				if (p1.x+p1.r > this.O.width || p1.x-p1.r < 0) p1.vx = -p1.vx;
				if (p1.y+p1.r > this.O.height && p1.y-p1.r < 0) p1.vy = -p1.vy;
				if (p1.z+p1.r > this.O.deep && p1.z-p1.r < 0) p1.vz = -p1.vz;
				// if (p1.x-p1.r < 0 && p1.vx < 0) p1.vx = -p1.vx;
				// if (p1.y-p1.r < 0 && p1.vy < 0) p1.vy = -p1.vy
				// if (p1.z-p1.r < 0 && p1.vz < 0) p1.vz = -p1.vz

				p1.x += p1.vx;
				p1.y += p1.vy;
				p1.z += p1.vz;
			}
		},

		Render: function(C)
		{
			var newPoints = {};
			var connectPoints = [];
			var tMatrix = Math.float4x4.Projection(new Math.float3(0, 0, this.O.visionLimit));
			if (this.O.transformMatrix != null)
				tMatrix = tMatrix.mul(this.O.transformMatrix);

			var gran = [
				new Math.float3(0, 0, 0),
				new Math.float3(this.O.width, 0, 0),
				new Math.float3(this.O.width, this.O.height, 0),
				new Math.float3(0, this.O.height, 0),
				new Math.float3(0, 0, 0),
				new Math.float3(0, 0, this.O.deep),
				new Math.float3(this.O.width, 0, this.O.deep),
				new Math.float3(this.O.width, 0, 0),
				new Math.float3(this.O.width, 0, this.O.deep),
				new Math.float3(this.O.width, this.O.height, this.O.deep),
				new Math.float3(0, this.O.height, this.O.deep),
				new Math.float3(0, 0, this.O.deep),
				new Math.float3(0, this.O.height, this.O.deep),
				new Math.float3(this.O.width, this.O.height, this.O.deep),
				new Math.float3(this.O.width, this.O.height, 0),
				new Math.float3(0, this.O.height, 0),
				new Math.float3(0, this.O.height, this.O.deep),
			];
			C.strokeStyle = "#000000";
			var p = gran[0].sub(this.O.center);
			p = tMatrix.mulFloat3(p);
			p = p.add(this.O.center);
			C.moveTo(p.x, p.y);
			for (var i in gran)
			{
				var p = gran[i].sub(this.O.center);
				p = tMatrix.mulFloat3(p);
				p = p.add(this.O.center);
				C.lineTo(p.x, p.y);
			}
			C.stroke();

			for(var pI in this.particles)
			{
				var pt = this.particles[pI];
				var xpt = new Math.float3(pt.x, pt.y, pt.z);
				// pt.z = (pt.x - 200 + pt.y - 200) > 0 ? (pt.x - 200 + pt.y - 200) * 60 : 10;
				xpt = xpt.sub(this.O.center);

				/*
				//	Этот код рисует знак бесконечности
				pt.x = pt.x * aV.y - pt.y * aV.x;
				pt.y = pt.x * aV.x + pt.y * aV.y;
				*/

				xpt = tMatrix.mulFloat3(xpt);

				xpt = xpt.add(this.O.center);
				// xpt = Math.float4x4.Projection(pivot).mulFloat3(xpt);
				// pt2d = xpt.projection(deep);
				// if (xpt.z > 0 && xpt.z < this.O.visionLimit)
				// {
				var r = (1 - xpt.z / this.O.visionLimit) * this.particles[pI].r;
				if (r > 0)
				{
					if (!(xpt.z in newPoints))
						newPoints[xpt.z] = [];
					newPoints[xpt.z].push({point: xpt, r: r, fill: this.particles[pI].fill});
					connectPoints[pI] = xpt;
				}
			}
			var keys = Object.keys(newPoints);
			for (var i = keys.length - 1; i >= 0; i--)
			{
				var pI = keys[i];
				for (var ppI in newPoints[pI])
				{
					var xpt = newPoints[pI][ppI];
					var fs = C.fillStyle;

					var alpha =  1 -(xpt.point.z / this.O.visionLimit);
				//	C.fillStyle = "rgb(" + color + ", " + color + ", " + color + ")";// xpt.fill;
					// C.fillText(color, xpt.point.x, xpt.point.y);
					//
					C.globalAlpha = alpha;
					C.beginPath();
					C.arc(xpt.point.x, xpt.point.y, xpt.r, 0, Math.PI * 2);
					C.stroke();
					C.fill();
					C.fillStyle = fs;
				}
			}
			for (var connect in this._connected)
			{
				var p1 = connectPoints[this._connected[connect].p1],
					p2 = connectPoints[this._connected[connect].p2];
				if (p1 == null || p2 == null)
					continue;
				C.beginPath();
				C.fillStyle = 'rgba(0, 0, 0, ' + 1 + ')';
				C.strokeStyle = "rgba(0, 0, 0, "+ (1.1-this._connected[connect].dist/this.O.distThresh) +")";
				C.moveTo(p1.x, p1.y);
				C.lineTo(p2.x, p2.y);
				C.stroke();
				C.closePath();
	//			var speed = 'vx: ' + pt.vx + ', vy: ' + pt.vy;
			//	C.fillText(speed, pt.x+10, pt.y+10);

			}

			delete newPoints;
			delete connectPoints;

		}
	}
}