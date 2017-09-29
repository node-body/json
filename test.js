/* eslint-env mocha */

'use strict'

const assert = require('assert')
const assertRejects = require('assert-rejects')
const errorHandler = require('api-error-handler')
const express = require('express')
const got = require('got')

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

  it('should give proper errors', () => {
    return assertRejects(
      got('http://localhost:26934/', { body: '{ ' }),
      (err) => (err.statusCode === 400 && JSON.parse(err.response.body).code === 'INVALID_JSON')
    )
  })
})
