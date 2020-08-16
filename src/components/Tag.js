import React from 'react'
import { Link } from 'gatsby'

export function Tag({ tagName }) {
  return (
    <Link
      to={`/tag/${encodeURIComponent(tagName.replace(/(#|\?)/g, ''))}`}
      className="tag"
    >
      {tagName}
    </Link>
  )
}
