// @flow
import type PostList from "../domain/PostList";
import { UseCase } from "almin";
import postListRepository from "../infra/PostListRepository";

export class FilterPostListUseCaseFactory extends UseCase {
  static create() {
    return new FilterPostListUseCase();
  }
}

/**
 * Actor: {TODO}
 * Purpose: {TODO}
 */
export default class FilterPostListUseCase extends UseCase {
  execute(keyword: string) {
    return postListRepository.find(keyword).then(
      (posts: PostList): void => {
        this.dispatch({ type: FilterPostListUseCase.name, posts });
      }
    );
  }
}
