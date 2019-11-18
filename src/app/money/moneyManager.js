const WSConnector = require('../websocket/WSConnector');
const Utility = require('../utility/utility')


module.exports =  class MoneyManager {

  static async updateMoney(){
    setInterval(Money, 60000);
    async function Money() {

      var nowMoney=await Utility.getMoney()
      WSConnector.moneyBroadcast(nowMoney)
      
    }
  }

}

