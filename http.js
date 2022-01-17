const express = require('express');
const app = express();
const port = 3000;
const host = '192.168.0.104';
const fs = require('fs');
const { getInfoListByCountry } = require('./utils');
const memoryJson = require('./data/memory.json'); // 图片缓存

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const productInfo = getInfoListByCountry('加拿大')
  .map(item => item.productId)
  .filter(productId => !checkMemory(productId)); // 查找未截取过的图片
// app.use(upload.any());
app.get('/', (req, res) => {
  //   const productInfo = require('./data/productsInfo.json');
  const count = 100;
  const newList = productInfo.splice(0, count);
  console.log(newList);
  res.json(newList);
});

app.post('/saveImg', function (req, res) {
  const { img, name } = req.body;
  const imgBase64 = img;
  const dataBuffer = Buffer.from(imgBase64, 'base64');
  fs.writeFileSync(`./uploads/${name}.png`, dataBuffer);
  checkMemory(name, true);
  res.send('ok');
});

app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

function checkMemory(productId, updateValue) {
  const bool = memoryJson[productId];
  if (updateValue !== undefined) {
    memoryJson[productId] = updateValue;
    fs.writeFileSync('./data/memory.json', JSON.stringify(memoryJson));
  }
  return bool;
}
