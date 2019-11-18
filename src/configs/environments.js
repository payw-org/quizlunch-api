

const environments = {
    development: {
      host: process.env.MYSQL_host,
      user: process.env.MYSQL_user,
      password: process.env.MYSQL_password,
      database: process.env.MYSQL_database
    }
  }

const nodeEnv = 'development';

module.exports = environments[nodeEnv];