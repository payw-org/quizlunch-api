const DBConnector = require('../db/DBConnector');
  
  exports.get = async (req, res)  => {
    
    const connection = await DBConnector.getConnection()
    const [result] = await connection.query("SELECT * from quizs where quizID='"+req.body.quizID+"'")
     
    res.send(result)


  };


  exports.create = async (req, res) => {
    
    const connection = await DBConnector.getConnection()

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

    const [result] = await connection.query("insert into quizs(title,picture,information,answer,time,gotAnswer) VALUES ('"+ quiz.title + "', '" + quiz.picture + "','"+ quiz.information + "', '" + quiz.answer+ "', '" + quiz.time +"', '" + quiz.gotAnswer + "') ")

    res.send(result)

  };



  exports.correctCheck = async (req, res) => {
    
    const connection = await DBConnector.getConnection()

    const [result] = await connection.query("SELECT answer from quizs where quizID='"+req.body.quizID+"'")
    if(result[0].answer==req.body.answer)
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

    const connection = await DBConnector.getConnection()
    
    const [result] = await connection.query("UPDATE quizs set gotAnswer ='" +1+"'" +" where quizID='"+ req.body.quizID+"'")
    
    res.send(result)
  };
