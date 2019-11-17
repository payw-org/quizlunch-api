const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');
const Utility = require('../utility/utility')


module.exports =  class MoneyManager {
  

  // static async getMoney(){
  //   const defaultMoney=1000;
  //   setInterval(updateMoney, 60000);
  //   async function updateMoney() {

  //     var quiz = await DBConnector.getLatestQuiz()
  //     if(quiz.gotAnswer==0)// If no one send correct answer
  //     { 
  //       var quizTime = new Date(quiz.time)
  //       var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
  //       nowTime = new Date(nowTime);
  //       var timeMoney=0
  //       if(nowTime.getDate()!=quizTime.getDate())
  //       {
  //         timeMoney=60*24
  //       }
  //       timeMoney=timeMoney+((nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1))*2
  //       if(timeMoney<0)
  //       {
  //         timeMoney=0
  //       }
  //       var nowMoney=defaultMoney+timeMoney
  //       WSConnector.moneyBroadcast(nowMoney)
  //     }
      
  //   }
  // }

  static async updateMoney(){
    setInterval(Money, 60000);
    async function Money() {

      nowMoney=await Utility.getMoney()
      console.log(nowMoney)
      WSConnector.moneyBroadcast(nowMoney)
      
    }
  }



}

