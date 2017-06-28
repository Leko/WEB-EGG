// @flow
import type PostList from '../../domain/PostList'

export default class AdapterBase {
  async find (keyword: string): Promise<PostList> {
    return Promise.reject(new Error('Must be implemented'))
  }
}
