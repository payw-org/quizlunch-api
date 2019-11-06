const DBConnector = require('../db/DBConnector');


exports.getOneQuizComments = async (req, res) => {
  const connection = await DBConnector.getConnection()
  const [result] = await connection.query("SELECT * from comments where quizID='"+req.params['quizID']+"'")

  for(var i=0;i<result.length;i++)
  {
    result[i].ip=result[i].ip.substring(0,7)
  }

  res.send(result)
};

  
exports.create = async (req, res) => {
    const connection = await DBConnector.getConnection()
    const axios = require('axios');

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var dateTime = date + ' ' + time;

    var nickname = await connection.query("SELECT nickname from nicknames where ip='"+ip+"'")
    if(nickname.length==0)
    {
      nickname = await axios.get('http://rng.api.quizlunch.com/new');
    } 
    else
    {
      nickname=nickname[0].nickname
    }

    var comment = {
                'quizID':req.body.quizID,
                'nickname':nickname,
                'password':req.body.password,
                'text':req.body.text,
                'ip':ip,
                'time':dateTime 
            };
 
    const [result] = await connection.query("insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES ('"+ comment.quizID + "', '" + comment.nickname + "', '" + comment.password+ "', '" + comment.text+ "', '" + comment.ip+ "', '" + comment.time+ "') ")

    res.send(result)
};


exports.delete = async (req, res) => {

  const connection = await DBConnector.getConnection()

    const [result1] =  await connection.query("SELECT password from comments where commentID='"+req.body.commentID+"'")
    if(result1[0].password==req.body.password)
    {
        const [result2] =  await connection.query("DELETE FROM comments WHERE commentID ='"+req.body.commentID+"'")
        res.send(200,'delete');
    }
    else 
    {
        res.send(200,'wrong password');
    }
};


      

    //   const [result] = await connection.query("DELETE FROM comments WHERE commentID in (SELECT commentID from comments where commentID='"+req.body.commentID+"' and password='"+req.body.password+"')", function(err,  rows, fields) {
    //   if (!err)
    //   {
    //     res.send(result)
    //   }
    //   else
    //     console.log('Error while performing Select comments password Query.', err);
    // });


    

  