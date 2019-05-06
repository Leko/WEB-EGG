import React from 'react'
import algoliasearch from 'algoliasearch/lite'
import { FaSearch } from 'react-icons/fa'
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch-dom'
import { OnSiteSearchHitList } from './OnSiteSearchHitList'
import '../styles/OnSiteSearch.css'

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_ONLY_API_KEY
)

export function OnSiteSearch() {
  return (
    <InstantSearch
      indexName={process.env.ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
    >
      <Configure
        // https://www.algolia.com/doc/api-reference/search-api-parameters/
        hitsPerPage={20}
        removeStopWords
        analytics
        analyticsTags={['on-site-search']}
      />
      <div className="OnSiteSearch__input">
        <div className="OnSiteSearch__input__icon">
          <FaSearch />
        </div>
        <SearchBox showLoadingIndicator={false} submit={null} reset={null} />
      </div>
      <OnSiteSearchHitList />
    </InstantSearch>
  )
}

// To use React Suspense
export default OnSiteSearch
