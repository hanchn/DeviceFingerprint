# Device Fingerprint SDK

一个用于生成浏览器设备指纹的 TypeScript SDK。该 SDK 可以收集各种设备信息，并生成唯一的设备标识符。

## 特性

- 收集多种设备信息：
  - 基本信息（User Agent、语言、平台）
  - 屏幕信息（分辨率、颜色深度、方向）
  - 硬件信息（CPU 核心数、内存、电池状态）
  - 网络信息（连接类型、IP 信息）
  - 浏览器特性（Canvas、WebGL、字体）
  - 设备信息（类型、硬件支持、存储）
- 支持缓存
- 可配置的组件收集
- 详细的类型定义
- 完整的错误处理
- 调试模式支持

## 安装

```bash
npm install device-fingerprint-sdk
```

## 使用方法

### 基本用法

```typescript
import deviceFingerprint from 'device-fingerprint-sdk';

async function getFingerprint() {
  try {
    const fingerprint = await deviceFingerprint.generate();
    console.log('Device Fingerprint:', fingerprint);
    
    const components = deviceFingerprint.getComponents();
    console.log('Components:', components);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### 配置选项

```typescript
import { DeviceFingerprint } from 'device-fingerprint-sdk';

const fingerprint = new DeviceFingerprint({
  cache: true,           // 是否启用缓存
  timeout: 5000,         // 超时时间（毫秒）
  debug: false,          // 是否启用调试模式
  components: [          // 要收集的组件列表
    'basic',
    'screen',
    'hardware',
    'network',
    'features',
    'device'
  ]
});
```

## 开发

### 安装依赖

```bash
npm install
```

### 构建

```bash
npm run build
```

### 开发模式

```bash
npm run dev
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
src/
  ├── core/           # 核心类
  ├── collectors/     # 信息收集器
  ├── utils/          # 工具函数
  ├── types/          # 类型定义
  └── tests/          # 测试文件
```

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 许可证

MIT 