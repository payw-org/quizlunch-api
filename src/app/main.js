import mysql from 'mysql'
import connectionConfig from '../configs/environments'

var connection = mysql.createConnection(connectionConfig)

connection.connect((err)=>{
    console.log(err)
})

