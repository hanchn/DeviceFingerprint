import { FingerprintComponents } from '../types';
import { getCanvasFingerprint, getWebGLFingerprint } from '../utils/hash';

/**
 * 浏览器特性收集器
 * 收集浏览器支持的各种特性信息
 */
export class FeaturesCollector {
  /**
   * 收集浏览器特性信息
   * @returns 浏览器特性信息对象
   */
  static async collect(): Promise<FingerprintComponents['features']> {
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
  private static async getAvailableFonts(): Promise<string[]> {
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

    const availableFonts: string[] = [];
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
  private static hasAudioContext(): boolean {
    return !!(window.AudioContext || (window as any).webkitAudioContext);
  }
} 