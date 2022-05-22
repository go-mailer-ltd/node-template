/**
 * @author Oguntuberu Nathan O. <nateoguns.work@gmail.com>
**/

/** environment config */
const { app_port } = require('./config')
const { loadEventSystem } = require('./src/events/_loader')
const { connect, loadModels } = require('./src/models/_config')

/** Database Conneciton Setup */
connect()
loadModels()
loadEventSystem()

/** 3rd Party Middlewares */
const compression = require('compression')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const { morgan } = require('./src/utilities/logger')

/** App Initialisation */
const app = express()

/** Middleware Applications */
app.use(cors())
app.use(compression())
app.use(helmet())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
app.use(morgan)

/** Route Middleware */
const route_handler = require('./src/routes/_config')
app.use('/', route_handler)

/** */
app.listen(app_port, () => {
  console.log(`Server started on port ${app_port}`)
})
