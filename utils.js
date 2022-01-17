const xlsx = require('node-xlsx');
const fs = require('fs');
const axios = require('axios');
const { resolve } = require('path');
const { currency: currencyMap } = require('./consts');

function saveAsExecl(data, path) {
  let buffer = xlsx.build(data);

  // 写入文件
  fs.writeFile(path || 'a.xlsx', buffer, function (err) {
    if (err) {
      console.log(`Write failed: ${err}`);
      return;
    }

    console.log('Write completed.');
  });
}

function getCountryData(countryItem, data) {
  const { url, params, country = 'cn' } = countryItem || {};
  data = data || [];
  console.log(`【${countryItem.name}】:开始获取数据`);
  return axios
    .get(url, {
      params,
    })
    .then(function (response) {
      const { products } = response.data.data.products;
      // 如果遍历完了，直接返回data数据
      if (!products) {
        console.log(`遍历到底了，当前data的长度为${data.length}`);
        return Promise.resolve(data);
      }
      console.log(`【${countryItem.name}】:数据获取成功，一共得到${products.length}个数据，处理中。。。`);
      //   const data = [['名称', '折扣', '原价', '现价', '地址']];
      products.forEach(item => {
        const {
          title,
          url,
          pid,
          price: { fullPrice, currentPrice, currency },
        } = item;
        data.push(
          {
            pid,
            title,
            discount: `${Math.floor(((fullPrice - currentPrice) / fullPrice) * 100)}%`,
            currency: `${Math.floor((currencyMap[currency] || 1) * currentPrice)}元`,
            url: `https://www.nike.com/${url.replace('{countryLang}', country)}`,
            productId: url.split('/').pop(),
            name: countryItem.name,
          }
          // [
          //   pid,
          //   title,
          //   `${Math.floor(((fullPrice - currentPrice) / fullPrice) * 100)}%`,
          //   `${Math.floor((currencyMap[currency] || 1) * fullPrice)}元`,
          //   `${Math.floor((currencyMap[currency] || 1) * currentPrice)}元`,
          //   `https://www.nike.com/${url.replace('{countryLang}', country)}`,
          // ]
        );
      });

      // 继续获取下一组数据
      const curAchor = Number(url.match(/anchor%3d([0-9]+)/)?.[1]);
      console.log(`【${countryItem.name}】:处理完毕，获取第${curAchor}个到第${curAchor + 61}个的数据...`);
      if (curAchor === null || data.length < 60) {
        console.log(`【${countryItem.name}】:数据已全部获取完毕！`);
        return Promise.resolve(data);
      }

      return getCountryData(
        {
          ...countryItem,
          url: url.replace(/anchor%3d([0-9]+)/, `anchor%3d${curAchor + 61}`),
        },
        data
      );
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

function getCoutriesDiff() {
  const countriesJson = require('./data/countries.json');

  // 找到不同国家之间相同的鞋子
  let count = 0;
  let num = 0;
  const countries = Object.keys(countriesJson); // 中国 、德国
  countries.forEach((country, idx) => {
    if (idx === countries.length - 1) {
      return;
    }
    const productIds = Object.keys(countriesJson[country]);
    // 遍历所有的商品
    productIds.forEach(pid => {
      // 从第一个国家开始，和其他国家比较
      let isSame = true;
      for (let i = idx + 1; i < countries.length; i++) {
        const otherCountry = countriesJson[countries[i]];
        if (!otherCountry[pid]) {
          isSame = false;
          break;
        }
      }
      // 所有国家都有则加一
      isSame && count++;
    });
  });

  console.log(count);
}

function getInfoListByCountry(country) {
  const dataJson = require(resolve(__dirname, './data/countries.json'));
  const list = [];
  const countries = country ? [country] : Object.keys(dataJson);
  countries.forEach(name => {
    const ctData = dataJson[name];
    list.push(...ctData);
  });
  return list;
  // fs.writeFileSync(resolve(__dirname, './data/productsInfo.json'), JSON.stringify(list));
}

module.exports = {
  saveAsExecl,
  getCountryData,
  getInfoListByCountry,
};



