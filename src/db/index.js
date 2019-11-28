const DBConnector = require('../apps/DBConnector')

module.exports = class DB{

    static async query(query, values = null){
        var result
        if(!this.conn)
            this.conn = await DBConnector.getConnection()

        try{
            if(values !== null){
                ;[result] = await this.conn.query(query,values)
            }
            else{
                ;[result] = await this.conn.query(query)
            }
            return result            
        }catch(e){
            console.log(e)
            console.log(query)
            console.log(values)
        }
    }
}