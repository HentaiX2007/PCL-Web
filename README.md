# PCL Re 网站

中文单页产品网站，使用 HTML、CSS 和原生 JavaScript，适配桌面与移动设备。网站资源全部位于本项目内；本地预览及构建仅使用 Node.js 内置模块，无需安装依赖。

## 本地预览

安装 Node.js 20 或更新版本后，在项目目录运行：

```sh
npm run dev
```

浏览器打开 `http://127.0.0.1:4173`。指定其他端口：

```sh
npm run dev -- --port 4174
```

也可以通过 `PORT` 环境变量指定端口。按 `Ctrl+C` 停止预览。直接打开 `index.html` 也能查看基础页面；建议使用本地预览检查完整交互。

## 检查与构建

```sh
npm run check
npm run build
```

构建会清理并重新生成本项目的 `dist/`，仅复制 `index.html`、`styles.css`、`script.js` 及 `assets/` 网站资源，不会打包源码目录、开发脚本、Git 记录或环境文件。资源内的隐藏文件不会复制，符号链接会使构建终止。

## 静态部署

将 `dist/` 的全部内容上传到任意静态站点托管服务即可，无需应用服务器。也可以将本仓库根目录作为 GitHub Pages 的发布源；构建产物使用相对资源路径，可部署到项目子路径。

## 项目结构

- `index.html`：页面内容与链接。
- `styles.css`：布局、主题及响应式样式。
- `script.js`：启动器界面预览切换、移动端导航等交互。
- `assets/`：页面图片及站点图标。
- `scripts/server.mjs`：本地静态预览，仅开放页面文件和资源目录。
- `scripts/build.mjs`：生成用于部署的 `dist/`。

项目地址：<https://github.com/HentaiX2007/PCL-Web>。
