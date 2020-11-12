const bizSdk = require('facebook-nodejs-business-sdk');

const accessToken = 'EAAL13uWflN0BAMPRjGSRu8zvfE4EXww1Ca9e1ZAJAFCWZAk2QGZAQXOHx5uBXJpttW8nlXqWpyfNzQ2Q7wPPqedgpXgi2g5o9gZAZCGsUBLr1z0ADODgHs4OYR4lBIdxj6ZAE6MR19lWOpYQwtRNDHCBG8IvXzpI8IMGKktxLZA0Osv9nUJriZA2';
const accountId = 'act_{3296388293822423}';

const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Campaign = bizSdk.Campaign;

const account = new AdAccount(accountId);
var campaigns;
    
account.read([AdAccount.Fields.name])
  .then((account) =>{
    return account.getCampaigns([Campaign.Fields.name], { limit: 10 }) // fields array and params
  })
  .then((result) =>{
    campaigns = result
    campaigns.forEach((campaign) =>console.log(campaign.name))  
  }).catch(console.error);
