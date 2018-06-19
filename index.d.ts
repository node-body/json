/// <reference types="node" />

import { IncomingMessage } from 'http'

declare namespace getJsonBody {
  interface Options {
    inflate?: boolean
    strict?: boolean
  }
}

declare function getJsonBody (req: IncomingMessage): Promise<object>
declare function getJsonBody (req: IncomingMessage, options: getJsonBody.Options & { strict?: true }): Promise<object>
declare function getJsonBody (req: IncomingMessage, options: getJsonBody.Options & { strict: false }): Promise<object | string | number | boolean | null>

export = getJsonBody
