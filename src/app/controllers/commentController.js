const DBConnector = require('../db/DBConnector');
// const WSConnector = require('../websocket/WSConnector');

exports.getOneQuizComments = async (req, res) => {

  // ws.on("getComment", async function(quizID){

    const comments = await DBConnector.getOneQuiz20Comments(quizID)
    res.send(JSON.stringify(comments))

  // });
  
};

  
exports.create = async (ws, req) => {

  ws.on("creatComment",function(data){

  const axios = require('axios');

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var dateTime = date + ' ' + time;

    var [nickname] = await DBConnector.findNickname(ip)
    if(nickname.length==0)
    {
      const gotAxios = await axios.get('http://rng.api.quizlunch.com/new');
      nickname = gotAxios.data
      const newNickNameUpdate = await DBConnector.insertNickname(ip,nickname)
    }   
    else
    {
      nickname=nickname[0].nickname
    }

    var comment = {
                'quizID':data.quizID,
                'nickname':nickname,
                'password':data.password,
                'text':data.comment,
                'ip':ip,
                'time':dateTime 
            };
 
    await DBConnector.insertComment(comment)

    const comments = await DBConnector.getOneQuiz20Comments(req.body.quizID)
    ws.send(JSON.stringify(comments))
  });

  };


exports.delete = async (req, res) => {

    const [password] =  await DBConnector.findPassword(req.body.commentID)
    if(password[0].password==req.body.password)
    {
        await DBConnector.deleteComment(req.body.commentID)
        res.send(200,'delete');

        var [result] = await DBConnector.getOneQuiz20Comments(quizID)

        for(var i=0;i<result.length;i++)
        {
          delete result[i].password;
          result[i].ip=result[i].ip.substring(0,7)
        }
        WSConnector.broadcast(result)
        }
    else 
    {
        res.send(200,'wrong password');
    }
};


      




    

  