var WebSocketServer = require('ws')
const DBConnector = require('../db/DBConnector');

module.exports = class WSConnector {

    static async connect(){
        const connection = await DBConnector.getConnection()
        const [result] = await connection.query("SELECT * from comments where quizID='1'")

        for(var i=0;i<result.length;i++)
        {
          delete result[i].password;
          result[i].ip=result[i].ip.substring(0,7)
        }
        
        this.WSS = new WebSocketServer.Server({port: 3250})
        this.WSS.on("connection", (ws)=>{
            ws.send(JSON.stringify(result))
        })
        
    }

    static async broadcast(data){
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