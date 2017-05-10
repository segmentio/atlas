const { existsSync } = require('fs')
const path = require('path')
const micro = require('micro')
const globby = require('globby')
const { parse, Kind } = require('graphql')
const { microGraphql } = require('graphql-server-micro')
const { makeExecutableSchema } = require('graphql-tools')

module.exports = (opts) => {
  return new Server(opts)
}

class Server {
  constructor ({ dir }) {
    this.dir = dir
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
      const context = await this.getContext(req, res)
      return microGraphql({ schema, context })(req, res)
    }
  }

  async getSchema () {
    let typeDefs = ''
    const resolvers = {}

    return globby(`${this.dir}/!(_*).js`).then(paths => {
      for (const path of paths) {
        const type = require(path)
        typeDefs += type.typeDef

        const ast = parse(type.typeDef)
        const objectTypeDef = ast.definitions
          .find((def) => def.kind === Kind.OBJECT_TYPE_DEFINITION)

        if (objectTypeDef) {
          const name = objectTypeDef.name.value
          resolvers[name] = {}
          Object.keys(type).forEach(field => {
            if (field !== 'typeDef') {
              resolvers[name][field] = type[field]
            }
          })
        }
      }

      typeDefs += `
        schema {
          ${resolvers.Query ? 'query: Query' : ''}
          ${resolvers.Mutation ? 'mutation: Mutation' : ''}
        }
      `

      return makeExecutableSchema({ typeDefs, resolvers })
    })
  }

  async getContext (req, res) {
    const path = `${this.dir}/_context.js`
    if (existsSync(path)) {
      const getContext = require(path)
      return await getContext(req, res)
    }
  }
}
