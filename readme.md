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

### `getJsonBody(req: Request): Promise<any>`

Parse the body of the incoming request `req`. Returns a promise of the parsed body.
