const DBConnector = require('../db/DBConnector');
const WSConnector = require('../websocket/WSConnector');

exports.create = async (req, res) => {
    const axios = require('axios');

    // nickname
    var nickname = await DBConnector.getNickname(ip)
    if(nickname.length==0){
      const result = await axios.get('http://rng.api.quizlunch.com/new');
      nickname = result.data
      await DBConnector.insertNickname(ip,nickname)
    }   
    else{
      nickname = nickname[0].nickname
    }

    // ip
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;

    // time
    var today = new Date()
    if(today.getHours() < 12)
      today.setDate(today.getDate()+1)
    var YYYY = today.getFullYear()
    var MM = ('0'+(today.getMonth()+1)).slice(-2)
    var DD = ('0'+(today.getDate())).slice(-2)
    var YYYYMMDD = `${YYYY}-${MM}-${DD}`

    var comment = {
      'quizID':req.body.quizID,
      'nickname':nickname,
      'password':req.body.password,
      'text':req.body.text,
      'ip':ip,
      'time':YYYYMMDD 
    }
    comment.commentID = await DBConnector.insertComment(comment)
    delete comment.password;
    WSConnector.broadcast('insert comment', comment)
    res.sendStatus(200)
  };

  exports.more = async (req, res) => {

    console.log(req.query.quizID)
    console.log(req.query.numOfComments)
    await setTimeout(async ()=>{
      const result = await DBConnector.getComments(req.query.quizID, req.query.numOfComments)
      res.send(result)
    },2000)

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


  
    

  