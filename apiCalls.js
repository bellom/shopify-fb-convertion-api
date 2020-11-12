const axios = require('axios')
const shopifyOrderAPI = 'https://48e93462b5ce511bd4b58eae9ab68000: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@idoacquire.myshopify.com/admin/api/2020-10/orders.json?status=any'
const facebookAPI = 'https://graph.facebook.com/v9.0/800968697300789/events?access_token=EAAL13uWflN0BAHYby21dHOKWirnR8v2MajofnR7Fuxhx21cDiLrZAbKhPhogysIL4rnifZAL60WhZAcZCxAlXfhJJE3fnLct9RutPOL39vn0xEYCV6774FZBhItldlmF4qflZBLrrpWstJAqMZAp7BUx9d3iJLIgwxDMhdRPhG9qHveBbRYAWjz'



const makeApiCalls = () => {
   axios.get(shopifyOrderAPI)
      .then((res) => {
         let shopifyData = res.data;
         shopifyData.orders.forEach(order => {
            axios.post(facebookAPI, {
               "data": [
                  {
                    "event_name": "Purchase",
                    "event_time": order.created_at,
                    "user_data": {
                      "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
                      "fbp": "fb.1.1558571054389.1098115397",
                      "em": "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"
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
      })
   .catch((err) => {
      console.log(err)
   })
}

makeApiCalls();