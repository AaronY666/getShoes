const json = require('./data/countries.json');
const { saveAsExecl } = require('./utils');
const data = [['国家', '产品编号', '价格', 'pid', '名称', '折扣', 'url']];
for (let cty in json) {
  const infoList = json[cty];
  const list = infoList.map(({ pid, title, discount, currency, url, productId, name }) => [
    name,
    productId,
    currency,
    pid,
    title,
    discount,
    url,
  ]);
  data.push(...list);
}

saveAsExecl(
  [
    {
      name: 'sheet1',
      data,
    },
  ],
  './result.xlsx'
);
