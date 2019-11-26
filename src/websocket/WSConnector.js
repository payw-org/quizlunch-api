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
            const todayQuizID = this.currentQuizID = await DBConnector.getTodayQuizID()
            data['renew comments'] = await DBConnector.getComments(todayQuizID)
            data['renew quiz'] = await DBConnector.getQuiz(todayQuizID)
            data['renew money'] = await DBConnector.getMoney(todayQuizID)

            ws.send(JSON.stringify(data))
        })
    }

    static setCurrentQuizID(quizID){
        this.currentQuizID = quizID
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
