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
    $ atlas --port 8000
`, {
  alias: {
    p: 'port'
  }
})

const dir = path.resolve(process.cwd(), 'schema')
const port = cli.flags.port || 3000
const config = require(path.resolve(process.cwd(), 'package.json')).atlas
const options = Object.assign({}, config, { dir })

atlas(options)
  .start(port)
  .then(async () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
  .catch((err) => {
    console.error(err)
    process.nextTick(() => process.exit(1))
  })
