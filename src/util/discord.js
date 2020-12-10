import fetch from 'node-fetch';

export const sendLocation = async ({
  webhook, product, link, location, image, price, status,
}) => fetch(webhook, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    embeds: [{
      title: `[BestBuy] ${product}`,
      url: link,
      description: 'ISPU location availability status change',
      thumbnail: {
        url: image,
      },
      fields: [
        {
          name: 'status',
          value: status,
          inline: true,
        },
        {
          name: 'price:',
          value: price.toString(),
          inline: true,
        },
        {
          name: 'location',
          value: location,
          inline: true,
        },
      ],
    }],
  }),
});

export const sendISPUEligible = async ({
  webhook, product, link, status, image, price,
}) => fetch(webhook, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    embeds: [{
      title: `[BestBuy] ${product}`,
      url: link,
      description: 'ISPU eligibility change',
      thumbnail: {
        url: image,
      },
      fields: [
        {
          name: 'status',
          value: status,
          inline: true,
        },
        {
          name: 'price',
          value: price.toString(),
          inline: true,
        },
      ],
    }],
  }),
});
