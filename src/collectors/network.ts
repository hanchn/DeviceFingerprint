import { FingerprintComponents } from '../types';

/**
 * 网络信息收集器
 * 收集网络连接信息
 */
export class NetworkCollector {
  /**
   * 收集网络信息
   * @returns 网络信息对象
   */
  static async collect(): Promise<FingerprintComponents['network']> {
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
  private static getConnectionInfo(): FingerprintComponents['network']['connection'] {
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
  private static async getIpInfo(): Promise<FingerprintComponents['network']['ipInfo']> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        country: data.country_name,
        region: data.region,
        city: data.city
      };
    } catch (error) {
      console.warn('Failed to get IP info:', error);
      return undefined;
    }
  }
} 