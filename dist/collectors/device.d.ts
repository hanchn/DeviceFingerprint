import { FingerprintComponents } from '../types';
/**
 * 设备信息收集器
 * 收集设备类型和硬件支持信息
 */
export declare class DeviceCollector {
    /**
     * 收集设备信息
     * @returns 设备信息对象
     */
    static collect(): Promise<FingerprintComponents['device']>;
    /**
     * 获取设备类型
     * @returns 设备类型
     * @private
     */
    private static getDeviceType;
    /**
     * 获取硬件支持信息
     * @returns 硬件支持信息对象
     * @private
     */
    private static getHardwareInfo;
    /**
     * 获取存储信息
     * @returns 存储信息对象
     * @private
     */
    private static getStorageInfo;
}
