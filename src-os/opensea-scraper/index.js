const Web3 = require('web3')
const OpenSeaPort = require('opensea-js').OpenSeaPort
const Network = require('opensea-js').Network
const Sell = require('opensea-js').Sell

const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io')
const seaport = new OpenSeaPort(provider, {
  networkName: Network.Main
})

seaport.api.getOrder({
  asset_contract_address: '0x495f947276749ce646f68ac8c248420045cb7b5e',
  token_id: '93541831110195558149617722636526811076207680274132077301105327991534259273729',
  side: Sell
}).then(function(order) {
    console.log(order)
  // Important to check if the order is still available as it can have already been fulfilled by
  // another user or cancelled by the creator
  if (order) {
    // This will bring the wallet confirmation popup for the user to confirm the purchase
    seaport.fulfillOrder({ order: order, accountAddress: account });
  } else {
    // Handle when the order does not exist anymore
  }
})