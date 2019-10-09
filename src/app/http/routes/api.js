
const express = require('express');


const testRouter = require('./test');

const router = express.Router()

router.use('/test',testRouter)

module.exports =router