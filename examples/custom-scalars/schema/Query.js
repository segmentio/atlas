module.exports.typeDef = `
  type Query {
    posts: [Post]!
  }
`

module.exports.Query = {
  posts: async (_, params, ctx) => ctx.getPosts()
}
