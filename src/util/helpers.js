import fetch from 'node-fetch';

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getInfo = (skus) => fetch(`https://www.bestbuy.com/api/3.0/priceBlocks?skus=${skus.join()}`, {
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
    Accept: 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/json',
  },
}).then((res) => res.json());
