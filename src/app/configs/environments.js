const environments = {
    development: {
      mysql: {
        username: 'root',
        password: 'PASSWORD',
        database: 'my_db'
      }
    },
  
    test: {
      mysql: {
        username: 'root',
        password: 'PASSWORD',
        database: 'my_db'
      }
    },
  
    production: {
  
    }
  }

  const nodeEnv = 'development';

module.exports = environments[nodeEnv];