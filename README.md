# 分流规则

本仓库包含 Surge、QuantumultX 和 Clash 的分流规则和自动化脚本。

## 目录结构

### Rule of diversion
包含各类分流规则文件：
- **AD Interception.conf** - 广告拦截规则
- **Ai.yaml** - AI 服务规则（ChatGPT、Claude等）
- **Apple.list** - Apple 服务规则
- **China.list** - 中国大陆直连规则
- **DouYin.list** - 抖音规则
- **International media.list** - 国际媒体服务规则
- **Proxy.list** - 代理规则
- **Revision of rules.list** - 规则修正（白名单）
- **Telegram.list** - Telegram 规则
- **WeChat.list** - 微信规则
- **YouTube.list** - YouTube 规则
- **bilbili.list** - 哔哩哔哩规则

### Scripts
包含 Surge 自动化脚本：
- **xiaohaios_cookie.js** - 哈士奇应用 Cookie 抓取脚本
- **xiaohaios_checkin.js** - 哈士奇应用自动签到脚本
- **xiaohaios_README.md** - 哈士奇应用脚本使用说明
- **xiaohaios.sgmodule** - Surge 模块配置文件
- **xiaohaios_config_example.conf** - 配置示例

### icon
包含各类应用图标，用于客户端界面美化。

## 使用说明

### 分流规则
将对应的规则文件添加到你的代理客户端配置中即可。

### Surge 脚本
详细使用说明请查看 [Scripts/xiaohaios_README.md](Scripts/xiaohaios_README.md)

## 维护

规则文件会定期更新，建议使用远程订阅方式以获取最新规则。
