const axios = require('axios')
const crypto = require('crypto');
require('dotenv').config()

const myShopifyLink = `https://${process.env.API_KEY}:${process.env.SHOPIFY_PASSWORD}@${process.env.SHOPIFY_SITE}`
const shopifyOrderAPI = `${myShopifyLink}/admin/api/2020-10/orders.json?status=any`
const abandonedOrderAPI = `${myShopifyLink}/admin/api/2020-10/checkouts.json`
const facebookAPI = `https://graph.facebook.com/v9.0/${process.env.FB_PIXEL_ID}/events?access_token=${process.env.FB_PIXEL_TOKEN}`

const shopifyOrderApi = () => {
   axios.get(shopifyOrderAPI)
      .then(res => {
         let shopifyOrders = res.data;
         let ordersArray = []
         shopifyOrders.orders.forEach(order => {
            let emailStr = order.email;
            let hashStr = crypto.createHash('sha256').update(emailStr).digest('hex');
            ordersArray.push(order.created_at, order.id)
            axios.post(facebookAPI, {
               "data": [
                  {
                    "event_name": "Purchase",
                    "event_time": order.created_at,
                    "user_data": {
                      "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
                      "fbp": "fb.1.1558571054389.1098115397",
                      "em": hashStr
                    },
                    "custom_data": {
                      "value": order.total_price,
                      "currency": order.currency,
                      "content_ids": [
                         "product.id.123"
                      ],
                      "content_type": "product"
                   }
                  }
               ]
          })
          .then(res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(res)
          })
         })
         console.log(ordersArray);

      })
   .catch((err) => {
      console.log(err)
   })
}


const shopifyAbandonedAPI = () => {
   axios.get(abandonedOrderAPI)
      .then(res => {
         let shopifyCheckouts = res.data
         shopifyCheckouts.checkouts.forEach(checkout => {
            let emailStr = order.email;
            let hashStr = crypto.createHash('sha256').update(emailStr).digest('hex');
            axios.post(facebookAPI, {
               "data": [
                  {
                    "event_name": "Abandoned",
                    "event_time": checkout.created_at,
                    "user_data": {
                      "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
                      "fbp": "fb.1.1558571054389.1098115397",
                      "em": hashStr
                    },
                    "custom_data": {
                      "value": checkout.total_price,
                      "currency": checkout.currency,
                      "content_ids": [
                         "product.id.123"
                      ],
                      "content_type": "product"
                   }
                  }
               ]
            })
            .then(res => {
               console.log(`statusCode: ${res.statusCode}`)
               console.log(res)
            })
         })
      })
   .catch((err) => {
      console.log(err)
   })
}

shopifyOrderApi()
// shopifyAbandonedAPI()