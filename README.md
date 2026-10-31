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

`npm run build` 是可选的打包命令，仅在其他静态托管平台要求单独提交部署目录时使用。它会清理并重新生成本项目的 `dist/`，只复制 `index.html`、`styles.css`、`script.js` 及 `assets/` 网站资源。GitHub Pages 无需运行此命令。

## 静态部署

此站点可由 GitHub Pages 直接发布仓库中的静态文件，无需运行 npm 构建。首次启用时，在 GitHub 仓库的 **Settings → Pages → Build and deployment** 中，将 **Source** 设为 **Deploy from a branch**，选择 **`master`** 和 **`/(root)`** 后保存。之后每次向 `master` 推送更改，GitHub Pages 会自动发布仓库根目录的 `index.html` 和网站资源。资源路径使用相对地址，可在仓库项目页下正常访问。

其他静态托管平台若要求单独的部署目录，可以运行 `npm run build` 并部署 `dist/`。

## 项目结构

- `index.html`：页面内容与链接。
- `styles.css`：布局、主题及响应式样式。
- `script.js`：启动器界面预览切换、移动端导航等交互。
- `assets/`：页面图片及站点图标。
- `scripts/server.mjs`：本地静态预览，仅开放页面文件和资源目录。
- `scripts/build.mjs`：生成用于部署的 `dist/`。

项目地址：<https://github.com/HentaiX2007/PCL-Web>。
