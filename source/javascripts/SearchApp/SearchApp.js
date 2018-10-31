// @flow
import type { Context } from "almin";
import type PostState from "../store/PostState";
import React, { Component } from "react";
import classnames from "classnames";
import debounce from "lodash/debounce";
import padStart from "lodash/padStart";
import Post from "../domain/Post";
import PostList from "../domain/PostList";
import { FilterPostListUseCaseFactory } from "../usecase/FilterPostListUseCase";

type Props = {
  appContext: Context,
  postState: PostState
};
type State = {
  keyword: string,
  cursor: number,
  shown: boolean,
  inComposition: boolean
};

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = padStart(String(date.getMonth()) + 1, 2, "0");
  const day = padStart(String(date.getDate()), 2, "0");

  return `${year}-${month}-${day}`;
}

export default class SearchApp extends Component<Props, State> {
  state: State = {
    keyword: "",
    cursor: -1,
    shown: false,
    inComposition: false
  };

  handleChange = debounce(() => {
    if (this.inComposition) {
      return;
    }

    const keyword = this.refs.search.value;
    this.props.appContext
      .useCase(FilterPostListUseCaseFactory.create())
      .execute(keyword);
    this.setState({ keyword, cursor: 0 });
  }, 200);

  handleKeyPress = (e: KeyboardEvent) => {
    // TODO
  };

  handleClose = () => {
    this.setState({ shown: false });
  };

  handleBlur = () => {
    this.setState({ cursor: -1 });
  };

  handleFocus = () => {
    this.setState({ shown: true, cursor: -1 });
  };

  onCompositionStart = () => {
    this.setState({ inComposition: true });
  };

  onCompositionEnd = () => {
    this.setState({ inComposition: false });
  };

  setCursor(index: number) {
    this.setState({ cursor: index });
  }

  render() {
    return (
      <div className="search">
        <div className="input-group">
          <div className="input-group-addon">
            <i className="fa fa-search" />
          </div>
          <input
            ref="search"
            type="text"
            placeholder="Search"
            className="form-control"
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyPress={this.handleKeyPress}
            onCompositionStart={this.onCompositionStart}
            onCompositionEnd={this.onCompositionEnd}
          />
        </div>
        {this.state.shown && this.state.keyword ? (
          <div className="card">
            <div className="card__header">
              <h3 className="oneline">
                Search result of '{this.state.keyword}'
              </h3>
              <button
                type="button"
                className="btn btn-link search__close"
                onClick={this.handleClose}
              >
                &times;
              </button>
            </div>
            <div className="card__body">
              <ol className="search-result-list">
                {this.props.postState.posts.getAllPosts().map((post, i) => (
                  <li
                    key={post.objectID}
                    tabIndex={-1}
                    onFocus={this.setCursor.bind(this, i)}
                    ref={i === this.state.cursor ? "focusResult" : null}
                    className={classnames("search-result-list__item", {
                      "search-result-list__item--focus": i === this.state.cursor
                    })}
                  >
                    <a href={post.path}>
                      <header>
                        <h4
                          className="search-result-list__item__title"
                          dangerouslySetInnerHTML={{ __html: post.title }}
                        />
                      </header>
                      <div
                        className="search-result-list__item__summary"
                        dangerouslySetInnerHTML={{ __html: post.summary }}
                      />
                      <footer className="d-flex justify-content-between">
                        <div className="row">
                          <div className="col-md-6">
                            <i className="fa fa-calendar-o" />
                            <time
                              className="search-result-list__item__date"
                              dangerouslySetInnerHTML={{
                                __html: formatDate(new Date(post.date))
                              }}
                            />
                          </div>
                          <div className="col-md-6">
                            <i className="fa fa-tags" />
                            <ul className="search-result-list__item__tags">
                              {post.tags.map(tag => (
                                <li
                                  key={tag}
                                  className="search-result-list__item__tags__tag"
                                >
                                  <span
                                    dangerouslySetInnerHTML={{ __html: tag }}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </footer>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
            <div className="card__footer">
              <footer className="search__powered-by">
                Powered by{" "}
                <a href="https://www.algolia.com/" target="_blank">
                  <img src="/images/Algolia_logo_bg-white.svg" width="50" />
                </a>
              </footer>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
