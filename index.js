'use strict'

const getStream = require('get-stream')
const createError = require('http-errors')

const getBodyStream = require('@body/stream')

function parseJson (source) {
  try {
    return JSON.parse(source)
  } catch (err) {
    throw createError(400, err.message, { stack: err.stack, code: 'INVALID_JSON' })
  }
}

module.exports = function getJsonBody (req, options) {
  options = options || {}

  return Promise.resolve()
    .then(() => getBodyStream(req, { inflate: options.inflate }))
    .then((bodyStream) => getStream(bodyStream))
    .then((source) => parseJson(source))
}
