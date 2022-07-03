/** */
require('dotenv').config()
const {
  NODE_ENV
} = process.env

const config = {
  development: {
    app_db_uri: 'mongodb://127.0.0.1:27017/gm_template',
    app_port: 9000
  },
  staging: {
    app_db_uri: '',
    app_port: 9000
  },
  production: {
    app_db_uri: '',
    app_port: 9000
  }
}

module.exports = {
  ...config[NODE_ENV || 'development']
}
