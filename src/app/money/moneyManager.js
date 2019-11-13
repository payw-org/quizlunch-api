const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

module.exports =  class MoneyManager {

  static async getQuizTime()
  {
    const quizID = await DBConnector.getLastestQuizID()
    const result = await DBConnector.getQuiz(quizID)
    var quizTime = new Date(result.time)
    return quizTime
  }

  static async getNowTime()
  {
    var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
    nowTime = new Date(nowTime);
    return nowTime;
  }
  
  
  static async getMoney(){
    const defaultMoney=1000;
    var nowMoney;
    const quizTime = this.getQuizTime()

    setInterval(updateMoney, 600);
    function updateMoney() {

      var nowTime = this.getNowTime()
      // var timeMoney=((nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1))*2
      var timeMoney=((nowTime.getHours() * 3600 +nowTime.getMinutes() * 60  + nowTime.getSeconds() * 1 ) - (quizTime.getHours()* 3600 +quizTime.getMinutes() * 60  + quizTime.getSeconds()*1))*1
      if(timeMoney<0)
      {
        timeMoney=0
      }
      nowMoney=defaultMoney+timeMoney
      WSConnector.moneyBroadcast(nowMoney)
    }
  }

  
}

