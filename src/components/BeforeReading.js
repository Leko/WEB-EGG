import React from 'react'
import { rhythm, scale } from '../utils/typography'
import { TimeToRead } from './TimeToRead'

export function BeforeReading({ publishedAtStr, timeToRead }) {
  return (
    <small
      style={{
        ...scale(-1 / 5),
        display: `block`,
        marginBottom: rhythm(1),
      }}
    >
      <time dateTime={new Date(publishedAtStr).toISOString()}>
        {publishedAtStr}
      </time>
      &nbsp;&middot;&nbsp;
      <TimeToRead minutes={timeToRead} />
    </small>
  )
}
