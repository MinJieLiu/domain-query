/**
 * 接口查询
 */

import request from 'request';
import queryString from 'querystring';

export default function query(domainArr) {
  return new Promise((resolve) => {
    const params = {
      domain: domainArr.join(','),
      token: 'check-web-hichina-com:6oherhmawca0pt91qg8hcc82rbo08zqz',
      _: Date.now(),
    };
    request.get(`https://checkapi.aliyun.com/check/checkcwrdomain?${queryString.stringify(params)}`,
      (err, res, body) => {
        if (res.statusCode === 200) {
          resolve(body);
        }
      });
  });
}
