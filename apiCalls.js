const axios = require('axios')

// Shopify API: GET '/admin/api/2020-10/orders.json?status=any'
const shopifyOrderAPI = 'https://48e93462b5ce511bd4b58eae9ab68000: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@idoacquire.myshopify.com/admin/api/2020-10/orders.json?status=any'
const facebookAPI = 'https://graph.facebook.com/v9.0/800968697300789/events?access_token=EAAL13uWflN0BAHYby21dHOKWirnR8v2MajofnR7Fuxhx21cDiLrZAbKhPhogysIL4rnifZAL60WhZAcZCxAlXfhJJE3fnLct9RutPOL39vn0xEYCV6774FZBhItldlmF4qflZBLrrpWstJAqMZAp7BUx9d3iJLIgwxDMhdRPhG9qHveBbRYAWjz'


async function makeApiCalls() {
  try {
    let res = await axios.get(shopifyOrderAPI)
    let shopifyData = res.data;
    console.log(shopifyData.orders[0])
    shopifyData.data.orders.forEach(order => {

    })

      let post = await axios.post(facebookAPI, {
        shopifyData,
        // "data": [
          //   {
            //     "event_name": "Purchase",
            //     "event_time": 1605127125,
            //     "user_data": {
              //       "em": "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068",
              //       "ph": null
              //     },
              //     "custom_data": {
                //       "currency": "USD",
                //       "value": "142.52"
                //     }
                //   }
                // ],
                // "test_event_code": "TEST85260"
                
        })
      .then(res => {
        console.log(`statusCode: ${res.statusCode}`)
        console.log(res)
      })

  } catch(error){
    console.error(error)
  }
}

makeApiCalls();