module.exports.typeDef = `
  type Query {
    me: User!
  }
`

module.exports.Query = {
  me: async (user, params, ctx) => ctx.getUser()
}
