const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

module.exports =  class MoneyManager {
  
  static async getMoney(){
    const defaultMoney=1000;
    var nowMoney;
    const quizID = await DBConnector.getLastestQuizID()
    const result = await DBConnector.getQuiz(quizID)
    const quizTime = result.time

    setInterval(updateMoney, 15000);
    function updateMoney() {

      var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
      today = new Date(today);
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + ' ' + time;

      var timeMoney=(dateTime.substring(11,12) * 60  + dateTime.substring(14,15) * 1 ) - (quizTime.substring(11,12) * 60  + quizTime.substring(14,15)*1)
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

