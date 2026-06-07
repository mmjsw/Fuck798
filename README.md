# Fuck798

一个基于 Vue 3 + TypeScript + Vite 构建的智能设备 Web 控制面板，用于远程管理智能设备。

> **声明**：本项目仅用于学习和研究目的，所有数据均保存在浏览器本地，请放心使用。

## 功能特性

- **短信验证码登录** — 通过手机号 + 图形验证码 + 短信验证码登录
- **Token 登录** — 支持通过抓包获取的 Token 快速登录，无需验证码
- **设备列表展示** — 以卡片形式展示所有设备及其状态（空闲中/使用中）
- **设备远程控制** — 一键开启/关闭设备
- **设备备注功能** — 可为每个设备添加自定义备注名称，便于识别
- **自动刷新** — 每 5 秒自动刷新设备状态
- **每日一言** — 集成一言（Hitokoto）API，点击可随机切换语录
- **响应式设计** — 适配移动端与桌面端

## 技术栈

- **框架**：[Vue 3](https://vuejs.org/) (Composition API + `<script setup>`)
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite](https://vite.dev/)
- **UI 组件库**：[Ant Design Vue](https://www.antdv.com/) 4.x
- **路由**：[Vue Router](https://router.vuejs.org/) 4.x

## 开始使用

### 环境要求

- Node.js >= 18
- npm >= 7

### 安装

```bash
# 克隆仓库
git clone <repository-url>

# 进入项目目录
cd Fuck798

# 安装依赖
npm install
```

### 开发

```bash
npm run dev
```

启动开发服务器，默认地址为 `http://localhost:5173`。

### 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可直接部署到静态服务器。

### 预览

```bash
npm run preview
```

预览构建后的生产版本。

## 项目结构

```
Fuck798/
├── public/               # 静态资源
│   ├── fuck798.png       # 应用图标
│   └── _redirects        # 部署重定向规则
├── src/
│   ├── assets/           # 资源文件
│   ├── components/       # 公共组件
│   │   ├── AppFooter.vue   # 页脚组件（含每日一言）
│   │   ├── Captcha.vue     # 图形验证码组件
│   │   ├── DeviceList.vue  # 设备列表与核心控制逻辑
│   │   ├── Hitokoto.vue    # 每日一言组件
│   │   ├── LoginForm.vue   # 登录表单组件
│   │   └── LogoutBtn.vue   # 退出登录按钮
│   ├── router/           # 路由配置
│   │   └── index.ts
│   ├── utils/            # 工具函数
│   │   ├── BaseURL.ts      # API 基础地址配置
│   │   └── Serializable.ts # localStorage 序列化工具
│   ├── views/            # 页面视图
│   │   ├── Login.vue       # 验证码登录页
│   │   ├── TokenLogin.vue  # Token 登录页
│   │   └── Control.vue     # 设备控制主页
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口
│   └── style.css         # 全局样式
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 依赖管理
```

## 使用说明

1. **验证码登录**：在登录页输入手机号、图形验证码，获取短信验证码后登录
2. **Token 登录**：点击"使用 Token 登录"，输入从 APP 抓包获取的 Token
3. **设备控制**：登录后进入设备列表，点击"立即开启"/"立即关闭"控制设备
4. **添加备注**：点击设备卡片上的"添加备注"，可为设备设置别名

## 许可证

[MIT](LICENSE)

---

<p align="center">Created By MMJSW · 让工具成为工具</p>