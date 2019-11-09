var WebSocketServer = require('ws')
const DBConnector = require('../db/DBConnector');

module.exports = class WSConnector {

    static async connect(){
        this.WSS = new WebSocketServer.Server({port: 3250})
        await this.defaultData()
    }

    static async defaultData(){
        this.WSS.on("connection", async (ws,req)=>{
            
            const latestQuizID = await DBConnector.getLastestQuizID()
            var data = {}
            var result
            ;result = await DBConnector.getOneQuiz20Comments(latestQuizID)
            data.comments = result

            ;result = await DBConnector.getOneQuiz(latestQuizID)

            data.quiz = result[0]
            
            ws.send(JSON.stringify(data))
        })
    }

    static async commentsBroadcast(data){
        if(!this.WSS){
            await this.connect()
        }
        this.WSS.clients.forEach((client)=>{
            if(client.readyState == WebSocketServer.OPEN){
                client.send(JSON.stringify({comments:data}))
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
