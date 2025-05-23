(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DeviceFingerprint = {}));
})(this, (function (exports) { 'use strict';

  /**
   * 日志记录器类
   * 用于记录设备指纹生成过程中的日志信息
   */
  class Logger {
      /**
       * 创建日志记录器实例
       * @param debug 是否启用调试模式
       */
      constructor(debug = false) {
          this.debug = debug;
      }
      /**
       * 记录普通日志
       * @param message 日志消息
       * @param data 附加数据
       */
      log(message, data) {
          if (this.debug) {
              console.log(`[DeviceFingerprint] ${message}`, data);
          }
      }
      /**
       * 记录错误日志
       * @param message 错误消息
       * @param error 错误对象
       */
      error(message, error) {
          console.error(`[DeviceFingerprint] ${message}`, error);
      }
      /**
       * 记录警告日志
       * @param message 警告消息
       * @param data 附加数据
       */
      warn(message, data) {
          console.warn(`[DeviceFingerprint] ${message}`, data);
      }
  }

  /**
   * 计算字符串的哈希值
   * @param str 输入字符串
   * @returns 哈希值字符串
   */
  function hashString(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
      }
      return hash.toString();
  }
  /**
   * 计算对象的哈希值（32 个字符的十六进制字符串）
   * @param obj 输入对象
   * @returns 哈希值字符串
   */
  async function hashObject(obj) {
      const str = JSON.stringify(obj);
      if (window.crypto && window.crypto.subtle) {
          const buffer = new TextEncoder().encode(str);
          const digest = await window.crypto.subtle.digest('SHA-256', buffer);
          const hashArray = Array.from(new Uint8Array(digest));
          // 使用完整的 16 个字节，生成 32 个字符的十六进制字符串
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          // 确保返回 32 个字符
          return hashHex.slice(0, 32);
      }
      else {
          // fallback: 使用简单 hashString
          return hashString(str);
      }
  }
  /**
   * 计算 Canvas 指纹
   * @param canvas Canvas 元素
   * @returns 指纹字符串
   */
  function getCanvasFingerprint(canvas) {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          return '';
      }
      // 绘制文本
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('DeviceFingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('DeviceFingerprint', 4, 17);
      // 获取图像数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      return hashString(imageData.data.toString());
  }
  /**
   * 计算 WebGL 指纹
   * @param canvas Canvas 元素
   * @returns 指纹字符串
   */
  function getWebGLFingerprint(canvas) {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
          return '';
      }
      // 类型断言为 WebGLRenderingContext
      const webglContext = gl;
      const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) {
          return '';
      }
      const vendor = webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return hashString(`${vendor}~${renderer}`);
  }

  /**
   * 基本信息收集器
   * 收集浏览器和系统的基本信息
   */
  class BasicCollector {
      /**
       * 收集基本信息
       * @returns 基本信息对象
       */
      static collect() {
          return {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform
          };
      }
  }

  /**
   * 屏幕信息收集器
   * 收集屏幕相关的信息
   */
  class ScreenCollector {
      /**
       * 收集屏幕信息
       * @returns 屏幕信息对象
       */
      static collect() {
          return {
              colorDepth: window.screen.colorDepth,
              resolution: `${window.screen.width}x${window.screen.height}`,
              orientation: window.screen.orientation?.type || 'unknown'
          };
      }
  }

  /**
   * 硬件信息收集器
   * 收集硬件相关的信息
   */
  class HardwareCollector {
      /**
       * 收集硬件信息
       * @returns 硬件信息对象
       */
      static async collect() {
          const batteryInfo = await this.getBatteryInfo();
          return {
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              hardwareConcurrency: navigator.hardwareConcurrency || 0,
              deviceMemory: navigator.deviceMemory || 0,
              touchSupport: 'ontouchstart' in window,
              batteryInfo
          };
      }
      /**
       * 获取电池信息
       * @returns 电池信息对象
       * @private
       */
      static async getBatteryInfo() {
          try {
              if (navigator.getBattery) {
                  const battery = await navigator.getBattery();
                  return {
                      charging: battery.charging,
                      level: battery.level
                  };
              }
          }
          catch (error) {
              console.warn('Failed to get battery info:', error);
          }
          return undefined;
      }
  }

  /**
   * 网络信息收集器
   * 收集网络连接信息
   */
  class NetworkCollector {
      /**
       * 收集网络信息
       * @returns 网络信息对象
       */
      static async collect() {
          const connection = this.getConnectionInfo();
          const ipInfo = await this.getIpInfo();
          return {
              connection,
              ipInfo
          };
      }
      /**
       * 获取网络连接信息
       * @returns 网络连接信息对象
       * @private
       */
      static getConnectionInfo() {
          const connection = navigator.connection;
          return {
              effectiveType: connection?.effectiveType || 'unknown',
              downlink: connection?.downlink || 0,
              rtt: connection?.rtt || 0
          };
      }
      /**
       * 获取 IP 信息
       * @returns IP 信息对象
       * @private
       */
      static async getIpInfo() {
          try {
              const response = await fetch('https://ipapi.co/json/');
              const data = await response.json();
              return {
                  ip: data.ip,
                  country: data.country_name,
                  region: data.region,
                  city: data.city
              };
          }
          catch (error) {
              console.warn('Failed to get IP info:', error);
              return undefined;
          }
      }
  }

  /**
   * 浏览器特性收集器
   * 收集浏览器支持的各种特性信息
   */
  class FeaturesCollector {
      /**
       * 收集浏览器特性信息
       * @returns 浏览器特性信息对象
       */
      static async collect() {
          const canvas = document.createElement('canvas');
          canvas.width = 200;
          canvas.height = 30;
          return {
              cookiesEnabled: navigator.cookieEnabled,
              fonts: await this.getAvailableFonts(),
              canvas: getCanvasFingerprint(canvas),
              webgl: getWebGLFingerprint(canvas),
              audioContext: this.hasAudioContext()
          };
      }
      /**
       * 获取可用字体列表
       * @returns 字体列表
       * @private
       */
      static async getAvailableFonts() {
          if (!document.fonts || !document.fonts.check) {
              return [];
          }
          const baseFonts = ['monospace', 'sans-serif', 'serif'];
          const fontList = [
              'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Bookman Old Style',
              'Bradley Hand ITC', 'Century', 'Century Gothic', 'Comic Sans MS', 'Courier',
              'Courier New', 'Georgia', 'Gentium', 'Impact', 'King', 'Lucida Console',
              'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus', 'Tahoma', 'TeX',
              'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Verona'
          ];
          const availableFonts = [];
          for (const font of fontList) {
              for (const baseFont of baseFonts) {
                  if (await document.fonts.check(`12px "${font}", ${baseFont}`)) {
                      availableFonts.push(font);
                      break;
                  }
              }
          }
          return availableFonts;
      }
      /**
       * 检查是否支持 AudioContext
       * @returns 是否支持
       * @private
       */
      static hasAudioContext() {
          return !!(window.AudioContext || window.webkitAudioContext);
      }
  }

  /**
   * 设备信息收集器
   * 收集设备类型和硬件支持信息
   */
  class DeviceCollector {
      /**
       * 收集设备信息
       * @returns 设备信息对象
       */
      static async collect() {
          return {
              type: this.getDeviceType(),
              hardware: await this.getHardwareInfo(),
              storage: await this.getStorageInfo()
          };
      }
      /**
       * 获取设备类型
       * @returns 设备类型
       * @private
       */
      static getDeviceType() {
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
              return 'tablet';
          }
          if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
              return 'mobile';
          }
          return 'desktop';
      }
      /**
       * 获取硬件支持信息
       * @returns 硬件支持信息对象
       * @private
       */
      static async getHardwareInfo() {
          return {
              bluetooth: 'bluetooth' in navigator,
              usb: 'usb' in navigator,
              nfc: 'NDEFReader' in window,
              vibration: 'vibrate' in navigator
          };
      }
      /**
       * 获取存储信息
       * @returns 存储信息对象
       * @private
       */
      static async getStorageInfo() {
          try {
              if ('storage' in navigator && 'estimate' in navigator.storage) {
                  const estimate = await navigator.storage.estimate();
                  return {
                      quota: estimate.quota || 0,
                      usage: estimate.usage || 0
                  };
              }
          }
          catch (error) {
              console.warn('Failed to get storage info:', error);
          }
          return {
              quota: 0,
              usage: 0
          };
      }
  }

  /**
   * 设备指纹类
   * 用于生成和管理设备指纹
   */
  class DeviceFingerprint {
      /**
       * 创建设备指纹实例
       * @param options 配置选项
       */
      constructor(options = {}) {
          this.fingerprint = null;
          this.components = {};
          this.options = {
              cache: true,
              timeout: 5000,
              debug: false,
              ...options
          };
          this.logger = new Logger(this.options.debug);
      }
      /**
       * 生成设备指纹
       * @returns 设备指纹字符串
       * @throws 如果生成过程中发生错误
       */
      async generate() {
          if (this.fingerprint && this.options.cache) {
              this.logger.log('Using cached fingerprint');
              return this.fingerprint;
          }
          try {
              await this.collectComponents();
              this.fingerprint = await hashObject(this.components);
              this.logger.log('Generated new fingerprint', this.fingerprint);
              return this.fingerprint;
          }
          catch (error) {
              this.logger.error('Failed to generate fingerprint', error);
              throw error;
          }
      }
      /**
       * 收集所有组件信息
       * @private
       */
      async collectComponents() {
          const collectors = {
              basic: BasicCollector,
              screen: ScreenCollector,
              hardware: HardwareCollector,
              network: NetworkCollector,
              features: FeaturesCollector,
              device: DeviceCollector
          };
          for (const [key, collector] of Object.entries(collectors)) {
              const componentKey = key;
              if (!this.options.components || this.options.components.includes(componentKey)) {
                  try {
                      const result = await collector.collect();
                      this.components[componentKey] = result;
                  }
                  catch (error) {
                      this.logger.error(`Failed to collect ${key} information`, error);
                      this.components[componentKey] = 'error';
                  }
              }
          }
      }
      /**
       * 获取收集的组件信息
       * @returns 组件信息对象
       */
      getComponents() {
          return this.components;
      }
  }
  // 导出默认实例
  const deviceFingerprint = new DeviceFingerprint();

  exports.DeviceFingerprint = DeviceFingerprint;
  exports.default = deviceFingerprint;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
