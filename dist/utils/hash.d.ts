/**
 * 计算字符串的哈希值
 * @param str 输入字符串
 * @returns 哈希值字符串
 */
export declare function hashString(str: string): string;
/**
 * 计算对象的哈希值（32 个字符的十六进制字符串）
 * @param obj 输入对象
 * @returns 哈希值字符串
 */
export declare function hashObject(obj: any): Promise<string>;
/**
 * 计算 Canvas 指纹
 * @param canvas Canvas 元素
 * @returns 指纹字符串
 */
export declare function getCanvasFingerprint(canvas: HTMLCanvasElement): string;
/**
 * 计算 WebGL 指纹
 * @param canvas Canvas 元素
 * @returns 指纹字符串
 */
export declare function getWebGLFingerprint(canvas: HTMLCanvasElement): string;
