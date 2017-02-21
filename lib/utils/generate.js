/**
 * 生成组合域名
 */

import fs from 'fs';
import query from './query';
import letters from './letters';

/**
 * 生成拼音组合字典
 * @param pinyinCount 组合次数
 * @param maxLength 最大长度
 */
function generatePinyinDomains(pinyinCount, maxLength) {
  // 可迭代的字典集
  const lettersArray = Array.from({ length: pinyinCount }, () => letters);
  // 组合字典
  return lettersArray.reduce((first, second) => {
    const combinationArray = [];
    first.forEach((firstItem) => {
      second.forEach((secondItem) => {
        const combinationItem = firstItem + secondItem;
        // 最大长度限制
        if (combinationItem.length <= maxLength) {
          combinationArray.push(firstItem + secondItem);
        }
      });
    });
    return combinationArray;
  });
}

/**
 * 生成可用的域名
 * @param pinyinCount
 * @param maxLength
 * @param suffix 域名后缀
 */
export default async function getAvailableDomains(pinyinCount, maxLength, suffix = '.com') {
  // 从拼音列表中拼接成域名列表
  const pinyinArray = generatePinyinDomains(pinyinCount, maxLength);
  const domainArray = pinyinArray.map(n => n + suffix);
  // 创建写入流
  const out = fs.createWriteStream(`domains-${Date.now()}.txt`, {
    encoding: 'utf8',
  });
  const total = domainArray.length;
  console.info('共有 %d 个域名等待查询', total);
  while (domainArray.length > 0) {
    console.info(`->：${((1 - (domainArray.length / total)) * 100).toFixed(2)}%`);
    // 每次只查询 5 个
    const theQueryArray = domainArray.splice(0, 5);
    // 查询域名
    await query(theQueryArray) // eslint-disable-line no-await-in-loop
      .then((dataString) => {
        const data = JSON.parse(dataString);
        // 获取成功
        if (data.success) {
          const module = data.module;
          module.forEach((item) => {
            // 获取可用的域名
            if (item.module.avail) {
              // 写入到文件
              out.write(`${item.module.name}\n`);
              console.info('\x1b[32m%s\x1b[0m', `发现可用域名：${item.module.name}`);
            }
          });
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
  }
  out.end();
}
