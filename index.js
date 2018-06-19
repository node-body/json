const createError = require('http-errors')
const getStream = require('get-stream')
const pTry = require('p-try')

const getBodyStream = require('@body/stream')

function parseJson (source) {
  try {
    return JSON.parse(source)
  } catch (err) {
    throw createError(400, err.message, { stack: err.stack, code: 'INVALID_JSON' })
  }
}

module.exports = function getJsonBody (req, options = {}) {
  return pTry(getBodyStream, req, { inflate: options.inflate }).then(getStream).then(parseJson)
}
