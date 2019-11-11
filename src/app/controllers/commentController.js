const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

exports.create = async (req, res) => {
    const axios = require('axios');


    var today = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
    today = new Date(today);
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;

    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    
    var nickname = await DBConnector.getNickname(ip)
    if(nickname.length==0){
      const result = await axios.get('http://rng.api.quizlunch.com/new');
      await DBConnector.insertNickname(ip,nickname)
      nickname = result.data
    }   
    else if(nickname[0].nickname==""){
      const result = await axios.get('http://rng.api.quizlunch.com/new');
      await DBConnector.updateNickname(ip,nickname)
      nickname = result.data
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
    console.log(comment)
    await DBConnector.insertComment(comment)
    WSConnector.commentBroadcast(comment)

  };


exports.delete = async (req, res) => {

    const password =  await DBConnector.getPassword(req.body.commentID)

    if(password[0].password==req.body.password)
    {
        await DBConnector.deleteComment(req.body.commentID)
        const comments = await DBConnector.getComments(req.body.quizID)  
        WSConnector.commentBroadcast(comments)
    }
    else 
    {
        res.send(200,'wrong password');
    }
};


  
    

  