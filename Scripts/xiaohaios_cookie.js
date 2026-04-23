/*
 * 哈士奇应用 Cookie 抓取脚本
 * 
 * [Script]
 * 哈士奇Cookie = type=http-request,pattern=^https:\/\/www\.xiaohaios\.com,requires-body=0,max-size=0,script-path=xiaohaios_cookie.js
 * 
 * [MITM]
 * hostname = www.xiaohaios.com
 */

const cookieName = '哈士奇应用';
const cookieKeys = ['ASP.NET_SessionId', 'dt_cookie_openid_remember', 'dt_cookie_user_name_remember'];

// 从请求头中提取Cookie
function getCookie(cookieStr, key) {
  if (!cookieStr) return null;
  const regex = new RegExp(`${key}=([^;]+)`);
  const match = cookieStr.match(regex);
  return match ? match[1] : null;
}

// 主函数
function main() {
  const request = $request;
  const cookieHeader = request.headers['Cookie'] || request.headers['cookie'];
  
  if (!cookieHeader) {
    console.log(`${cookieName}: 未找到Cookie头`);
    $done({});
    return;
  }

  let cookies = {};
  let foundAny = false;

  // 提取所需的Cookie
  cookieKeys.forEach(key => {
    const value = getCookie(cookieHeader, key);
    if (value) {
      cookies[key] = value;
      foundAny = true;
    }
  });

  if (foundAny) {
    // 保存完整的Cookie字符串
    const cookieValue = Object.keys(cookies)
      .map(key => `${key}=${cookies[key]}`)
      .join('; ');
    
    $persistentStore.write(cookieValue, `${cookieName}_cookie`);
    
    const savedKeys = Object.keys(cookies).join(', ');
    console.log(`${cookieName}: Cookie获取成功 🎉`);
    console.log(`${cookieName}: 已保存 ${savedKeys}`);
    
    $notification.post(
      cookieName,
      'Cookie获取成功',
      `已保存: ${savedKeys}`
    );
  } else {
    console.log(`${cookieName}: 未找到所需的Cookie字段`);
  }

  $done({});
}

main();
