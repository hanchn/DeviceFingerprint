import { FingerprintComponents } from '../types';

/**
 * 屏幕信息收集器
 * 收集屏幕相关的信息
 */
export class ScreenCollector {
  /**
   * 收集屏幕信息
   * @returns 屏幕信息对象
   */
  static collect(): FingerprintComponents['screen'] {
    return {
      colorDepth: window.screen.colorDepth,
      resolution: `${window.screen.width}x${window.screen.height}`,
      orientation: window.screen.orientation?.type || 'unknown'
    };
  }
} 