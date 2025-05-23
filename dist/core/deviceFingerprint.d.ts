import { DeviceFingerprintOptions, FingerprintComponents } from '../types';
/**
 * 设备指纹类
 * 用于生成和管理设备指纹
 */
export declare class DeviceFingerprint {
    private fingerprint;
    private components;
    private options;
    private logger;
    /**
     * 创建设备指纹实例
     * @param options 配置选项
     */
    constructor(options?: DeviceFingerprintOptions);
    /**
     * 生成设备指纹
     * @returns 设备指纹字符串
     * @throws 如果生成过程中发生错误
     */
    generate(): Promise<string>;
    /**
     * 收集所有组件信息
     * @private
     */
    private collectComponents;
    /**
     * 获取收集的组件信息
     * @returns 组件信息对象
     */
    getComponents(): Partial<FingerprintComponents>;
}
declare const deviceFingerprint: DeviceFingerprint;
export default deviceFingerprint;
