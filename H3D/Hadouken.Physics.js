H.Physics = {
	GravitySolver: {

		particles: [],

		_connected: [],

		Init: function(opts)
		{
			this.O = $.extend({}, {
				numParticles: 600,
				distThresh: 100,
				gen: {
					weightBounds: [0.5, 4]
				},

				width: 200,
				height: 200,
				deep: 400,
				visionLimit: 1000,
				transformMatrix: Math.float4x4.RotateX(Math.Degree2Radian(45)),

			}, opts);
			if (this.O.center == null)
				this.O.center = new Math.float3(this.O.width / 2, this.O.height / 2, this.O.deep / 2);
			// this.O.transformMatrix = this.O.transformMatrix;
		},

		Generate: function()
		{
			for (var c = 0; c < this.O.numParticles; c++)
			{
				var w = Math.Random(1, 1.5);

				if(Math.RandomInt(0, 100) > 95)
					w = Math.Random(3, 6);

				var x = Math.RandomInt(0, this.O.width);
				var y = Math.RandomInt(0, this.O.height);
				var z = Math.RandomInt(0, this.O.deep);

				var p = new Math.float3(x, y, z);
				p.r = 2 * w;
				p.w = w;
				p.vx = 0;
				p.vy = 0;
				p.vz = 0;
				this.particles.push(p);
			}
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
						var ax = diff.x / 165 / 3 / this.particles.length;
						var ay = diff.y / 165 / 3 / this.particles.length;
						var az = diff.z / 165 / 3 / this.particles.length;

						p1.vx += ax * p2.w;
						p1.vy += ay * p2.w;
						p1.vz += az * p2.w;

						p2.vx += ax * p1.w;
						p2.vy += ay * p1.w;
						p2.vz += az * p1.w;

						p1.x -= p1.vx;
						p1.y -= p1.vy;
						p1.z -= p1.vz;

						p2.x += p2.vx;
						p2.y += p2.vy;
						p2.z += p2.vz;

						if (p1.x + p1.r >= this.O.width || p1.y + p1.r >= this.O.height ||
							p1.z + p1.r >= this.O.deep || p1.x - p1.r <= 0 ||
							p1.y - p1.r <= 0 || p1.z - p1.r <= 0)
							f = false;

						if (p1.w >= 3 && p2.w >= 3)
						{
							this._connected.push({p1: pI1, p2: pI2, dist: dist});
						}

						/*
						console.log(p1.vx);
						console.log(p1.vy);
						*/
					}
				}
				if (!f)
				{
					var diff = p1.sub(this.O.center);
					var ax = diff.x / 165 / 3 / this.particles.length;
					var ay = diff.y / 165 / 3 / this.particles.length;
					var az = diff.z / 165 / 3 / this.particles.length;

					p1.vx -= ax;
					p1.vy -= ay;
					p1.vz -= az;

					p1.x += p1.vx;
					p1.y += p1.vy;
					p1.z += p1.vz;
				}

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

			for (var pI in this.particles)
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
				C.strokeStyle = "rgba(0, 0, 0, "+ (1.1-this._connected[connect].dist/this.O.distThresh) +")";
				C.moveTo(p1.x, p1.y);
				C.lineTo(p2.x, p2.y);
				C.stroke();
				C.closePath();
			}

			delete newPoints;
			delete connectPoints;

		}
	}
}