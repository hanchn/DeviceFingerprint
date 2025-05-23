import { FingerprintComponents } from '../types';
/**
 * 硬件信息收集器
 * 收集硬件相关的信息
 */
export declare class HardwareCollector {
    /**
     * 收集硬件信息
     * @returns 硬件信息对象
     */
    static collect(): Promise<FingerprintComponents['hardware']>;
    /**
     * 获取电池信息
     * @returns 电池信息对象
     * @private
     */
    private static getBatteryInfo;
}
