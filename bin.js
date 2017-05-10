#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const meow = require('meow')
const atlas = require('./')

const cli = meow(`
  Usage
    $ atlas

  Options
    --port, p Server port [default: 3000]

  Examples
    $ atlas
    $ atlas --port 3000
`, {
  alias: {
    p: 'port'
  }
})

const dir = path.resolve(process.cwd(), 'schema')
const port = cli.flags.port || 3000

atlas({ dir })
  .start(port)
  .then(async () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
  .catch((err) => {
    console.error(err)
    process.nextTick(() => process.exit(1))
  })
