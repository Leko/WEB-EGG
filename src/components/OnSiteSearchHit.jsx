import React from 'react'
import { Link } from 'gatsby'
import { Highlight } from 'react-instantsearch-dom'
import { FaTags } from 'react-icons/fa'
import { BeforeReading } from './BeforeReading'

export function OnSiteSearchHit({ hit }) {
  const { id: slug, publishedAt, timeToRead, tags } = hit
  const dateFormatter = new Intl.DateTimeFormat()

  return (
    <div className="OnSiteSearchHit__root">
      <Link to={`/post${slug}`} style={{ color: 'var(--leko-foreground)' }}>
        <div className="OnSiteSearchHit__headline">
          <strong>
            <Highlight hit={hit} attribute="title" />
          </strong>
        </div>
        <span className="OnSiteSearchHit__description">
          <Highlight hit={hit} attribute="excerpt" />
        </span>
        <div className="OnSiteSearchHit__meta">
          <div className="OnSiteSearchHit__meta__tags">
            {tags ? (
              <>
                <div className="OnSiteSearchHit__meta__tags__icon">
                  <FaTags />
                </div>

                {tags.map(tag => (
                  <span key={tag} className="OnSiteSearchHit__meta__tags__tag">
                    {tag}
                  </span>
                ))}
              </>
            ) : null}
          </div>
          <BeforeReading
            publishedAtStr={dateFormatter.format(new Date(publishedAt))}
            timeToRead={timeToRead}
            style={{
              marginBottom: 0,
            }}
          />
        </div>
      </Link>
    </div>
  )
}
