class DeviceFingerprint {
  constructor() {
    this.fingerprint = null;
    this.components = {};
  }

  async generate() {
    if (this.fingerprint) {
      return this.fingerprint;
    }

    this.components = {
      // 基础信息
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      
      // 屏幕信息
      colorDepth: screen.colorDepth,
      resolution: `${window.screen.width}x${window.screen.height}`,
      orientation: this.getScreenOrientation(),
      
      // 硬件信息
      timezone: new Date().getTimezoneOffset(),
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      touchSupport: 'ontouchstart' in window,
      batteryInfo: await this.getBatteryInfo(),
      
      // 网络信息
      connectionInfo: this.getConnectionInfo(),
      ipInfo: await this.getIPInfo(),
      
      // 设备特性
      cookiesEnabled: navigator.cookieEnabled,
      fonts: await this.getFonts(),
      canvas: this.getCanvasFingerprint(),
      webgl: this.getWebGLInfo(),
      audioContext: this.getAudioFingerprint(),
      
      // 新增WiFi/硬件信息
      deviceType: this.getDeviceType(),
      bluetoothSupport: 'bluetooth' in navigator,
      usbSupport: 'usb' in navigator,
      nfcSupport: 'nfc' in navigator,
      vibrationSupport: 'vibrate' in navigator,
      storageInfo: await this.getStorageInfo()
    };

    this.fingerprint = this.hash(JSON.stringify(this.components));
    return this.fingerprint;
  }

  getComponents() {
    return this.components;
  }

  // 新增方法：获取设备类型
  getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return "tablet";
    }
    if (/Mobile|Android|iP(hone|od)|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return "mobile";
    }
    return "desktop";
  }

  // 新增方法：获取存储信息
  async getStorageInfo() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota,
          usage: estimate.usage,
          usageDetails: estimate.usageDetails
        };
      } catch (e) {
        return 'error';
      }
    }
    return 'unsupported';
  }

  // 新增方法：获取网络连接信息
  getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        type: connection.type,
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return 'unsupported';
  }

  async getFonts() {
    const fontList = [
      'Arial', 'Arial Black', 'Courier New', 'Times New Roman',
      'Comic Sans MS', 'Georgia', 'Impact', 'Lucida Console',
      'Palatino Linotype', 'Tahoma', 'Trebuchet MS', 'Verdana'
    ];
    
    const availableFonts = [];
    const div = document.createElement('div');
    const span = document.createElement('span');
    span.style.fontFamily = 'monospace';
    span.innerHTML = 'mmmmmmmmmmlli';
    div.appendChild(span);
    document.body.appendChild(div);
    
    const defaultWidth = span.offsetWidth;
    const defaultHeight = span.offsetHeight;
    
    for (const font of fontList) {
      span.style.fontFamily = `${font}, monospace`;
      if (span.offsetWidth !== defaultWidth || span.offsetHeight !== defaultHeight) {
        availableFonts.push(font);
      }
    }
    
    document.body.removeChild(div);
    return availableFonts;
  }

  getCanvasFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 50;
    
    ctx.fillStyle = 'rgb(128, 0, 128)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(255, 255, 0)';
    ctx.font = '18px Arial';
    ctx.fillText('Device Fingerprint', 10, 30);
    
    return canvas.toDataURL();
  }

  getWebGLInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return 'WebGL not supported';
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      version: gl.getParameter(gl.VERSION)
    };
  }

  hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }
}

(function() {
// 替换最后两行
const deviceFingerprint = new DeviceFingerprint();
window.deviceFingerprint = deviceFingerprint;  // 将实例挂载到window对象
})();
export default deviceFingerprint;