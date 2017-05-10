module.exports.typeDef = `
  type User {
    id: String!
    name: String!
    posts: [Post!]
  }
`

module.exports.posts = async (user, params, ctx) => ctx.getPosts(user.id)
