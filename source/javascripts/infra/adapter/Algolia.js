// @flow
import type { PostPayload } from '../../domain/Post'
import algoliasearch from 'algoliasearch/lite'
import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
import sortBy from 'lodash/sortBy'
import Base from './Base'
import Post from '../../domain/Post'
import PostList from '../../domain/PostList'

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY)

type HighlightResult = {
  value: string,
  matchLevel: 'none' | 'partial' | 'full',
  fullyHighlighted: boolean,
  matchedWords: Array<string>,
}

type AlgoliaPost = {
  _highlightResult: {
    title: HighlightResult,
    summary: HighlightResult,
    tags: Array<HighlightResult>,
    slug: HighlightResult,
  }
} & PostPayload

type AlgoliaResponse = {
  exhaustiveNbHits: boolean,
  hits: Array<AlgoliaPost>,
  hitsPerPage: string,
  nbHits: string,
  nbPages: string,
  page: string,
  params: string,
  processingTimeMS: string,
  query: string,
}

export default class Algolia extends Base {
  index: any

  constructor () {
    super()
    this.index = client.initIndex(process.env.ALGOLIA_INDEX)
  }

  /**
   * ハイライトされている量を優先してソートをかける
   */
  sortTagsHighlighted (tags: Array<HighlightResult>) {
    const levelMap = {
      none: 3,
      partial: 2,
      full: 1,
    }
    return sortBy(tags, t => levelMap[t.matchLevel] - (t.fullyHighlighted ? 1 : 0))
  }

  async find (keyword: string): Promise<PostList> {
    const algoliaOptions = {
      query: keyword,
      hitsPerPage: 1000,
      attributesToRetrieve: [
        'title',
        'summary',
        'tags',
        'path',
        'objectID',
        'date',
        'published',
        'locale',
        'slug',
      ]
    }
    const response: AlgoliaResponse = await this.index.search(algoliaOptions)
    const postList = response.hits
      .map(hit => {
        let tags = []
        if (has(hit, '_highlightResult.tags')) {
          tags = map(this.sortTagsHighlighted(hit._highlightResult.tags), 'value')
        } else {
          tags = hit.tags
        }
        return new Post({
          title: get(hit, '_highlightResult.title.value', hit.title),
          summary: get(hit, '_highlightResult.summary.value', hit.summary),
          tags: tags,
          slug: get(hit, '_highlightResult.slug.value', hit.slug),
          objectID: hit.objectID,
          date: hit.date,
          published: hit.published,
          locale: hit.locale,
          path: hit.path,
        })
      }
    )
      .reduce((list, post) => list.append(post), new PostList())

    return postList
  }
}
