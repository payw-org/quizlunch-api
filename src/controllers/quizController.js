const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

  exports.createQuiz = async (req, res) => {
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var quiz = {
                'title':req.body.title,
                'picture':req.body.picture,
                'information':req.body.information,
                'answer':req.body.answer,
                'time':dateTime,
                'gotAnswer': 0
            };

    await DBConnector.insertQuiz(quiz)
    res.send(200)
  };

  exports.checkAnswer = async (req, res) => {
    const answer = await DBConnector.getAnswer(req.params.quizID)
    if(answer==req.params.answer){
      await DBConnector.updateQuizSolved(req.params.quizID)
      const quiz = await DBConnector.getQuiz(req.params.quizID)
      WSConnector.broadcast('renew quiz', quiz)
      res.send("correct")
    }
    else{
      res.send("wrong")
    }
  };

  // exports.updateAnswer = async (req, res) => {

  //   await DBConnector.updateQuizSolved(req.body.quizID)
  //   const quiz = await DBConnector.getQuiz(req.body.quizID)  
  //   WSConnector.broadcastQuiz(quiz)
  // };
