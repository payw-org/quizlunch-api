var WebSocketServer = require('ws')
const DBQuizs = require('../db/DBQuizs');
const DBComments = require('../db/DBComments');

module.exports = class WSConnector {

    static async connect(){
        this.WSS = new WebSocketServer.Server({port: 3250})
        await this.defaultData()
    }

    static async defaultData(){
        this.WSS.on("connection", async (ws,req)=>{
            var data = {}
            var result

            // get today quizID
            var today = new Date()
            if(today.getHours() < 12)
                today.setDate(today.getDate()-1)
            var YYYY = today.getFullYear()
            var MM = ('0'+(today.getMonth()+1)).slice(-2)
            var DD = ('0'+(today.getDate())).slice(-2)
            var YYYYMMDD = `${YYYY}-${MM}-${DD}`
            result = await DBQuizs.getIDByTime(YYYYMMDD)
            var todayQuizID =  result[0].quizID

            // get today quiz
            result = DBQuizs.getQuizByID(quizID)
            if(result[0].money === 0){ // Not solved quiz
                var quizStartAt = new Date()
                if(quizStartAt.getHours() < 12)
                    quizStartAt.setDay(quizStartAt.getDate()-1)
                quizStartAt.setHours(12)
                quizStartAt.setMinutes(0)
                quizStartAt.setSeconds(0)
                result[0].money = Math.floor((Date.now()-quizStartAt)/1000/20)
            }
            data['renew quiz'] = result[0]

            // get today comments
            result = await DBComments.getCommentsByQuizID(todayQuizID)
            data['renew comments'] = result

            // send
            ws.send(JSON.stringify(data))
        })
    }

    static async broadcast(key, value){
        if(!this.WSS){
            await this.connect()
        }
        var data = {}
        data[key] = value
        this.WSS.clients.forEach((client)=>{
            if(client.readyState == WebSocketServer.OPEN){
                client.send(JSON.stringify(data))
            }
        })
    }
}
