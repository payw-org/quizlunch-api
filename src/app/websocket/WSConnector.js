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

            ws.send(JSON.stringify(data))
        })
    }

    static async currentPage(){
        this.WSS.on("currentPage", async (ws,req)=>{
            var data = {}
            data.comments = await DBConnector.getComments(ws.quiz)
            data.quiz = await DBConnector.getQuiz(ws.quiz)

            ws.send(JSON.stringify(data))
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


    static async moneyBroadcast(data){
        if(!this.WSS){
            await this.connect()
        }
        this.WSS.clients.forEach((client)=>{
            if(client.readyState == WebSocketServer.OPEN){
                client.send(JSON.stringify(data))
            }
        })
    }


}
