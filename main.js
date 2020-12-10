import fetch from 'node-fetch';
import { sendLocation, sendISPUEligible } from './util/discord';
import {
  webhook, skus, delayTime, zipCode,
} from './util/config';
import { delay, getInfo } from './util/helpers';

const init = async (previousItems, skuInfo) => {
  const productInfo = skuInfo || await getInfo(skus);
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0',
    Accept: 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    locationId: 111,
    zipCode: zipCode.toString(),
    showOnShelf: true,
    lookupInStoreQuantity: true,
    xboxAllAccess: false,
    consolidated: false,
    showOnlyOnShelf: false,
    showInStore: false,
    pickupTypes: null,
    onlyBestBuyLocations: true,
    items: skus.map((sku) => ({
      sku: sku.toString(),
      condition: null,
      quantity: 1,
      itemSeqNumber: '1',
      reservationToken: null,
      selectedServices: [],
      requiredAccessories: [],
      isTradeIn: false,
      isLeased: false,
    })),
  });
  const storesResp = await fetch('https://www.bestbuy.com/productfulfillment/c/api/2.0/storeAvailability', {
    headers,
    body,
    method: 'POST',
  });

  if (!storesResp.ok) {
    return init(previousItems, skuInfo);
  }

  const storesJson = await storesResp.json();
  const { items, locations } = storesJson.ispu;

  if (previousItems.length === 0) {
    console.log('Monitor started');
    return init(items);
  }

  for (const item of items) {
    const previousItem = previousItems.find((i) => i.sku === item.sku);
    if (item.ispuEligible !== previousItem.ispuEligible) {
      const { names, price, url } = productInfo.find((product) => (
        product.sku.skuId === item.sku
      )).sku;
      await sendISPUEligible({
        webhook,
        product: names.short,
        link: `https://www.besbuy.com${url}`,
        status: item.ispuEligible,
        image: `https://pisces.bbystatic.com/image2/BestBuy_US/images/products/${item.sku.substring(0, 4)}/${item.sku}_sd.jpg`,
        price: price.currentPrice,
      });
    }
    for (const location of item.locations) {
      const previousLocation = previousItem.locations.find((l) => (
        location.locationId === l.locationId
      ));

      if (!previousLocation) {
        return init(items, productInfo);
      }
      if (!!location.availability && !previousLocation.availability) {
        const { names, price, url } = productInfo.find((product) => (
          product.sku.skuId === item.sku
        )).sku;
        await sendLocation({
          webhook,
          product: names.short,
          link: `https://www.besbuy.com${url}`,
          status: location.availability.fulfillmentType,
          image: `https://pisces.bbystatic.com/image2/BestBuy_US/images/products/${item.sku.substring(0, 4)}/${item.sku}_sd.jpg`,
          price: price.currentPrice,
          location: locations.find((l) => l.id === location.locationId).name,
        });
      }
    }
  }
  await delay(delayTime);
  return init(items, productInfo);
};

init([], null);
