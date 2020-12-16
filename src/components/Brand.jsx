import React from 'react'
import { Link } from 'gatsby'

export function Brand({ title }) {
  return (
    <Link to={`/`}>
      <h1
        style={{
          fontFamily: `'Montserrat', sans-serif`,
          margin: 0,
        }}
      >
        {title}
      </h1>
    </Link>
  )
}
