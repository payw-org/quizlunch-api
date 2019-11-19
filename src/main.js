require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = 3200;

const WSConnector = require('./websocket/WSConnector')
const MYSceduler = require('./apps/scheduler')

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
MYSceduler.run()