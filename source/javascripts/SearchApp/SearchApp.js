// @flow
import type { Context } from 'almin'
import type PostState from '../store/PostState'
import React, { Component } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import debounce from 'lodash/debounce'
import Post from '../domain/Post'
import PostList from '../domain/PostList'
import { FilterPostListUseCaseFactory } from '../usecase/FilterPostListUseCase'

type Props = {
  appContext: Context,
  postState: PostState
}
type State = {
  keyword: string,
  cursor: number,
  inFocus: boolean,
}

export default class SearchApp extends Component<void, Props, State> {
  state: State
  handleChange: Function
  handleKeyPress: Function
  handleBlur: Function
  handleFocus: Function

  constructor (props: Props) {
    super(props)
    this.state = {
      keyword: '',
      cursor: -1,
      inFocus: false,
    }
    this.handleChange = debounce(this.handleChange.bind(this), 200)
    this.handleKeyPress = debounce(this.handleKeyPress.bind(this), 200)
    this.handleBlur = debounce(this.handleBlur.bind(this), 200)
    this.handleFocus = debounce(this.handleFocus.bind(this), 200)
  }

  componentDidMount () {

  }

  handleChange () {
    const keyword = this.refs.search.value
    this.props.appContext.useCase(FilterPostListUseCaseFactory.create()).execute(keyword)
    this.setState({ keyword, cursor: 0 })
  }

  handleKeyPress (e: KeyboardEvent) {
    // TODO
  }

  handleBlur () {
    this.setState({ inFocus: false, cursor: -1 })
  }

  handleFocus () {
    this.setState({ inFocus: true, cursor: -1 })
  }

  setCursor (index: number) {
    this.setState({ cursor: index })
  }

  render () {
    return (
      <form className='form-inline search'>
        <div className='input-group'>
          <div className='input-group-addon'>
            <i className='fa fa-search' />
          </div>
          <input
            ref='search'
            type='text'
            placeholder='Search'
            className='form-control'
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        {this.state.inFocus && this.state.keyword
          ? (
            <div className='card'>
              <div className='card__header'>
                <h3>Search result of '{this.state.keyword}'</h3>
              </div>
              <div className='card__body'>
                <ol className='search-result-list'>
                  {this.props.postState.posts.getAllPosts().map((post, i) => (
                    <li
                      tabIndex={-1}
                      onFocus={this.setCursor.bind(this, i)}
                      ref={i === this.state.cursor ? 'focusResult' : null}
                      className={
                        classnames(
                          'search-result-list__item',
                          { 'search-result-list__item--focus': i === this.state.cursor }
                        )
                      }
                    >
                      <a href={post.path}>
                        <header>
                          <h4
                            className='search-result-list__item__title'
                            dangerouslySetInnerHTML={{ __html: post.title }}
                          />
                        </header>
                        <div
                          className='search-result-list__item__summary'
                          dangerouslySetInnerHTML={{ __html: post.summary }}
                        />
                        <footer className='d-flex justify-content-between'>
                          <div className='row'>
                            <div className='col-md-6'>
                              <i className='fa fa-calendar-o' />
                              <time
                                className='search-result-list__item__date'
                                dangerouslySetInnerHTML={{ __html: moment(new Date(post.date)).format('YYYY-MM-DD') }}
                              />
                            </div>
                            <div className='col-md-6'>
                              <i className='fa fa-tags' />
                              <ul className='search-result-list__item__tags'>
                                {post.tags.map(tag => (
                                  <li key={tag} className='search-result-list__item__tags__tag'>
                                    <span dangerouslySetInnerHTML={{ __html: tag }} />
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
              <div className='card__footer'>
                <footer className='search__powered-by'>
                  Powered by <a href='https://www.algolia.com/' target='_blank'>
                    <img src='/images/Algolia_logo_bg-white.svg' width='50' />
                  </a>
                </footer>
              </div>
            </div>
          )
          : null}
      </form>
    )
  }
}