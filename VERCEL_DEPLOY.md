# Vercel 部署说明

这个目录可以直接部署到 Vercel。部署后，公开网页和大模型后端会在同一个域名下：

- `/`：量化展示页面
- `/api/chat`：大模型问答代理
- `/api/status`：后端状态检查

必须在 Vercel 环境变量里配置：

```text
CODEBUDDY_API_KEY=你的 CodeBuddy API Key
CHAT_MODEL=deepseek-v4-pro
CODEBUDDY_ENDPOINT=https://www.codebuddy.cn/v2/chat/completions
```

不要把 API Key 写进 `index.html`、`api/chat.js` 或 GitHub。

部署方式：

1. 打开 Vercel。
2. New Project。
3. 导入 `kyk-web/rellm` 仓库。
4. Root Directory 选择仓库根目录，也就是包含 `index.html` 和 `api/` 的目录。
5. 填入上面的 Environment Variables。
6. Deploy。

如果用 Vercel CLI：

```powershell
cd D:\rellm\publish_site
vercel login
vercel env add CODEBUDDY_API_KEY production
vercel env add CHAT_MODEL production
vercel env add CODEBUDDY_ENDPOINT production
vercel --prod
```
