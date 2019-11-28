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
            var todayQuizID = await DBQuizs.getIDByTime()
            data['renew quiz'] = await DBQuizs.getQuizByID(todayQuizID)
            data['renew comments'] = await DBComments.getCommentsByQuizID(todayQuizID)
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
