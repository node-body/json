/* eslint-env mocha */

'use strict'

const assert = require('assert')
const assertRejects = require('assert-rejects')
const errorHandler = require('api-error-handler')
const express = require('express')
const got = require('got')
const zlib = require('zlib')

const getJsonBody = require('./')

describe('JSON body parser', () => {
  let app, server

  before((done) => {
    app = express()

    app.post('/', (req, res, next) => {
      getJsonBody(req).then(
        (data) => res.json(data),
        (err) => next(err)
      )
    })

    app.post('/inflate', (req, res, next) => {
      getJsonBody(req, { inflate: true }).then(
        (data) => res.json(data),
        (err) => next(err)
      )
    })

    app.post('/non-strict', (req, res, next) => {
      getJsonBody(req, { strict: false }).then(
        (data) => res.json(data),
        (err) => next(err)
      )
    })

    app.use(errorHandler())

    server = app.listen(26934, () => done())
  })

  after((done) => {
    server.close(done)
  })

  it('should parse json data', () => {
    const body = { a: 1, b: 2 }

    return got('http://localhost:26934/', { json: true, body }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.deepStrictEqual(res.body, body)
    })
  })

  it('should parse json encoded with "gzip"', () => {
    const body = { a: 1, b: 2 }
    const encoded = zlib.gzipSync(JSON.stringify(body))
    const headers = { 'Content-Encoding': 'gzip' }

    return got('http://localhost:26934/inflate', { body: encoded, headers }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.deepStrictEqual(JSON.parse(res.body), body)
    })
  })

  it('should reject invalid json', () => {
    return assertRejects(
      got('http://localhost:26934/', { body: '{ ' }),
      (err) => (err.statusCode === 400 && JSON.parse(err.response.body).code === 'INVALID_JSON')
    )
  })

  it('should reject empty body', () => {
    return assertRejects(
      got('http://localhost:26934/', { body: '' }),
      (err) => (err.statusCode === 400 && JSON.parse(err.response.body).code === 'INVALID_JSON')
    )
  })

  it('should reject "gzip" content-encoding', () => {
    const body = zlib.gzipSync('{ "a": 1 }')
    const headers = { 'Content-Encoding': 'gzip' }

    return assertRejects(
      got('http://localhost:26934/', { body, headers }),
      (err) => (err.statusCode === 415 && JSON.parse(err.response.body).code === 'UNSUPPORTED_ENCODING')
    )
  })

  it('should reject primitive roots', () => {
    return assertRejects(
      got('http://localhost:26934/', { body: '1337' }),
      (err) => (err.statusCode === 400 && JSON.parse(err.response.body).code === 'INVALID_JSON')
    )
  })

  it('should allow primitive roots (non-strict)', () => {
    return got('http://localhost:26934/non-strict', { body: '1337' }).then((res) => {
      assert.strictEqual(res.statusCode, 200)
      assert.deepStrictEqual(res.body, '1337')
    })
  })
})
