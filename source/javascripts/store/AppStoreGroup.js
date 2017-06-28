// @flow
import { StoreGroup } from 'almin'
import PostStore from './PostStore'
import postListRepository from '../infra/PostListRepository'

export default class AppStoreGroup {
  static create() {
    return new StoreGroup({
      postState: new PostStore({ postListRepository })
    })
  }
}
