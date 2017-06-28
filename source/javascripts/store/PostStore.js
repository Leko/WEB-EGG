// @flow
import type { DispatcherPayload } from 'almin'
import type { PostListRepository } from '../infra/PostListRepository'
import { Store } from 'almin'
import PostState from './PostState'
import PostList from '../domain/PostList'
import FilterPostListUseCase from '../usecase/FilterPostListUseCase'

export default class PostStore extends Store {
  state: PostState
  postListRepository: PostListRepository

  constructor ({ postListRepository }: { postListRepository: PostListRepository }) {
    super()
    this.state = new PostState({
      posts: new PostList()
    })
    this.postListRepository = postListRepository
  }

  receivePayload (payload: DispatcherPayload) {
    const { type } = payload
    switch (type) {
      case FilterPostListUseCase.name:
        const newState = this.state.reduce(payload)
        this.setState(newState)
    }
  }

  getState () {
    return this.state
  }
}
