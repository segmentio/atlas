const { parse, Kind } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')

module.exports = async (paths, scalars) => {
  let typeDefs = ''
  const resolvers = Object.assign({}, scalars)

  for (const path of paths) {
    const type = require(path)

    for (const key of Object.keys(type)) {
      const value = type[key]

      if (typeof value === 'object') {
        Object.assign(resolvers, { [key]: value })
      } else if (typeof value === 'string') {
        typeDefs += value
      }
    }
  }

  typeDefs += `
    schema {
      ${resolvers.Query ? 'query: Query' : ''}
      ${resolvers.Mutation ? 'mutation: Mutation' : ''}
    }
  `

  return makeExecutableSchema({ typeDefs, resolvers })
}
