import { DeviceFingerprintOptions, FingerprintComponents } from '../types';
import { Logger } from '../utils/logger';
import { hashObject } from '../utils/hash';
import {
  BasicCollector,
  ScreenCollector,
  HardwareCollector,
  NetworkCollector,
  FeaturesCollector,
  DeviceCollector
} from '../collectors';

/**
 * 设备指纹类
 * 用于生成和管理设备指纹
 */
export class DeviceFingerprint {
  private fingerprint: string | null = null;
  private components: Partial<FingerprintComponents> = {};
  private options: DeviceFingerprintOptions;
  private logger: Logger;

  /**
   * 创建设备指纹实例
   * @param options 配置选项
   */
  constructor(options: DeviceFingerprintOptions = {}) {
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
  async generate(): Promise<string> {
    if (this.fingerprint && this.options.cache) {
      this.logger.log('Using cached fingerprint');
      return this.fingerprint;
    }

    try {
      await this.collectComponents();
      this.fingerprint = await hashObject(this.components);
      this.logger.log('Generated new fingerprint', this.fingerprint);
      return this.fingerprint;
    } catch (error) {
      this.logger.error('Failed to generate fingerprint', error);
      throw error;
    }
  }

  /**
   * 收集所有组件信息
   * @private
   */
  private async collectComponents(): Promise<void> {
    const collectors = {
      basic: BasicCollector,
      screen: ScreenCollector,
      hardware: HardwareCollector,
      network: NetworkCollector,
      features: FeaturesCollector,
      device: DeviceCollector
    } as const;

    for (const [key, collector] of Object.entries(collectors)) {
      const componentKey = key as keyof FingerprintComponents;
      if (!this.options.components || this.options.components.includes(componentKey)) {
        try {
          const result = await collector.collect();
          (this.components as any)[componentKey] = result;
        } catch (error) {
          this.logger.error(`Failed to collect ${key} information`, error);
          (this.components as any)[componentKey] = 'error';
        }
      }
    }
  }

  /**
   * 获取收集的组件信息
   * @returns 组件信息对象
   */
  getComponents(): Partial<FingerprintComponents> {
    return this.components;
  }
}

// 导出默认实例
const deviceFingerprint = new DeviceFingerprint();
export default deviceFingerprint; 