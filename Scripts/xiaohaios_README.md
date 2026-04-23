# 哈士奇应用 (xiaohaios.com) Surge 签到脚本

## 功能说明

本脚本集为 Surge 提供哈士奇应用（小哈士奇）的自动签到功能，包含以下两个脚本：

1. **xiaohaios_cookie.js** - Cookie 抓取脚本
2. **xiaohaios_checkin.js** - 自动签到脚本

## 功能特性

### Cookie 抓取脚本
- 自动抓取并保存以下 Cookie：
  - `ASP.NET_SessionId`
  - `dt_cookie_openid_remember`
  - `dt_cookie_user_name_remember`
- 抓取成功后发送通知提醒
- 支持多个 Cookie 字段的批量保存

### 自动签到脚本
- 每日自动执行签到（默认每天 9:00）
- 使用标准 iPhone 微信 User-Agent
- 智能判断签到结果（成功/已签到/Cookie失效）
- 失败自动重试（最多3次，间隔10秒）
- 签到结果推送通知
- 支持 HTTP/2

## 安装配置

### 方法一：手动配置

#### 1. 下载脚本文件

将以下两个脚本文件保存到 iCloud Drive 或其他 Surge 可访问的位置：
- `xiaohaios_cookie.js`
- `xiaohaios_checkin.js`

#### 2. 配置 Surge

在 Surge 配置文件中添加以下内容：

```ini
[Script]
# Cookie获取脚本（访问小哈士奇网站时自动触发）
哈士奇Cookie = type=http-request,pattern=^https:\/\/www\.xiaohaios\.com,requires-body=0,max-size=0,script-path=/path/to/xiaohaios_cookie.js

# 自动签到脚本（每天9:00执行，可自定义时间）
哈士奇签到 = type=cron,cronexp="0 9 * * *",wake-system=1,timeout=60,script-path=/path/to/xiaohaios_checkin.js

[MITM]
hostname = %APPEND% www.xiaohaios.com
```

**注意**：将 `/path/to/` 替换为实际的脚本文件路径。

#### 3. Cron 表达式说明

默认配置为每天 9:00 执行，可根据需要修改：

| Cron 表达式 | 执行时间 |
|------------|---------|
| `0 9 * * *` | 每天 9:00 |
| `0 8 * * *` | 每天 8:00 |
| `30 7 * * *` | 每天 7:30 |
| `0 12 * * *` | 每天 12:00 |
| `0 0 * * *` | 每天 0:00（午夜）|

Cron 表达式格式：`分 时 日 月 星期`

### 方法二：使用远程脚本

如果脚本托管在远程服务器（如 GitHub），可以直接引用 URL：

```ini
[Script]
哈士奇Cookie = type=http-request,pattern=^https:\/\/www\.xiaohaios\.com,requires-body=0,max-size=0,script-path=https://example.com/xiaohaios_cookie.js

哈士奇签到 = type=cron,cronexp="0 9 * * *",wake-system=1,timeout=60,script-path=https://example.com/xiaohaios_checkin.js

[MITM]
hostname = %APPEND% www.xiaohaios.com
```

## 使用步骤

### 第一步：抓取 Cookie

