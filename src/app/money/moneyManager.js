const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

module.exports =  class MoneyManager {
  
  static async getMoney(){
    const defaultMoney=1000;
    var nowMoney;
    const quizID = await DBConnector.getLastestQuizID()
    const result = await DBConnector.getQuiz(quizID)
    var quizTime = new Date(result.time)

    setInterval(updateMoney, 60000);
    function updateMoney() {

      var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
      nowTime = new Date(nowTime);
      console.log(nowTime.getHours())
      console.log(quizTime.getHours())

      var timeMoney=(nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1)*2
      console.log(timeMoney)
      if(timeMoney<0)
      {
        timeMoney=0
      }
      nowMoney=defaultMoney+timeMoney
      console.log(nowMoney)

      WSConnector.moneyBroadcast(nowMoney)
    }
  }

  
}

