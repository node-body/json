const createError = require('http-errors')
const getStream = require('get-stream')
const pTry = require('p-try')

const getBodyStream = require('@body/stream')

/**
 * RegExp to match the first non-space in a string.
 *
 * Allowed whitespace is defined in RFC 7159:
 *
 *    ws = *(
 *            %x20 /              ; Space
 *            %x09 /              ; Horizontal tab
 *            %x0A /              ; Line feed or New line
 *            %x0D )              ; Carriage return
 */

// eslint-disable-next-line no-control-regex
const reFirstChar = /[^\x20\x09\x0a\x0d]/

function parseJsonStrictly (source) {
  const match = reFirstChar.exec(source)

  if (match === null) {
    const { message, stack } = new SyntaxError(`Unexpected end of JSON input`)
    throw createError(400, message, { stack: stack, code: 'INVALID_JSON' })
  }

  if (match[0] !== '{' && match[0] !== '[') {
    const { message, stack } = new SyntaxError(`Unexpected token ${match[0]} in JSON at position ${match.index}`)
    throw createError(400, message, { stack: stack, code: 'INVALID_JSON' })
  }

  return parseJson(source)
}

function parseJson (source) {
  try {
    return JSON.parse(source)
  } catch (err) {
    throw createError(400, err.message, { stack: err.stack, code: 'INVALID_JSON' })
  }
}

module.exports = function getJsonBody (req, options = {}) {
  const parser = (options.strict === false ? parseJson : parseJsonStrictly)

  return pTry(getBodyStream, req, { inflate: options.inflate }).then(getStream).then(parser)
}
