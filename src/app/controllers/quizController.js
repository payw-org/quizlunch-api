const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

exports.getLeftPage = async (req, res) => {
  const curQuizID = await DBConnector.getLeftQuizID(req.params.quizID)
  const curQuiz = await DBConnector.getQuiz(curQuizID)
  const curComments = await DBConnector.getQuiz(curQuizID)
  WSConnector.quizBroadcast(curQuiz)
  WSConnector.commentBroadcast(curComments)
};

exports.getRightPage = async (req, res) => {
  const curQuizID = await DBConnector.getRightQuizID(req.params.quizID)
  const curQuiz = await DBConnector.getQuiz(curQuizID)
  const curComments = await DBConnector.getQuiz(curQuizID)
  WSConnector.quizBroadcast(curQuiz)
  WSConnector.commentBroadcast(curComments)
};

  exports.createQuiz = async (req, res) => {
    
    console.log("test")
    var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
    today = new Date(today);
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;

    var quiz = {
                'money':0,
                'title':req.body.title,
                'picture':req.body.picture,
                'information':req.body.information,
                'answer':req.body.answer,
                'time':dateTime,
                'gotAnswer': 0

            };
    console.log(quiz)
    await DBConnector.insertQuiz(quiz)
    res.send(200)
  };

  exports.checkAnswer = async (req, res) => {
    const answer = await DBConnector.getAnswer(req.params.quizID)
    if(answer==req.params.answer){
      await DBConnector.updateQuizSolved(req.params.quizID)
      const quiz = await DBConnector.getQuiz(req.params.quizID)
      WSConnector.quizBroadcast(quiz)
      res.send("correct")
    }
    else{
      res.send("wrong")
    }
  };


  

  // exports.updateAnswer = async (req, res) => {

  //   await DBConnector.updateQuizSolved(req.body.quizID)
  //   const quiz = await DBConnector.getQuiz(req.body.quizID)  
  //   WSConnector.quizBroadcast(quiz)
  // };