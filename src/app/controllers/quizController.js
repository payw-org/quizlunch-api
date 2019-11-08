const DBConnector = require('../db/DBConnector');
  
  exports.get = async (req, res)  => {
    
    const quiz = await DBConnector.getOneQuiz(req.params.quizID)
    res.send(quiz)

  };


  exports.create = async (req, res) => {
    
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

    const [result] = await DBConnector.insertQuiz(quiz)

    res.send(result)

  };



  exports.correctCheck = async (req, res) => {
    
    const [answer] = await DBConnector.findAnswer()
    if(answer[0].answer==req.params.answer)
    {
        console.log('Correct Answer');
        res.send("correct")
    }
    else
    {
        console.log('wrong answer');
        res.send("wrong")
    }
    
  };

  exports.updateGotAnswer = async (req, res) => {
    
    await DBConnector.updateGotAnswer(req.body.quizID)
    
    res.send("update gotAnser")
  };
