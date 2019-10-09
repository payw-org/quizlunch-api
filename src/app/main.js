
// import DBServiceProvider from 'Providers/DBServiceProvider'

/**
 * Boot quizlunch-api app.
 */
async function bootApp(){
    // const dbProvider = new DBServiceProvider()
    
    const RouteServiceProvider=require("./providers/RouteServiceProvider")
    const routeProvider = new RouteServiceProvider()
  
    // boot all service provider after database is set
    // await dbProvider.boot()
    const app = routeProvider.boot()
    app.listen(3000)
  }
  
  bootApp().then()
