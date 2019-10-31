

const environments = {
    development: {
      host: process.env.MYSQL.host,
      user: process.env.MYSQL.user,
      password: process.env.MYSQL.password,
      database: process.env.MYSQL.password
    }
  }

  const nodeEnv = 'development';

module.exports = environments[nodeEnv];