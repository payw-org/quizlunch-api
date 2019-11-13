const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

module.exports =  class MoneyManager {
  
  static async getMoney(){
    const defaultMoney=1000;
    var nowMoney;
    const quizID = await DBConnector.getLastestQuizID()
    const result = await DBConnector.getQuiz(quizID)
    console.log(result)

    setInterval(updateMoney, 15000);
    function updateMoney() {

      var quizTime = new Date(result)
      var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
      nowTime = new Date(nowTime);


      console.log(quizTime)
      console.log(nowTime)
      var timeMoney=(nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1)
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

