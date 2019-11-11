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


var todayMoney=1000;

setInterval(moneyIncrease, 15000);
function moneyIncrease() {
  todayMoney=todayMoney+50;
  console.log(todayMoney)
  WSConnector.moneyBroadcast(todayMoney)
}


module.export = todayMoney