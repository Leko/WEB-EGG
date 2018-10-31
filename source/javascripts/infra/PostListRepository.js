// @flow
import type AdapterBase from "./adapter/Base";
import EventEmitter from "events";
import PostList from "../domain/PostList";
import Algolia from "./adapter/Algolia";
import MemoryDB from "./adapter/MemoryDB";

const REPOSITORY_CHANGE = "REPOSITORY_CHANGE";

export class PostListRepository extends EventEmitter {
  adapter: AdapterBase;

  constructor(database: AdapterBase = new Algolia()) {
    super();
    this.adapter = database;
  }

  find(keyword: string): Promise<PostList> {
    return this.adapter.find(keyword);
  }
}

// singleton
export default new PostListRepository();
