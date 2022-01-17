const { countries } = require('./consts');
const { resolve } = require('path');
const { getCountryData, saveAsExecl } = require('./utils');
const { writeFile } = require('fs');

const promiseall = [];
const map = {};

countries.forEach(countryItem => {
  promiseall.push(
    getCountryData(countryItem).then(data => {
      map[countryItem.name] = data;
      // 按照折扣大小排个序
      // data = data.sort((a, b) => parseInt(b[2]) - parseInt(a[2]));
      // data.unshift(['产品id', '名称', '折扣', '原价', '现价', '地址']);

      // // 根据id生成map表格，用于比较商品的价格
      // const mapList = {};
      // data.forEach(dataItem => {
      //   mapList[dataItem[0]] = dataItem;
      // });
      // map[countryItem.name] = mapList;

      // // 把各区域信息保存到表格中
      // const path = resolve(__dirname, `${countryItem.name}.xlsx`);
      // saveAsExecl(
      //   [
      //     {
      //       name: 'sheet1',
      //       data,
      //     },
      //   ],
      //   path
      // );
    })
  );
});

Promise.all(promiseall).then(() => {
  writeFile(resolve(__dirname, './data', 'countries.json'), JSON.stringify(map), err => {
    console.error(err);
  });
});
