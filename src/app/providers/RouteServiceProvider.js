
// import bodyParser from 'body-parser'
// import express, { Express } from 'express'
// import router from 'Routes/api'
const express = require("express");


class RouteServiceProvider {
  

    // basicMiddleware = [
    //     helmet(),
    //     cors(),
    //     bodyParser.json(),
    //     bodyParser.urlencoded({ extended: true })
        
    //   ]


    constructor() {
        this.app = express()
    }

    


  boot(){

    this.app.use("/",require("../http/routes/api"))
    return this.app
  }
}
module.exports=RouteServiceProvider;