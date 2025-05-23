import { FingerprintComponents } from '../types';
/**
 * 屏幕信息收集器
 * 收集屏幕相关的信息
 */
export declare class ScreenCollector {
    /**
     * 收集屏幕信息
     * @returns 屏幕信息对象
     */
    static collect(): FingerprintComponents['screen'];
}
