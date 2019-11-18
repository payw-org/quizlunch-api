var WebSocketServer = require('ws')
const DBConnector = require('../db/DBConnector');

module.exports = class WSConnector {

    static async connect(){
        this.WSS = new WebSocketServer.Server({port: 3250})
        await this.defaultData()
    }

    static async defaultData(){
        this.WSS.on("connection", async (ws,req)=>{
            var data = {}
            const latestQuizID = await DBConnector.getLastestQuizID()
            data.comments = await DBConnector.getComments(latestQuizID)
            data.quiz = await DBConnector.getQuiz(latestQuizID)
            data.money = await DBConnector.getMoney(latestQuizID)

            ws.send(JSON.stringify(data))
            const infiniteSend = setInterval((currentQuizID)=>{
                data = {}
                data.money = await DBConnector.getMoney(currentQuizID)
                ws.send(JSON.stringify(data))
            },1000,latestQuizID)
        })
    }

    static async commentBroadcast(data){
        if(!this.WSS){
            await this.connect()
        }
        this.WSS.clients.forEach((client)=>{
            if(client.readyState == WebSocketServer.OPEN){
                client.send(JSON.stringify({comment:data}))
            }
        })
    }

    static async quizBroadcast(data){
        if(!this.WSS){
            await this.connect()
        }
        this.WSS.clients.forEach((client)=>{
            if(client.readyState == WebSocketServer.OPEN){
                client.send(JSON.stringify({quiz:data}))
            }
        })
    }
}
