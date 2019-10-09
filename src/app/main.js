import DBServiceProvider from 'Providers/DBServiceProvider'
import RouteServiceProvider from 'Providers/RouteServiceProvider'

/**
 * Boot quizlunch-api app.
 */
async function bootApp(){
    const dbProvider = new DBServiceProvider()
    const routeProvider = new RouteServiceProvider()
  
    // boot all service provider after database is set
    await dbProvider.boot()
    const app = routeProvider.boot()
    app.listen(process.env.APP_PORT)
  }
  
  bootApp().then()