/* global process */
import React, { useEffect, useRef } from 'react'
import algoliasearch from 'algoliasearch/lite'
import { FaSearch } from 'react-icons/fa'
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch-dom'
import { OnSiteSearchHitList } from './OnSiteSearchHitList'

const searchClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_ONLY_API_KEY
)

export function OnSiteSearch() {
  const inputRef = useRef(null)
  useEffect(() => {
    window.addEventListener('keyup', handleFocus, false)
    function handleFocus(e) {
      if (e.key === '/') {
        inputRef.current.focus()
      }
    }
    return () => {
      window.removeEventListener('keyup', handleFocus)
    }
  }, [])

  return (
    <InstantSearch
      indexName={process.env.ALGOLIA_INDEX_NAME}
      searchClient={searchClient}
      // https://www.algolia.com/doc/guides/building-search-ui/going-further/integrate-google-analytics/react/
      onSearchStateChange={searchState => {
        window.gtag?.('event', 'search', {
          search_term: searchState.query,
        })
      }}
    >
      <Configure
        // https://www.algolia.com/doc/api-reference/search-api-parameters/
        hitsPerPage={20}
        removeStopWords
        analytics
        analyticsTags={['on-site-search']}
      />
      <div className="OnSiteSearch__input">
        <label className="OnSiteSearch__input__icon">
          <FaSearch />
        </label>
        <SearchBox
          inputRef={inputRef}
          translations={{
            placeholder: 'Press / to search',
          }}
          focusShortcuts={[]}
          showLoadingIndicator={false}
          submit={null}
          reset={null}
        />
      </div>
      <OnSiteSearchHitList />
    </InstantSearch>
  )
}

// To use React Suspense
export default OnSiteSearch
