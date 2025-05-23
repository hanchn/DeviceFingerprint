import { FingerprintComponents } from '../types';
/**
 * 基本信息收集器
 * 收集浏览器和系统的基本信息
 */
export declare class BasicCollector {
    /**
     * 收集基本信息
     * @returns 基本信息对象
     */
    static collect(): FingerprintComponents['basic'];
}
