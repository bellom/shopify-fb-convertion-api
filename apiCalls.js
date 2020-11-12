const axios = require('axios')

const shopifyOrderAPI = 'https://48e93462b5ce511bd4b58eae9ab68000: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@idoacquire.myshopify.com/admin/api/2020-10/orders.json?status=any'
const facebookAPI = 'https://graph.facebook.com/v9.0/800968697300789/events?access_token=EAAL13uWflN0BAHYby21dHOKWirnR8v2MajofnR7Fuxhx21cDiLrZAbKhPhogysIL4rnifZAL60WhZAcZCxAlXfhJJE3fnLct9RutPOL39vn0xEYCV6774FZBhItldlmF4qflZBLrrpWstJAqMZAp7BUx9d3iJLIgwxDMhdRPhG9qHveBbRYAWjz'

const access_token = 'EAAL13uWflN0BAMPRjGSRu8zvfE4EXww1Ca9e1ZAJAFCWZAk2QGZAQXOHx5uBXJpttW8nlXqWpyfNzQ2Q7wPPqedgpXgi2g5o9gZAZCGsUBLr1z0ADODgHs4OYR4lBIdxj6ZAE6MR19lWOpYQwtRNDHCBG8IvXzpI8IMGKktxLZA0Osv9nUJriZA2';
const pixel_id = '800968697300789';

let current_timestamp = Math.floor(new Date() / 1000);

async function makeApiCalls() {
  try {
    let res = await axios.get(shopifyOrderAPI)
    let shopifyData = res.data;
    console.log(shopifyData.orders)
    let value = ''
    let currency = ''
    let email = ''
    shopifyData.orders.forEach(order => {
      value = `${order['total_price']}\n`
      currency = `${order['currency']}\n`
      email = `${order['email']}\n`
    })
    // get total_price & currency from the res.data
    console.log(value, currency, current_timestamp)

    let post = await axios.post(facebookAPI, {
      "data": [
        {
          "event_name": "PageView",
          "event_time": 1605187417,
          "user_data": {
            "fbc": "fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
            "fbp": "fb.1.1558571054389.1098115397",
            "em": "309a0a5c3e211326ae75ca18196d301a9bdbd1a882a4d2569511033da23f0abd"
          }
        }
      ]
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