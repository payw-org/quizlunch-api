var WebSocketServer = require('ws')
const DBConnector = require('../db/DBConnector');

module.exports = class WSConnector {

    static async connect(){
        this.WSS = new WebSocketServer.Server({port: 3250})
        this.connection = await DBConnector.getConnection()
        await this.defaultData()
    }

    static async defaultData(){
        this.WSS.on("connection", async (ws,req)=>{
            var data = {}
            var result
            ;[result] = await this.connection.query("SELECT * from comments where quizID='1' ORDER BY commentID DESC LIMIT 20")
            for(var i=0;i<result.length;i++)
            {
              delete result[i].password;
              result[i].ip=result[i].ip.substring(0,7)
            }
            data.comments = result

            ;[result] = await this.connection.query("SELECT * from quizs where quizID='1'")
            if(result[0].gotAnswer==0)
            {
              delete result[0].answer;
        
            }
            data.quiz = result[0]
            
            ws.send(JSON.stringify(data))
        })
    }

    static async broadcast(data){
        if(!this.WSS){
            await this.connect()
        }

        this.WSS.clients.forEach((client)=>{
            if(client.readyState == WebSocketServer.OPEN){
                client.send(JSON.stringify({comments:data}))
            }
        })
    }
}