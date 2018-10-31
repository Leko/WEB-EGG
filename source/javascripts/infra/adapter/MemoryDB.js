// @flow
import type { PostPayload } from "../../domain/Post";
import fetch from "isomorphic-fetch";
import filter from "lodash/filter";
import Base from "./Base";
import PostList from "../../domain/PostList";
import Post from "../../domain/Post";

export default class MemoryDB extends Base {
  async find(keyword: string): Promise<PostList> {
    const res = await fetch("/posts.json");
    const rawPosts: Array<PostPayload> = await res.json();
    const matched: Array<PostPayload> = filter(
      rawPosts,
      (post): boolean => {
        return post.title.toLowerCase().includes(keyword);
      }
    );

    return matched.reduce((list: PostList, post: PostPayload) => {
      return list.append(new Post(post));
    }, new PostList());
  }
}
