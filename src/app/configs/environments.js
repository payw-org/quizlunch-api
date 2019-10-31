const environments = {
    development: {
      host: 'localhost',
      user: 'root',
      password: 'PASSWORD',
      database: 'my_db'
    }
  }

  const nodeEnv = 'development';

module.exports = environments[nodeEnv];