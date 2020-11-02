import React from 'react'
import { Link } from 'gatsby'
import { rhythm } from '../utils/typography'

export function Brand({ title }) {
  return (
    <Link
      style={{
        boxShadow: `none`,
        textDecoration: `none`,
        color: `inherit`,
      }}
      to={`/`}
    >
      <h1
        style={{
          display: 'inline-block',
          fontFamily: `Montserrat, sans-serif`,
          marginTop: 0,
          marginBottom: rhythm(-1),
        }}
      >
        {title}
      </h1>
    </Link>
  )
}
