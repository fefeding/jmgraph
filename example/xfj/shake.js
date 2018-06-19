function devicemotion() {
    
    this.hasDeviceMotion = 'ondeviceorientation' in window; 
}

devicemotion.prototype.initEvent = function() {
    if(this.inited) return;
    if(this.hasDeviceMotion) {
        var self = this;
        window.addEventListener('deviceorientation',function(e) {
            self.devicemotionEvent(e);
        }, false);  
    }
    this.inited = true;
    return this.hasDeviceMotion;
}

//绑定摇一摇功能
//如果不支持摇一摇，则会返回false
devicemotion.prototype.bindShake = function(options) {
    if(!options) return;

    if(this.hasDeviceMotion) {
        this.shakeOption = options; 
    }
    else {
        options.handler && options.handler();
    }
    this.initEvent();
    return this.hasDeviceMotion;    
}

devicemotion.prototype.devicemotionEvent = function(e) {
    
    //以设备坐标系z轴为轴，旋转alpha度
	//以设备坐标系x轴为轴，旋转beta度
	//已设备坐标系y轴为轴，旋转gamma度    
    if(this.shakeOption) {   
        var opt = {
            //x: e.accelerationIncludingGravity.x,
           // y: e.accelerationIncludingGravity.y,
            //z: e.accelerationIncludingGravity.z,
            alpha: e.alpha,
            beta: e.beta,
            gamma: e.gamma
        }
      this.shakeOption.handler.call(this, opt);
    }
}