require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = 3200;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/quiz',require('./routes/quiz'))

app.use('/winner',require('./routes/winner'))

app.use('/comment',require('./routes/comment'))

;(async ()=>{
  const DBConnector = require('./db/DBConnector')
  const conn = await DBConnector.getConnection()
  const [ result ] = await conn.query('SELECT * FROM comments')
  console.log(result)
})()



app.listen(port, () => {
  console.log('Example app listening on port ' + port);
})

  