// @flow
import type { DispatcherPayload } from "almin";
import type Post from "../domain/Post";
import type PostList from "../domain/PostList";
import FilterPostListUseCase from "../usecase/FilterPostListUseCase";

export default class PostState {
  posts: PostList;

  /**
   * @param {PostList} posts
   * @param {string} keyword
   */
  constructor({ posts }: { posts: PostList } = {}) {
    this.posts = posts;
  }

  /**
   * @param {DispatcherPayload} payload
   * @returns {PostState}
   */
  reduce(payload: DispatcherPayload): PostState {
    switch (payload.type) {
      case FilterPostListUseCase.name:
        const { posts } = payload;
        return new PostState({ posts });
      default:
        return this;
    }
  }
}
