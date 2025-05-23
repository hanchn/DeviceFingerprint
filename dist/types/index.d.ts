/**
 * 设备指纹组件类型
 * 定义了所有可收集的设备信息类型
 */
export interface FingerprintComponents {
    /** 基本信息 */
    basic: {
        userAgent: string;
        language: string;
        platform: string;
    };
    /** 屏幕信息 */
    screen: {
        colorDepth: number;
        resolution: string;
        orientation: string;
    };
    /** 硬件信息 */
    hardware: {
        timezone: string;
        hardwareConcurrency: number;
        deviceMemory: number;
        touchSupport: boolean;
        batteryInfo?: {
            charging: boolean;
            level: number;
        };
    };
    /** 网络信息 */
    network: {
        connection: {
            effectiveType: string;
            downlink: number;
            rtt: number;
        };
        ipInfo?: {
            ip: string;
            country: string;
            region: string;
            city: string;
        };
    };
    /** 浏览器特性 */
    features: {
        cookiesEnabled: boolean;
        fonts: string[];
        canvas: string;
        webgl: string;
        audioContext: boolean;
    };
    /** 设备信息 */
    device: {
        type: string;
        hardware: {
            bluetooth: boolean;
            usb: boolean;
            nfc: boolean;
            vibration: boolean;
        };
        storage: {
            quota: number;
            usage: number;
        };
    };
}
/**
 * SDK 配置选项
 */
export interface DeviceFingerprintOptions {
    /** 是否启用缓存 */
    cache?: boolean;
    /** 超时时间（毫秒） */
    timeout?: number;
    /** 要收集的组件列表 */
    components?: Array<keyof FingerprintComponents>;
    /** 是否启用调试模式 */
    debug?: boolean;
}
/**
 * 网络连接信息接口
 */
export interface NetworkInformation {
    effectiveType: string;
    downlink: number;
    rtt: number;
}
/**
 * 电池信息接口
 */
export interface BatteryManager {
    charging: boolean;
    level: number;
}
/**
 * 存储信息接口
 */
export interface StorageEstimate {
    quota: number;
    usage: number;
}
/**
 * Navigator 接口扩展
 */
declare global {
    interface Navigator {
        deviceMemory?: number;
        hardwareConcurrency?: number;
        connection?: NetworkInformation;
        getBattery?: () => Promise<BatteryManager>;
    }
}