1. 确保已在 Surge 配置中添加 Cookie 抓取脚本
2. 在 Safari 或微信内置浏览器中访问 [https://www.xiaohaios.com](https://www.xiaohaios.com)
3. 登录你的账号
4. 登录成功后，Surge 会自动抓取 Cookie 并发送通知
5. 收到"Cookie获取成功"通知即表示配置完成

**注意事项**：
- 确保 Surge 的 MITM（中间人攻击）功能已启用
- 确保已信任 Surge 的根证书
- 必须在登录状态下访问网站才能抓取到有效的 Cookie

### 第二步：启用自动签到

1. 确保已在 Surge 配置中添加签到脚本
2. 脚本会在每天指定时间自动执行
3. 签到完成后会收到通知

### 手动触发签到

如需立即执行签到，可以在 Surge 的脚本管理界面手动运行"哈士奇签到"脚本。

## 脚本配置参数说明

### Cookie 抓取脚本参数

- **type**: `http-request` - 拦截HTTP请求
- **pattern**: `^https:\/\/www\.xiaohaios\.com` - 匹配小哈士奇网站的所有请求
- **requires-body**: `0` - 不需要请求体
- **max-size**: `0` - 不限制大小

### 签到脚本参数

- **type**: `cron` - 定时任务
- **cronexp**: `"0 9 * * *"` - Cron 表达式（每天9:00）
- **wake-system**: `1` - 唤醒系统执行
- **timeout**: `60` - 超时时间60秒

## 签到结果说明

脚本会根据服务器响应自动判断签到结果：

| 结果 | 说明 |
|------|------|
| ✅ 签到成功 | 今日签到完成 |
| ✓ 今日已签到 | 之前已经签到过 |
| ❌ Cookie已失效 | 需要重新抓取Cookie |
| ⚠️ 请求失败 | 网络问题，会自动重试 |

## 故障排查

### Cookie 抓取失败

**问题**：访问网站后没有收到"Cookie获取成功"通知

**解决方法**：
1. 检查 Surge 的 MITM 功能是否启用
2. 检查是否已添加 `www.xiaohaios.com` 到 MITM 的 hostname
3. 确认已在浏览器中登录账号
4. 查看 Surge 日志，确认脚本是否正常执行

### 签到失败

**问题**：收到"签到失败"或"Cookie已失效"通知

**解决方法**：
1. Cookie 可能已过期，需要重新抓取
2. 重新访问 xiaohaios.com 并登录
3. 重新抓取 Cookie 后，等待下次定时签到或手动执行

**问题**：一直显示"请求失败"

**解决方法**：
1. 检查网络连接是否正常
2. 确认 Surge 是否正在运行
3. 尝试手动访问签到网址测试连接性
4. 查看 Surge 日志获取详细错误信息

### 查看日志

在 Surge 主界面，点击底部的"最近请求"或"日志"标签，可以查看脚本的详细执行日志，包括：
- Cookie 抓取记录
- 签到请求和响应
- 错误信息

## 高级配置

### 修改重试次数

编辑 `xiaohaios_checkin.js` 文件，找到以下行：

```javascript
await checkinWithRetry(3);  // 3 表示最多重试3次
```

将数字修改为你想要的重试次数。

### 修改重试间隔

编辑 `xiaohaios_checkin.js` 文件，找到以下行：

```javascript
await new Promise(resolve => setTimeout(resolve, 10000));  // 10000毫秒 = 10秒
```

修改数字来调整重试间隔（单位：毫秒）。

### 自定义通知

可以编辑脚本中的 `$notification.post()` 函数调用来自定义通知的标题、副标题和内容。

## 技术细节

### 签到接口

- **URL**: `https://www.xiaohaios.com/aspx3/mobile/qiandao.aspx`
- **方法**: GET
- **协议**: 支持 HTTP/2

### 必需的 Cookie

签到需要以下 Cookie 进行身份验证：
- `ASP.NET_SessionId` - ASP.NET 会话ID
- `dt_cookie_openid_remember` - 用户 OpenID（记住登录）
- `dt_cookie_user_name_remember` - 用户名（记住登录）

### User-Agent

脚本使用 iPhone 微信内置浏览器的 User-Agent：
```
Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.38(0x18002633) NetType/WIFI Language/zh_CN
```

## 隐私说明

- 所有 Cookie 均存储在本地设备的 Surge 持久化存储中
- 脚本不会向第三方服务器发送任何数据
- 仅与 xiaohaios.com 进行通信

## 更新日志

### v1.0.0 (2024-12-13)
- 初始版本发布
- 支持 Cookie 自动抓取
- 支持每日自动签到
- 支持失败自动重试
- 支持签到结果通知

## 许可证

本脚本仅供学习交流使用，请勿用于商业用途。

## 相关链接

- 哈士奇应用官网：https://www.xiaohaios.com
- Surge 官网：https://nssurge.com

## 支持

如有问题或建议，请通过以下方式反馈：
- 提交 Issue
- 查看 Surge 官方文档了解更多脚本语法

---

**最后更新**：2024-12-13
