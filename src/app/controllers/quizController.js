const DBConnector = require('../db/DBConnector');
const connection = DBConnector.getConnection()
  
  exports.get = (req, res) => {
    
    connection.query("SELECT * from quizs where quizID='"+req.body.quizID+"'", function(err,  rows, fields) {
      if (!err)
      {
        console.log('Select quiz', rows);
        res.json(rows)
      }
      else
        console.log('Error while performing Select quiz Query.', err);
    });



  };


  exports.create = (req, res) => {
    
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

    connection.query("insert into quizs(title,picture,information,answer,time,gotAnswer) VALUES ('"+ quiz.title + "', '" + quiz.picture + "','"+ quiz.information + "', '" + quiz.answer+ "', '" + quiz.time +"', '" + quiz.gotAnswer + "') ", function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        res.send(200,'success');
    });



  };



  exports.correctCheck = (req, res) => {
    
    connection.query("SELECT answer from quizs where quizID='"+req.body.quizID+"'", function(err,  rows, fields) {
      if (!err)
      {
        if(rows[0].answer==req.body.answer)
        {
            console.log('Correct Answer');
            res.send("correct")
        }
        else
        {
            console.log('wrong answer');
            res.send("wrong")
        }
      }
      else
        console.log('Error while performing Select quiz Query.', err);
    });
  };

  exports.updateGotAnswer = (req, res) => {
    
    connection.query("UPDATE quizs set gotAnswer ='" +1+"'" +" where quizID='"+ req.body.quizID+"'", function(err,  rows, fields) {
      if (!err)
      {
        console.log('update gotAnswer', rows);
        res.send("update")
      }
      else
        console.log('Error while performing Select quiz Query.', err);
    });
  };
