# 快速开始指南 - 哈士奇应用签到脚本

## 🚀 三步完成配置

### 第一步：添加配置到 Surge

在 Surge 配置文件中添加以下内容：

```ini
[Script]
哈士奇Cookie = type=http-request,pattern=^https:\/\/www\.xiaohaios\.com,requires-body=0,max-size=0,script-path=https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/Scripts/xiaohaios_cookie.js

哈士奇签到 = type=cron,cronexp="0 9 * * *",wake-system=1,timeout=60,script-path=https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/Scripts/xiaohaios_checkin.js

[MITM]
hostname = %APPEND% www.xiaohaios.com
```

**注意：** 将 URL 中的 `YOUR_USERNAME/YOUR_REPO` 替换为实际的仓库地址。

### 第二步：抓取 Cookie

1. 重启 Surge 使配置生效
2. 在浏览器中访问：https://www.xiaohaios.com
3. 登录你的账号
4. 看到"Cookie获取成功"通知即完成

### 第三步：等待自动签到

- ✅ 脚本会在每天 9:00 自动签到
- ✅ 签到完成会收到通知
- ✅ 也可以在 Surge 中手动运行签到脚本

## 📱 使用 Surge 模块（推荐）

更简单的方法是导入模块文件：

1. 在 Surge 中点击 "模块" → "安装新模块"
2. 输入模块 URL：
   ```
   https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/Scripts/xiaohaios.sgmodule
   ```
3. 点击安装
4. 按照上述第二步抓取 Cookie

## ⏰ 自定义签到时间

修改 `cronexp` 参数：

| 时间 | Cron 表达式 |
|------|------------|
| 每天 8:00 | `"0 8 * * *"` |
| 每天 9:30 | `"30 9 * * *"` |
| 每天 12:00 | `"0 12 * * *"` |
| 每天 22:00 | `"0 22 * * *"` |

## ⚠️ 常见问题

### Q: 没有收到"Cookie获取成功"通知？
**A:** 检查：
- Surge 的 MITM 是否启用
- 是否已添加 `www.xiaohaios.com` 到 MITM hostname
- 是否在登录状态下访问网站

### Q: 签到失败提示"Cookie已失效"？
**A:** 重新访问网站登录，抓取新的 Cookie

### Q: 如何手动测试签到？
**A:** 在 Surge 的"脚本"页面，找到"哈士奇签到"，点击运行

## 📖 详细文档

更多信息请查看：[完整使用文档](xiaohaios_README.md)

## 💡 提示

- Cookie 只在本地存储，不会上传到任何服务器
- 建议在 WiFi 环境下使用
- 签到失败会自动重试 3 次
- 可以在 Surge 日志中查看详细信息

---

**需要帮助？** 查看 [故障排查文档](xiaohaios_README.md#故障排查)
