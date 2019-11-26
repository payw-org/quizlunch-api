const DBConnector = require('../db/DBConnector');

module.exports =  class Utility {


  static async isItSolved()
  {
    var result = await DBConnector.getLatestQuiz()
    var gotAnswer = result.gotAnswer
    return gotAnswer
  }

  static async getLatestQuizTime()
  {
    var quiz = await DBConnector.getLatestQuiz()
    var quizTime = new Date(quiz.time)
    return quizTime
  }

  static async getNowTime()
  {
    var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
    nowTime = new Date(nowTime);
    return nowTime
  }


  static async getMoney(){

    const defaultMoney=1000;
    var quiz = await DBConnector.getLatestQuiz()
    if(quiz.gotAnswer==0)// If no one send correct answer
    { 
        var quizTime = new Date(quiz.time)
        var nowTime =  await this.getNowTime()
        var timeMoney=0
        if(nowTime.getDate()!=quizTime.getDate())
        {
            timeMoney=60*24
        }
        timeMoney=timeMoney+((nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1))*2
        if(timeMoney<0)
        {
            timeMoney=0
        }
    }
    return defaultMoney+timeMoney 
    
    }
}

  



  
  
 