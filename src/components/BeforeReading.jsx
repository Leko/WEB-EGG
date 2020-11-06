import React from 'react'
import { TimeToRead } from './TimeToRead'

export function BeforeReading({ publishedAtStr, timeToRead }) {
  return (
    <small className="BeforeReading">
      <time dateTime={new Date(publishedAtStr).toISOString()}>
        {publishedAtStr}
      </time>
      &nbsp;&middot;&nbsp;
      <TimeToRead minutes={timeToRead} />
    </small>
  )
}
