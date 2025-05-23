/**
 * 计算字符串的哈希值
 * @param str 输入字符串
 * @returns 哈希值字符串
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

/**
 * 计算对象的哈希值（32 个字符的十六进制字符串）
 * @param obj 输入对象
 * @returns 哈希值字符串
 */
export async function hashObject(obj: any): Promise<string> {
    const str = JSON.stringify(obj);
    if (window.crypto && window.crypto.subtle) {
        const buffer = new TextEncoder().encode(str);
        const digest = await window.crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(digest));
        // 使用完整的 16 个字节，生成 32 个字符的十六进制字符串
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        // 确保返回 32 个字符
        return hashHex.slice(0, 32);
    } else {
        // fallback: 使用简单 hashString
        return hashString(str);
    }
}

/**
 * 计算 Canvas 指纹
 * @param canvas Canvas 元素
 * @returns 指纹字符串
 */
export function getCanvasFingerprint(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return '';
  }

  // 绘制文本
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText('DeviceFingerprint', 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText('DeviceFingerprint', 4, 17);

  // 获取图像数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return hashString(imageData.data.toString());
}

/**
 * 计算 WebGL 指纹
 * @param canvas Canvas 元素
 * @returns 指纹字符串
 */
export function getWebGLFingerprint(canvas: HTMLCanvasElement): string {
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) {
    return '';
  }

  // 类型断言为 WebGLRenderingContext
  const webglContext = gl as WebGLRenderingContext;
  const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) {
    return '';
  }

  const vendor = webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  const renderer = webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

  return hashString(`${vendor}~${renderer}`);
} 