/**
 * 接口查询
 */

import request from 'request';
import queryString from 'querystring';

export default function query(domainArr) {
  return new Promise((resolve, reject) => {
    const params = {
      domain: domainArr.join(','),
      token: 'check-web-hichina-com:ehey13az4uvwdvhdv8708stwjerq28by',
      _: Date.now(),
    };
    request.get(`https://checkapi.aliyun.com/check/checkcwrdomain?${queryString.stringify(params)}`, {
      timeout: 5000,
    }, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        reject(err);
      }
      resolve(body);
    });
  });
}
