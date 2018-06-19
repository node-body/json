# JSON body parser

Parse a JSON body of an incoming HTTP request.

## Installation

```sh
npm install --save @body/json
```

## Usage

```js
const getJsonBody = require('@body/json')

// ...

app.post('/v1/users', async (req, res, next) => {
  try {
    const body = await getJsonBody(req)

    // ...
  } catch (err) {
    return next(err)
  }
})

// ...
```

## API

### `getJsonBody(req: Request, options: Options): Promise<any>`

Parse the body of the incoming request `req`. Returns a promise of the parsed body.

#### Options

##### `inflate` (boolean)

When set to `true`, then bodies with a `deflate` or `gzip` content-encoding will be inflated before being parsed.

Defaults to `false`.

##### `strict` (boolean)

When set to `true`, will only accept arrays and objects; when `false` will accept anything `JSON.parse` accepts.

Defaults to `true`.
