H.Math = {};

H.Math.Perspective = function(fov, aspect, zn, zf)
{
	var xScale = yScale / aspect;
	var yScale = 1.0 / Math.tan(fov / 2.0);

	var res = H.float4x4.Identity();
	res._[0][0] = xScale;
	res._[1][1] = yScale;
	res._[2][2] =  zf / (zf - zn);		res._[2][3] = 1.0;
	res._[3][2] = -zn * zf / (zf - zn);	res._[3][3] = 0.0;
	return res;
}

H.Math.Radian2Degree = function(x)
{
	return x / (Math.PI * 180);
}

H.Math.Degree2Radian = function(x)
{
	return x * (Math.PI / 180);
}

H.Math.Random = function(min, max)
{
	return Math.random() * (max - min) + min;
}

H.Math.RandomInt = function(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

H.float2 = function(x, y){
	this.x = x;
	this.y = y;
};

H.float2.prototype.cross = function(v2)
{
	return new H.float2(
		this.x * v2.y - this.y * v2.x
	);
}

H.float2.prototype.dist = function(v2)
{
	return Math.sqrt(this.dot(v2));
}

H.float2.prototype.sub = function(v2)
{
	return new H.float2(
		this.x - v2.x,
		this.y - v2.y
	);
}

H.float2.prototype.add = function(v2)
{
	return new H.float2(
		this.x + v2.x,
		this.y + v2.y
	);
}
H.float2.prototype.dist = function(v2)
{
	var sub = this.sub(v2);
	return Math.sqrt(sub.x * sub.x + sub.y * sub.y)
}

H.float3 = function(x, y, z){
	this.x = x;
	this.y = y;
	this.z = z;
};

H.float3.prototype.dot = function(v2)
{
	return this.x * v2.x + this.y * v2.y + this.z * v2.z;
}

H.float3.prototype.add = function(v2)
{
	return new H.float3(
		this.x + v2.x,
		this.y + v2.y,
		this.z + v2.z
	);
}

H.float3.prototype.sub = function(v2)
{
	return new H.float3(
		this.x - v2.x,
		this.y - v2.y,
		this.z - v2.z
	);
}

H.float3.prototype.projection = function(deep)
{
	var d = (this.z / deep) + 1;
	return new H.float2(
		this.x / d,
		this.y / d
	);
}

H.float3.prototype.cross = function(v2)
{
	return new H.float3(
		this.y * v2.z - this.z * v2.y,
		this.z * v2.x - this.x * v2.z,
		this.x * v2.y - this.y * v2.x
	);
}

H.float3.prototype.length = function()
{
	return this.dot(this);
}

H.float3.prototype.norm = function()
{
	return new H.float3();
}
H.float3.prototype.dist = function(v2)
{
	var sub = this.sub(v2);
	return Math.sqrt(sub.x * sub.x + sub.y * sub.y + sub.z * sub.z)
}

H.float4x4 = function(m)
{
	this._ = m ? m : [];
}

H.float4x4.prototype.mul = function(m2)
{
	var m1 = this;

	var RDC = function(i, j)
	{
		return m1._[i][0] * m2._[0][j] + m1._[i][1] * m2._[1][j] + m1._[i][2] * m2._[2][j] + m1._[i][3] * m2._[3][j];
	};

	return new H.float4x4([
		[RDC(0, 0), RDC(0, 1), RDC(0, 2), RDC(0, 3)],
		[RDC(1, 0), RDC(1, 1), RDC(1, 2), RDC(1, 3)],
		[RDC(2, 0), RDC(2, 1), RDC(2, 2), RDC(2, 3)],
		[RDC(3, 0), RDC(3, 1), RDC(3, 2), RDC(3, 3)]
	]);
}

H.float4x4.prototype.mulFloat3 = function(pt3d)
{
	var m1 = this;

	var RDC = function(i)
	{
		return m1._[i][0] * pt3d.x + m1._[i][1] * pt3d.y + m1._[i][2] * pt3d.z + m1._[i][3] * 1;
	};

	var d = RDC(3);

	return new H.float3(RDC(0) / d, RDC(1) / d, RDC(2) / d);
}

H.float4x4.Identity = function()
{
	return new H.float4x4([
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[0, 0, 0, 1]
	]);
}

H.float4x4.Projection = function(pt3d)
{
	var f = function(x) {return x == 0 ? 0 : 1 / x;}
	return new H.float4x4([
		[1, 0, 0, 0],
		[0, 1, 0, 0],
		[0, 0, 1, 0],
		[f(pt3d.x), f(pt3d.z), f(pt3d.z), 1]
	]);
}

H.float4x4.Translate = function(offsetP)
{
	return new H.float4x4([
		[1, 0, 0, offsetP.x],
		[0, 1, 0, offsetP.y],
		[0, 0, 1, offsetP.z],
		[0, 0, 0, 1],
	]);
}

H.float4x4.RotateX = function(angle)
{
    return new H.float4x4([
    	[1, 0, 0, 0],
    	[0, Math.cos(angle), -Math.sin(angle), 0],
    	[0, Math.sin(angle), Math.cos(angle), 0],
    	[0, 0, 0, 1]
	]);
}
H.float4x4.RotateY = function(angle)
{
    return new H.float4x4([
    	[Math.cos(angle), 0, -Math.sin(angle), 0],
    	[0, 1, 0, 0],
    	[Math.sin(angle), 0, Math.cos(angle), 0],
    	[0, 0, 0, 1]
	]);
}
H.float4x4.RotateZ = function(angle)
{
    return new H.float4x4([
    	[Math.cos(angle), -Math.sin(angle), 0, 0],
    	[Math.sin(angle), Math.cos(angle), 0, 0],
    	[0, 0, 1, 0],
    	[0, 0, 0, 1]
	]);
}

Math.float2 = H.float2;
Math.float3 = H.float3;
Math.float4x4 = H.float4x4;

Math.Perspective = H.Math.Perspective;
Math.Degree2Radian = H.Math.Degree2Radian;
Math.Random = H.Math.Random;
Math.RandomInt = H.Math.RandomInt;