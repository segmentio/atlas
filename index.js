const { existsSync } = require('fs')
const url = require('url')
const path = require('path')
const micro = require('micro')
const globby = require('globby')
const { microGraphql, microGraphiql } = require('graphql-server-micro')
const parser = require('./lib/parser')

module.exports = (options) => {
  return new Server(options)
}

class Server {
  constructor ({ dir, graphiql = true }) {
    this.dir = dir
    this.graphiql = graphiql
    this.getContext = loadModule(`${this.dir}/_context.js`)
    this.getScalars = loadModule(`${this.dir}/_scalars.js`)
  }

  async start (port) {
    this.http = micro(await this.getRequestHandler())
    return new Promise((resolve, reject) => {
      this.http.on('error', reject)
      this.http.on('listening', () => resolve())
      this.http.listen(port)
    })
  }

  async getRequestHandler () {
    const schema = await this.getSchema()
    return async (req, res) => {
      if (this.graphiql) {
        const { pathname } = url.parse(req.url)

        if (req.method === 'GET' && pathname === '/graphiql') {
          return microGraphiql({})(req, res)
        }
      }

      const context = await this.getContext(req, res)
      return microGraphql({ schema, context })(req, res)
    }
  }

  async getSchema () {
    const scalars = await this.getScalars()
    return globby(`${this.dir}/!(_*).js`).then(paths => {
      return parser(paths, scalars)
    })
  }
}

const loadModule = (path) => {
  if (existsSync(path)) {
    const module = require(path)
    return async (...args) => {
      return typeof module === 'function'
        ? module(...args)
        : module
    }
  }

  return () => Promise.resolve()
}
