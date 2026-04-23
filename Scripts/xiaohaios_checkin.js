/*
 * 哈士奇应用自动签到脚本
 * 
 * [Script]
 * 哈士奇签到 = type=cron,cronexp="0 9 * * *",wake-system=1,timeout=60,script-path=xiaohaios_checkin.js
 */

const cookieName = '哈士奇应用';
const checkinUrl = 'https://www.xiaohaios.com/aspx3/mobile/qiandao.aspx';

// User-Agent配置 (iPhone微信)
const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.38(0x18002633) NetType/WIFI Language/zh_CN';

// 执行签到
async function checkin() {
  const cookie = $persistentStore.read(`${cookieName}_cookie`);
  
  if (!cookie) {
    console.log(`${cookieName}: 未找到Cookie，请先抓取Cookie`);
    $notification.post(
      cookieName,
      '签到失败',
      '未找到Cookie，请先访问小哈士奇网站抓取Cookie'
    );
    return { success: false, message: '未找到Cookie' };
  }

  console.log(`${cookieName}: 开始签到...`);
  
  const headers = {
    'Cookie': cookie,
    'User-Agent': userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive'
  };

  const request = {
    url: checkinUrl,
    headers: headers,
    timeout: 30
  };

  return new Promise((resolve) => {
    $httpClient.get(request, (error, response, data) => {
      if (error) {
        console.log(`${cookieName}: 签到请求失败 - ${error}`);
        $notification.post(
          cookieName,
          '签到失败',
          `请求错误: ${error}`
        );
        resolve({ success: false, message: error });
        return;
      }

      const statusCode = response.status;
      console.log(`${cookieName}: 响应状态码 ${statusCode}`);

      if (statusCode === 200) {
        // 检查响应内容
        if (data) {
          let message = '签到请求已发送';
          
          // 根据响应内容判断签到结果
          if (data.includes('签到成功') || data.includes('成功')) {
            message = '签到成功 🎉';
            console.log(`${cookieName}: ${message}`);
            $notification.post(cookieName, '签到成功', '今日签到已完成');
            resolve({ success: true, message: message });
          } else if (data.includes('已签到') || data.includes('已经签到') || data.includes('重复')) {
            message = '今日已签到 ✓';
            console.log(`${cookieName}: ${message}`);
            $notification.post(cookieName, '签到提醒', '今日已签到过了');
            resolve({ success: true, message: message });
          } else if (data.includes('登录') || data.includes('login')) {
            message = 'Cookie已失效，请重新抓取';
            console.log(`${cookieName}: ${message}`);
            $notification.post(cookieName, '签到失败', 'Cookie已失效，请重新抓取');
            resolve({ success: false, message: message });
          } else {
            // 无法明确判断结果
            console.log(`${cookieName}: ${message}`);
            console.log(`${cookieName}: 响应内容: ${data.substring(0, 200)}`);
            $notification.post(cookieName, '签到完成', message);
            resolve({ success: true, message: message });
          }
        } else {
          console.log(`${cookieName}: 签到成功（无响应内容）`);
          $notification.post(cookieName, '签到完成', '请求已发送');
          resolve({ success: true, message: '签到请求已发送' });
        }
      } else if (statusCode === 302 || statusCode === 301) {
        // 可能是需要登录的重定向
        console.log(`${cookieName}: 收到重定向，Cookie可能已失效`);
        $notification.post(
          cookieName,
          '签到失败',
          'Cookie可能已失效，请重新抓取'
        );
        resolve({ success: false, message: 'Cookie可能已失效' });
      } else {
        console.log(`${cookieName}: 签到失败，状态码 ${statusCode}`);
        $notification.post(
          cookieName,
          '签到失败',
          `HTTP状态码: ${statusCode}`
        );
        resolve({ success: false, message: `HTTP ${statusCode}` });
      }
    });
  });
}

// 重试逻辑
async function checkinWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    console.log(`${cookieName}: 第 ${i + 1} 次尝试签到`);
    
    const result = await checkin();
    
    if (result.success) {
      console.log(`${cookieName}: 签到成功`);
      return;
    }
    
    // 如果是Cookie失效，不需要重试
    if (result.message && result.message.includes('Cookie')) {
      console.log(`${cookieName}: Cookie问题，停止重试`);
      return;
    }
    
    // 等待一段时间后重试
    if (i < maxRetries - 1) {
      console.log(`${cookieName}: 等待10秒后重试...`);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  console.log(`${cookieName}: 签到失败，已重试 ${maxRetries} 次`);
  $notification.post(
    cookieName,
    '签到失败',
    `已重试${maxRetries}次，请检查网络或Cookie`
  );
}

// 主函数
(async () => {
  await checkinWithRetry(3);
  $done();
})();
