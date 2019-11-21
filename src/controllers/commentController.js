const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

exports.create = async (req, res) => {
    const axios = require('axios');

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var dateTime = date + ' ' + time;

    var nickname = await DBConnector.getNickname(ip)
    if(nickname.length==0){
      const result = await axios.get('http://rng.api.quizlunch.com/new');
      nickname = result.data
      await DBConnector.insertNickname(ip,nickname)
    }   
    else{
      nickname = nickname[0].nickname
    }

    var comment = {
      'quizID':req.body.quizID,
      'nickname':nickname,
      'password':req.body.password,
      'text':req.body.text,
      'ip':ip,
      'time':dateTime 
    }
    await DBConnector.insertComment(comment)
    WSConnector.broadcast('insert comment', comment)
    res.send(200)
  };


exports.delete = async (req, res) => {

    const password =  await DBConnector.getPassword(req.body.commentID)

    if(password[0].password==req.body.password)
    {
        await DBConnector.deleteComment(req.body.commentID)
        const comment = await DBConnector.getComments(req.body.quizID)  
        WSConnector.broadcast('delete comment', req.body.commentID)
    }
    else 
    {
        res.send(200,'wrong password');
    }
};


  
    

  