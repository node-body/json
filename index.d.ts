/// <reference types="node" />

import { IncomingMessage } from 'http'

declare namespace getJsonBody {
  interface Options {
    inflate?: boolean
  }
}

declare function getJsonBody (req: IncomingMessage, options?: getJsonBody.Options): Promise<any>

export = getJsonBody
