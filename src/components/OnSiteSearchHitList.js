import React, { useContext } from 'react'
import {
  Panel,
  Hits,
  PoweredBy,
  connectStateResults,
} from 'react-instantsearch-dom'
import { OnSiteSearchHit } from './OnSiteSearchHit'
import { Context } from './ColorSchemeContext'

function List(props) {
  const { searchState, searchResults, error } = props
  const { theme } = useContext(Context)
  if (searchState && !searchState.query) {
    return null
  }

  return (
    <div className="OnSiteSearchHitList__root">
      <Panel
        header={`"${searchState.query}"の検索結果`}
        footer={<PoweredBy theme={theme} />}
      >
        {error ? <div>{error.message}</div> : null}
        {searchResults && searchResults.nbHits > 0 ? (
          <Hits hitComponent={OnSiteSearchHit} />
        ) : (
          <div>No results</div>
        )}
      </Panel>
    </div>
  )
}

export const OnSiteSearchHitList = connectStateResults(List)
