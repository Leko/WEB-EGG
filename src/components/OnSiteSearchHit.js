import React from 'react'
import { Link } from 'gatsby'
import { Highlight } from 'react-instantsearch-dom'
import { FaTags } from 'react-icons/fa'
import typography, { scale } from '../utils/typography'
import { BeforeReading } from './BeforeReading'

export function OnSiteSearchHit({ hit }) {
  const { id: slug, publishedAt, timeToRead, tags } = hit
  const dateFormatter = new Intl.DateTimeFormat()

  return (
    <div className="OnSiteSearchHit__root">
      <Link to={`/post${slug}`} style={{ color: typography.options.bodyColor }}>
        <div className="OnSiteSearchHit__headline">
          <strong
            style={{
              ...scale(),
            }}
          >
            <Highlight hit={hit} attribute="title" />
          </strong>
        </div>
        <span
          style={{
            ...scale(-0.1),
          }}
          className="OnSiteSearchHit__description"
        >
          <Highlight hit={hit} attribute="excerpt" />
        </span>
        <div className="OnSiteSearchHit__meta">
          <div
            style={{
              ...scale(-0.2),
            }}
            className="OnSiteSearchHit__meta__tags"
          >
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
