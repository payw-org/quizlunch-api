const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

module.exports =  class MoneyManager {
  
  static async getMoney(){
    const defaultMoney=1000;
    var nowMoney;
    const quizID = await DBConnector.getLastestQuizID()
    const result = await DBConnector.getQuiz(quizID)
    var quizTime = new Date(result.time)

    setInterval(updateMoney, 600);
    function updateMoney() {

      var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
      nowTime = new Date(nowTime);
      // var timeMoney=((nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1))*2
      var timeMoney=((nowTime.getMinutes() * 60  + nowTime.getSeconds() * 1 ) - (quizTime.getMinutes() * 60  + quizTime.getSeconds()*1))*1

      if(timeMoney<0)
      {
        timeMoney=0
      }
      nowMoney=defaultMoney+timeMoney
      WSConnector.moneyBroadcast(nowMoney)
    }
  }

  
}

