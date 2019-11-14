const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

module.exports =  class MoneyManager {


  static async isItSolved()
  {
    const result = await DBConnector.getLatestQuiz()
    var gotAnswer = result.gotAnswer
    return gotAnswer
  }

  static async getLatestQuizTime()
  {
    const result = await DBConnector.getLatestQuiz()
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
    setInterval(updateMoney, 6000);
    function updateMoney() {

      // if(this.isItSolved()==0)// If no one send correct answer
      // {
        var quizTime = this.getLatestQuizTime()
        var nowTime = this.getNowTime()
        var timeMoney=0;
        if(nowTime.getDate()!=quizTime.getDate())
        {
          timeMoney=60*24
        }
        timeMoney=timeMoney+((nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1))*2
        if(timeMoney<0)
        {
          timeMoney=0
        }
        var nowMoney=defaultMoney+timeMoney
        console.log(nowMoney)
        WSConnector.moneyBroadcast(nowMoney)
      // }
      
    }
  }

  
}

