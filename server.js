/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const path = require('path')
require("dotenv").config()
const express = require("express")
const expresslayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const utilities = require("./utilities")
const static = require("./routes/static")
const inventory = require("./routes/inventory")
const baseController = require("./controllers/baseController")

/* ***********************
 * View Engine and Templates 
 *************************/

app.set("view engine", "ejs")
app.set("layout", "./layouts/layout")
app.use(express.static('public'))


/* ***********************
 * Routes
 *************************/
app.use(expresslayouts)
app.use(static)


//Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventory)
app.use('/error', require('./routes/errorRoutes'))
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})
app.use((err, req, res, next) => {
  console.error('💥 ERROR:', err.stack)
  res.status(500).render('500', {message: err.message})
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`) 
})
