require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const WSConnector = require('./websocket/WSConnector')
const port = 3200;

// solve cors problem
const CORS = require('cors')();
app.use(CORS);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/quiz',require('./routes/quiz'))

app.use('/winner',require('./routes/winner'))

app.use('/comment',require('./routes/comment'))

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
})

WSConnector.connect()


var money=1000;

setInterval(moneyIncrease(money), 3000);

function moneyIncrease(money) {
  money=money+1;
  console.log(money)
  WSConnector.moneyBroadcast(money)
}