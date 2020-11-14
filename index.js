const http = require('http');
const cron = require('node-cron');
const asyncRedis = require("async-redis");
const host = 'localhost';
const port = 8000;
const axios = require('axios')
const crypto = require('crypto');
require('dotenv').config();

const client = asyncRedis.createClient(process.env.REDIS_URL);

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Started Shopify Server')
}

client.on("error", function(error) {
  console.error(error);
});

const server = http.createServer(requestListener);
server.listen(port, host, async () => {
  console.log(`Server is running on http://${host}:${port}`);

  cron.schedule('*/5 * * * * *', async () => {
    console.log('running SHOPIFY scheduled task.');

    await shopifyOrderApi();

    console.log('Finished running SHOPIFY scheduled task.');

  });
})

const myShopifyLink = `https://${process.env.API_KEY}:${process.env.SHOPIFY_PASSWORD}@${process.env.SHOPIFY_SITE}`
const shopifyOrderAPI = `${myShopifyLink}/admin/api/2020-10/orders.json?status=any`
const facebookAPI = `https://graph.facebook.com/v9.0/${process.env.FB_PIXEL_ID}/events?access_token=${process.env.FB_PIXEL_TOKEN}`

const shopifyOrderApi = async () => {

  const sinceId =   await client.get(process.env.SHOPIFY_ORDER_ID_KEY);

  const requestUrl = sinceId ? `${shopifyOrderAPI}&since_id=${sinceId}` : shopifyOrderAPI;
  const res = await axios.get(requestUrl);
  let shopifyOrders = res.data.orders;

  console.log(`last order processed ${sinceId}`);
  console.log(`processing ${shopifyOrders.length} total orders`);

  const productIds = [];
  shopifyOrders.forEach(async (order) => {    
    let emailStr = order.email;
    let hashStr = crypto.createHash("sha256").update(emailStr).digest("hex");
    order.line_items.forEach(product => {
      productIds.push(product.product_id)
    })
    
    const res = await axios
      .post(facebookAPI, {
        data: [
          {
            event_name: "Purchase",
            event_time: order.created_at,
            user_data: {
              em: hashStr,
            },
            custom_data: {
              value: order.total_price,
              currency: order.currency,
              content_ids: productIds,
              content_type: "product",
            },
          },
        ],
      });

      console.log(`processed ${order.id}`);
      console.log(`statusCode: ${res.status}`);
  });

  if (shopifyOrders.length > 0) {
    client.set(process.env.SHOPIFY_ORDER_ID_KEY, shopifyOrders[0].id);
  }
};
