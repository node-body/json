'use strict'

const getStream = require('get-stream')
const createError = require('http-errors')

module.exports = function getJsonBody (req) {
  return getStream(req).then((source) => {
    try {
      return JSON.parse(source)
    } catch (err) {
      throw createError(400, err.message, { stack: err.stack, code: 'INVALID_JSON' })
    }
  })
}
