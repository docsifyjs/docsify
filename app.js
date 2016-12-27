const fs = require('fs')
const path = require('path')

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static('public'))

/**
 * Viewing Password feature has been added.
 * Set 'keepItSecret' to true to enable this feature.
 * By LancerComet at 16:31, 2016.12.27.
 */

/**
 * App Configuration.
 */
const keepItSecret = true   // Visitors need to provide correct password if it is set to true.
const password = 'test'     // Password.
const sessionPool = []      // Session Storage.

/**
 * Server Configuration.
 */
const port = 3000           // Port.
const hostname = '0.0.0.0'  // Hostname.

/**
 * Create Static Server.
 */
app.listen(port, hostname)

/**
 * Index Controller.
 */
app.get('/', function (req, res, next) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  if (keepItSecret) {
    // Check Session in Cookie.
    const sessionID = req.cookies.session
    !sessionID || !checkSession(sessionID)
      ? renderPassword(res)
      : renderIndex(res)
  } else {
    renderIndex(res)
  }
})

/**
 * Password Controller.
 */
app.post('/password', function (req, res, next) {
  const password = req.body.value
  if (comparePassword(password)) {
    // Password is correct.
    const sessionID = addNewSession()
    res.cookie('session', sessionID, {
      maxAge: 1000 * 60 * 60,
      httpOnly: true
    })
    res.redirect('/')
  } else {
    res.status(400).json({
      status: 400,
      msg: 'Password is incorrect.'
    })
  }
})

/**
 * Logout Controller.
 */
app.get('/logout', function (req, res, next) {
  const sessionID = req.cookies.sessionID
  const index = sessionPool.indexOf(sessionID)
  if (index > -1) sessionPool.splice(index, 1)
  res.cookie('session', null)
  res.redirect('/')
})


/**
 * Sign new session id.
 *
 * @returns {string}
 */
function addNewSession () {
  const sessionID = Math.floor(Math.random() * 10000 * Date.now()).toString(16)
  sessionPool.push(sessionID)
  return sessionID
}

/**
 * Check if we have this session.
 *
 * @returns {boolean}
 */
function checkSession (sessionID) {
  return sessionPool.indexOf(sessionID) > -1
}

/**
 * Render index and send it to client.
 */
function renderIndex (res) {
  res.end(fs.readFileSync(path.resolve(__dirname, './templates/dev.index.html')))
}

/**
 * Render password providing page and send it to client.
 */
function renderPassword (res) {
  res.end(fs.readFileSync(path.resolve(__dirname, './templates/dev.password.html')))
}

/**
 * Compare password.
 *
 * @returns {boolean}
 */
function comparePassword (passwordByUser) {
  return passwordByUser === password
}

console.log(`\nListening at http://${hostname}:${port}\n`)
