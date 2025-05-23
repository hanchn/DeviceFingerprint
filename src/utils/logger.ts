/**
 * 日志记录器类
 * 用于记录设备指纹生成过程中的日志信息
 */
export class Logger {
  private debug: boolean;

  /**
   * 创建日志记录器实例
   * @param debug 是否启用调试模式
   */
  constructor(debug: boolean = false) {
    this.debug = debug;
  }

  /**
   * 记录普通日志
   * @param message 日志消息
   * @param data 附加数据
   */
  log(message: string, data?: unknown): void {
    if (this.debug) {
      console.log(`[DeviceFingerprint] ${message}`, data);
    }
  }

  /**
   * 记录错误日志
   * @param message 错误消息
   * @param error 错误对象
   */
  error(message: string, error?: unknown): void {
    console.error(`[DeviceFingerprint] ${message}`, error);
  }

  /**
   * 记录警告日志
   * @param message 警告消息
   * @param data 附加数据
   */
  warn(message: string, data?: unknown): void {
    console.warn(`[DeviceFingerprint] ${message}`, data);
  }
} 