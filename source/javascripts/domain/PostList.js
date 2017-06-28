// @flow
import type Post from './Post'

export default class PostList {
  posts: Array<Post>

  constructor () {
    this.posts = []
  }

  append (post: Post): this {
    this.posts.push(post)
    return this
  }

  getAllPosts () {
    return this.posts
  }
}
