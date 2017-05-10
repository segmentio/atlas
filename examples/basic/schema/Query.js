module.exports.typeDef = `
  type Query {
    me: User!
  }
`

module.exports.me = async (user, params, ctx) => ctx.getUser()
