const serveStatic = require('serve-static')
const http = require('http')
const fs = require('fs')
const path = require('path')
const setCookie = require('set-cookie-parser')

/**
 * App Configuration.
 */
const keepItSecret = true   // Visitors need to provide correct password if it is set to true.
const password = 'test'     // Password.
const sessionPool = []      // Session Storage. Empty every 30 mins.

/**
 * Server Configuration.
 */
const port = 3000           // Port.
const hostname = '0.0.0.0'  // Hostname.

/**
 * Create Static Server.
 */
http.createServer(startStaticServer).listen(port, hostname)

/**
 * Setup Static Server.
 *
 * @return void
 */
function startStaticServer (req, res) {
  /**
   * Index controller.
   */
  serveStatic('/')(req, res, function () {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    if (keepItSecret) {
      // Check Session in Cookie.
      const sessionID = getSessionFromCookie(req.headers.cookie)
      !sessionID || !checkSession(sessionID)
        ? renderPassword(res)
        : renderIndex(res)
    } else {
      renderIndex(res)
    }
  })

  /**
   * Password submitting controller.
   */
  serveStatic('/password')(req, res, function () {
    const url = req.url  // localhost:3000/password?value=xxx
    const matching = url.match(/value=[^&]+/)

    // Chcek password and set cookie.
    if (matching) {
      const value = matching[0].substring(6)

      if (comparePassword(value)) {
        // Password is correct.
        const sessionID = addNewSession()
        setCookie.parse(res, {
          name: 'session',
          value: sessionID
        })

        // TODO: redirect to index.
      } else {
        // Password is wrong.
        // TODO: send wrong information.
      }
    }
  })
}

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

// TODO: getSessionFromCookie.
function getSessionFromCookie (cookieStr) {

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
