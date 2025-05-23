import { FingerprintComponents } from '../types';
/**
 * 网络信息收集器
 * 收集网络连接信息
 */
export declare class NetworkCollector {
    /**
     * 收集网络信息
     * @returns 网络信息对象
     */
    static collect(): Promise<FingerprintComponents['network']>;
    /**
     * 获取网络连接信息
     * @returns 网络连接信息对象
     * @private
     */
    private static getConnectionInfo;
    /**
     * 获取 IP 信息
     * @returns IP 信息对象
     * @private
     */
    private static getIpInfo;
}
