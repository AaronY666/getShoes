const basePath = 'https://api.nike.com/cic/browse/v1?';
const channelId = '3Dd9a5bc42-4b9c-4976-858a-f159cf99c647';
const getEndpointStr = (place, lang, code) =>
  `${basePath}endpoint=%2Fproduct_feed%2Frollup_threads%2Fv2%3Ffilter%3Dmarketplace(${place})%26filter%3Dlanguage(${lang})%26filter%3DemployeePrice(true)%26filter%3DattributeIds(${code})%26anchor%3d0%26consumerChannelId%${channelId}%26count%3d60&language=de&localizedRangeStr=%7BlowestPrice%7D%20%E2%80%93%20%7BhighestPrice%7D`;
const countries = [
  {
    name: '中国',
    code: '16633190-45e5-4830-a068-232ac7aea82c%2C5b21a62a-0503-400c-8336-3ccfbff2a684',
    lang: 'zh-Hans',
    country: 'CN',
  },
  {
    name: '德国',
    code: '0f64ecc7-d624-4e91-b171-b83a03dd8550%2C16633190-45e5-4830-a068-232ac7aea82c',
    lang: 'de',
    country: 'de',
  },
  {
    name: '加拿大',
    code: '16633190-45e5-4830-a068-232ac7aea82c',
    lang: 'en-GB',
    country: 'CA',
  },
  {
    name: '美国',
    code: '16633190-45e5-4830-a068-232ac7aea82c',
    lang: 'en',
    country: 'us',
  },
].map(item => ({
  ...item,
  url: getEndpointStr(item.country, item.lang, item.code),
  params: {
    queryid: 'products',
    anonymousId: '833BB267C08A913EE750DA32B603B000',
    country: item.country,
  },
}));

const currency = {
  EUR: 7.2377,
  USD: 6.3454,
  CAD: 5.0593,
};

module.exports = {
  countries,
  currency,
};
