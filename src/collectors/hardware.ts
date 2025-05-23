import { FingerprintComponents } from '../types';

/**
 * 硬件信息收集器
 * 收集硬件相关的信息
 */
export class HardwareCollector {
  /**
   * 收集硬件信息
   * @returns 硬件信息对象
   */
  static async collect(): Promise<FingerprintComponents['hardware']> {
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
  private static async getBatteryInfo(): Promise<FingerprintComponents['hardware']['batteryInfo']> {
    try {
      if (navigator.getBattery) {
        const battery = await navigator.getBattery();
        return {
          charging: battery.charging,
          level: battery.level
        };
      }
    } catch (error) {
      console.warn('Failed to get battery info:', error);
    }
    return undefined;
  }
} 