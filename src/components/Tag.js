import React from 'react'
import { Link } from 'gatsby'

export function Tag({ tagName }) {
  return (
    <Link to={`tag/${tagName}`} className="tag">
      {tagName}
    </Link>
  )
}
