/**
 * 查询域名
 */

import request from 'request';
import queryString from 'querystring';

export default function query(domainArr) {
  return new Promise((resolve, reject) => {
    const params = {
      domain: domainArr.join(','),
      token: 'check-web-hichina-com:6oherhmawca0pt91qg8hcc82rbo08zqz',
      _: Date.now(),
    };
    request.get(`https://checkapi.aliyun.com/check/checkcwrdomain?${queryString.stringify(params)}`,
      (err, res, body) => {
        if (err || res.statusCode !== 200) {
          reject(err);
        }
        resolve(body);
      });
  });
}
