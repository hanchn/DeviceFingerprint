import { FingerprintComponents } from '../types';

/**
 * 设备信息收集器
 * 收集设备类型和硬件支持信息
 */
export class DeviceCollector {
  /**
   * 收集设备信息
   * @returns 设备信息对象
   */
  static async collect(): Promise<FingerprintComponents['device']> {
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
  private static getDeviceType(): string {
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
  private static async getHardwareInfo(): Promise<FingerprintComponents['device']['hardware']> {
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
  private static async getStorageInfo(): Promise<FingerprintComponents['device']['storage']> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota || 0,
          usage: estimate.usage || 0
        };
      }
    } catch (error) {
      console.warn('Failed to get storage info:', error);
    }
    return {
      quota: 0,
      usage: 0
    };
  }
} 