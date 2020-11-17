const http = require('http');
const cron = require('node-cron');
const asyncRedis = require("async-redis");
const host = 'localhost';
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
const port = process.env.PORT || 8000;
server.listen(port, async (err) => {

  if (err) {
    console.error(err);
    process.exit();
  }

  console.log(`Server is running on port ${port}`);
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
    let fn = order.customer.first_name
    let ln = order.customer.last_name
    let hashedEmail = crypto.createHash("sha256").update(emailStr).digest("hex");
    let hashedFn = crypto.createHash("sha256").update(fn).digest("hex");
    let hashedLn = crypto.createHash("sha256").update(ln).digest("hex");
    
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
              em: hashedEmail,
              fn: hashedFn,
              ln: hashedLn,
              client_ip_address: order.client_details.browser_ip,
              client_user_agent: order.client_details.user_agent,
            },
            custom_data: {
              value: order.total_price,
              currency: order.currency,
              content_ids: productIds,
              content_type: "product",
              name: order.billing_address.name,
              city: order.billing_address.city,
              country: order.billing_address.country,
              phone: order.customer.phone,
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
