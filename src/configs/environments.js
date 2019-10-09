const environments = {
    development: {
      host: 'localhost',
      user: 'root',
      password: 'PASSWORD',
      database: 'my_db'
    },
  
    test: {
      host: 'localhost',
      user: 'root',
      password: 'PASSWORD',
      database: 'my_db'
    },
  
    production: {
  
    }
  }

const nodeEnv = process.env.NODE_ENV || 'development';

module.exports = environments[nodeEnv];