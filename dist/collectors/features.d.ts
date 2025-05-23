import { FingerprintComponents } from '../types';
/**
 * 浏览器特性收集器
 * 收集浏览器支持的各种特性信息
 */
export declare class FeaturesCollector {
    /**
     * 收集浏览器特性信息
     * @returns 浏览器特性信息对象
     */
    static collect(): Promise<FingerprintComponents['features']>;
    /**
     * 获取可用字体列表
     * @returns 字体列表
     * @private
     */
    private static getAvailableFonts;
    /**
     * 检查是否支持 AudioContext
     * @returns 是否支持
     * @private
     */
    private static hasAudioContext;
}
