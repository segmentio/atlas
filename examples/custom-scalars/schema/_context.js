module.exports = () => ({
  async getPosts () {
    return [
      { id: 'post:1', title: 'Post 1', metadata: { so: 'meta' } },
      { id: 'post:2', title: 'Post 2', metadata: { so: 'meta' } }
    ]
  }
})
