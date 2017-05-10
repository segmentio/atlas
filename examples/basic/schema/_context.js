module.exports = () => ({
  async getUser () {
    return {
      id: 'user:1',
      name: 'User 1'
    }
  },
  async getPosts (id) {
    return [
      { id: 'post:1', title: 'Post 1' },
      { id: 'post:2', title: 'Post 2' }
    ]
  }
})
