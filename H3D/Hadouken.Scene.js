H.Camera = function(pos, target, fov)
{
	
}

H.Camera.prototype.SetFOV = function(fov)
{
	this.FOV = fov;
}

H.Camera.prototype.LookAt = function(pt)
{
	this.Target = pt;
}

H.Camera.prototype.Perspective = function(fov, aspect, zn, zf)
{
	return Math.Perspective(fov, aspect, an, zf);  
}

H.Camera.prototype.ViewMatrix = function()
{
	
}