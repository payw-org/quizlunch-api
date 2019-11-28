require('dotenv').config()
const express = require('express');
const router = require('./routes')
const app = express();
const port = 3200;

const bodyParser = require('body-parser')
const CORS = require('cors')();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(CORS);
app.use('/', router)

app.listen(port, () => {
  console.log(`Now listen ${port} port.`);
})

const WSConnector = require('./websocket/WSConnector')
const MYSceduler = require('./apps/scheduler')

WSConnector.connect()
MYSceduler.run()
