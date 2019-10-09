
const express = require("express");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');



class RouteServiceProvider {
  

    basicMiddleware = [
        helmet(),
        cors(),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true })
        
    ]


    constructor() {
        this.app = express()
    }

    


  boot(){
    this.app.use(this.basicMiddleware)
    this.app.use("/",require("../http/routes/api"))
    return this.app
  }
}
module.exports=RouteServiceProvider;