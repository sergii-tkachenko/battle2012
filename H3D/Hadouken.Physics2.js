var BIGDOT = 6;


H.Physics = {
	GravitySolver: {

		speed: 10,
		maxParticlesSpeed: 25,

		mouseCoords: new Math.float2(-100, -100),

		particles: [],

		_connected: [],

		pointsIn2DProjection: null,

		specialName: "hadouken",

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
				deep: 500,
				visionLimit: 1000,
				transformMatrix: Math.float4x4.Translate(new Math.float3(0, 0, 200)).mul(Math.float4x4.RotateX(Math.Degree2Radian(-60))),

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
					z += step;
					if (z > this.O.deep)
						z = 10;
					if (y > this.O.height)
					{
						y = 10;
					}

					x = 10;
				}

				var p = new Math.float3(x, y, z);//this.O.center.x, this.O.center.y, this.O.center.z);
				p.r = 0.3 * w;
				p.w = w;
				p.v = new Math.float3(0, 0, 0
					// Math.RandomInt(0, 1),
					// Math.RandomInt(0, 1),
					// Math.RandomInt(0, 0)
				);
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
			p.v = new Math.float3(0, 0, 0);
			this.particles.push(p);
		},

		GetSelectedPoint: function(x, y, radius)
		{
			if (!radius)
				radius = 0;
			for (var pI in this.pointsIn2DProjection)
			{
				for (var ppI in this.pointsIn2DProjection[pI])
				{

					var point = this.pointsIn2DProjection[pI][ppI].point;
					if (new Math.float2(x, y).dist(point) < radius + this.pointsIn2DProjection[pI][ppI].r)
					{
						return this.pointsIn2DProjection[pI][ppI];
					}
				}
			}
		},

		namedParticles: [],

		AddNamedPoint: function(name, x, y, z, tags)
		{
			var id = this.particles.length;

			if (!this.namedParticles[name])
			{
				this.namedParticles[name] = id;

				var p = new Math.float3(x, y, z);
				if (name == this.specialName)
				{
					p.w = BIGDOT * 3;
					p.r = 0.7 * p.w;
				}
				else
				{
					p.w = 2;
					p.r = 2;
				}
				p.name = name;
				p.tags = tags;
				p.v = new Math.float3(Math.Random(-0.5, 0.5), Math.Random(-0.5, 0.5), Math.Random(-0.5, 0.5));
				this.particles.push(p);
			}
			else
			{
				var pI = this.namedParticles[name];

				if(!(this.particles[pI].w + 2 >= BIGDOT * 3) || name == this.specialName)
					this.particles[pI].w += 2;

				this.particles[pI].r = 0.7 * this.particles[pI].w;
				this.particles[pI].tags = this.particles[pI].tags.concat(tags);
			}
		},


		Update: function(C)
		{
			if (this.speed == 0)
				return;
			this._connected = [];
			for(var pI1 in this.particles)
			{
				var p1 = this.particles[pI1];
				var f = false;

				for(var pI2 = parseInt(pI1) + 1; pI2 < this.particles.length; pI2++)
				{
					var p2 = this.particles[pI2];

					var dist = p1.dist(p2);

					if (p1.tags.indexOf(p2.name) != -1 || p2.tags.indexOf(p1.name) != -1 || dist <= this.O.distThresh * (p1.w + p2.w) / BIGDOT / 3)
					{
						var v1 = p2.sub(p1);

						var F = 1 / (dist < 10 ? 10 : dist) / 5000 * this.speed * (this.particles.length / 2000);

						var a1 = p2.w / p1.w * F;
						var vv1 = p1.v.add(v1);
						p1.v = p1.v.add(vv1.mulNumber(a1)).mulNumber(1 - a1 * 0.6);
						// if (p1.v.x)

						var a2 = p1.w / p2.w * F;
						var vv2 = p2.v.sub(v1);
						p2.v = p2.v.add(vv2.mulNumber(a2)).mulNumber(1 - a2 * 0.6);

						if (p1.r >= BIGDOT && p2.r >= BIGDOT && (p1.tags.indexOf(p2.name) != -1 || p2.tags.indexOf(p1.name) != -1))
						{
							this._connected.push({p1: pI1, p2: pI2, dist: dist});
						}
					}
				}
			}

			// var count = 0;
			for(var pI1 in this.particles)
			{
				var p1 = this.particles[pI1];

				if (p1.x + p1.r + p1.v.x > this.O.width || p1.x + p1.v.x - p1.r < 0 ||
					p1.y + p1.r + p1.v.y > this.O.height || p1.y + p1.v.y - p1.r < 0 ||
					p1.z + p1.r + p1.v.z > this.O.deep || p1.z + p1.v.z - p1.r < 0)
				{
					// count++;
					var dist = this.O.center.dist(p1);
					var v1 = this.O.center.sub(p1);

					var F = 1 / (dist < 10 ? 10 : dist) / 50 * this.speed;

					var a1 = 1 / p1.w * F;
					var vv1 = p1.v.add(v1);
					p1.v = p1.v.add(vv1.mulNumber(a1)).mulNumber(1 - a1 * 0.6);
				}
				var l = p1.v.length();
				if (l > this.maxParticlesSpeed)
				{
					p1.v = p1.v.mulNumber(0.9);
				}


				p1.x += p1.v.x;
				p1.y += p1.v.y;
				p1.z += p1.v.z;
				// if (Math.abs(p1.v.x) > 25)
				// 	p1.v.x -= p1.v.x / Math.abs(p1.v.x) * 0.00001;
				// if (Math.abs(p1.v.y) > 25)
				// 	p1.v.y -= p1.v.y / Math.abs(p1.v.y) * 0.00001;
				// if (Math.abs(p1.v.z) > 25)
				// 	p1.v.z -= p1.v.z / Math.abs(p1.v.z) * 0.00001;
			}
			// if (count != 0)
			// console.log(count);
		},

		Render: function(C)
		{
			this.pointsIn2DProjection = {};
			var connectPoints = [];
			var tMatrix = Math.float4x4.Projection(new Math.float3(0, 0, this.O.visionLimit));
			if (this.O.transformMatrix != null)
				tMatrix = tMatrix.mul(this.O.transformMatrix);

			// var gran = [
			// 	new Math.float3(0, 0, 0),
			// 	new Math.float3(this.O.width, 0, 0),
			// 	new Math.float3(this.O.width, this.O.height, 0),
			// 	new Math.float3(0, this.O.height, 0),
			// 	new Math.float3(0, 0, 0),
			// 	new Math.float3(0, 0, this.O.deep),
			// 	new Math.float3(this.O.width, 0, this.O.deep),
			// 	new Math.float3(this.O.width, 0, 0),
			// 	new Math.float3(this.O.width, 0, this.O.deep),
			// 	new Math.float3(this.O.width, this.O.height, this.O.deep),
			// 	new Math.float3(0, this.O.height, this.O.deep),
			// 	new Math.float3(0, 0, this.O.deep),
			// 	new Math.float3(0, this.O.height, this.O.deep),
			// 	new Math.float3(this.O.width, this.O.height, this.O.deep),
			// 	new Math.float3(this.O.width, this.O.height, 0),
			// 	new Math.float3(0, this.O.height, 0),
			// 	new Math.float3(0, this.O.height, this.O.deep),
			// ];
			// C.strokeStyle = "#000000";
			// var p = gran[0].sub(this.O.center);
			// p = tMatrix.mulFloat3(p);
			// p = p.add(this.O.center);
			// C.moveTo(p.x, p.y);
			// for (var i in gran)
			// {
			// 	var p = gran[i].sub(this.O.center);
			// 	p = tMatrix.mulFloat3(p);
			// 	p = p.add(this.O.center);
			// 	C.lineTo(p.x, p.y);
			// }
			// C.stroke();

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
					if (!(xpt.z in this.pointsIn2DProjection))
						this.pointsIn2DProjection[xpt.z] = [];
					this.pointsIn2DProjection[xpt.z].push({point: xpt, index: pI, r: r});
					connectPoints[pI] = xpt;
				}
			}

			var keys = Object.keys(this.pointsIn2DProjection);
			for (var i = keys.length - 1; i >= 0; i--)
			{
				var pI = keys[i];
				for (var ppI in this.pointsIn2DProjection[pI])
				{
					var xpt = this.pointsIn2DProjection[pI][ppI];
					var fs = C.fillStyle;

					var alpha =  1 -(xpt.point.z / this.O.visionLimit);

					C.globalAlpha = alpha;
					if (this.particles[xpt.index].name == this.specialName)
					{
						C.beginPath();
						C.fillStyle = "rgba(0, 100, 0, 0.2)";
						C.arc(xpt.point.x, xpt.point.y, xpt.r * 2, 0, Math.PI * 2);
						// C.stroke();
						C.fill();
						C.fillStyle = "rgb(0, 200, 0)";
						C.closePath();
					}
					C.beginPath();
					C.arc(xpt.point.x, xpt.point.y, xpt.r, 0, Math.PI * 2);
					// C.stroke();
					C.fill();
					C.fillStyle = fs;

					if(this.particles[xpt.index].r >= BIGDOT)
					{
						C.font = 'italic ' + Math.floor(1.5 * this.particles[xpt.index].w) + 'px Arial';
						C.fillText(this.particles[xpt.index].name, xpt.point.x + xpt.r + 10, xpt.point.y);
					}
				}
			}
			for (var connect in this._connected)
			{
				var p1 = connectPoints[this._connected[connect].p1],
					p2 = connectPoints[this._connected[connect].p2];
				if (p1 == null || p2 == null)
					continue;

				var ss = C.strokeStyle;
				C.strokeStyle = "rgba(255, 255, 255, "+ (1.1 - this._connected[connect].dist / this.O.distThresh) +")";
				C.beginPath();
				C.lineWidth = 1;
				C.moveTo(p1.x, p1.y);
				C.lineTo(p2.x, p2.y);
				C.lineWidth = 2;
				C.stroke();
				C.closePath();
				C.lineWidth = 1;
				C.strokeStyle = ss;
			}

			// if (this.speed == 0)
			// {
				var xpt = H.Physics.GravitySolver.GetSelectedPoint(this.mouseCoords.x, this.mouseCoords.y, 10);
				var C = H.Render.ctx;
				if (xpt != null)
				{
					C.beginPath();
					C.arc(xpt.point.x, xpt.point.y, xpt.r + 10, 0, Math.PI * 2);
					C.stroke();
					var p1 = this.particles[xpt.index];
					for (var i = keys.length - 1; i >= 0; i--)
					{
						var pI = keys[i];
						for (var ppI in this.pointsIn2DProjection[pI])
						{
							var p2 = this.particles[this.pointsIn2DProjection[pI][ppI].index];
							if (p1.tags.indexOf(p2.name) != -1 || p2.tags.indexOf(p1.name) != -1)
							{
								var ss = C.strokeStyle;
								C.strokeStyle = "rgba(200, 200, 200, 0.4)";
								C.beginPath();
								C.lineWidth = 1;
								C.moveTo(xpt.point.x, xpt.point.y);
								C.lineTo(this.pointsIn2DProjection[pI][ppI].point.x, this.pointsIn2DProjection[pI][ppI].point.y);
								C.lineWidth = 2;
								C.stroke();
								C.closePath();
								C.lineWidth = 1;
								C.strokeStyle = ss;
							}
						}
					}
				}
			// }

			// delete this.pointsIn2DProjection;
			// delete connectPoints;

		}
	}
}
