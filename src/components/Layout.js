import React from 'react'
import { Copyright } from './Copyright'
import { Brand } from './Brand'
import { rhythm } from '../utils/typography'
import { OnSiteSearch } from './OnSiteSearch'

function Layout(props) {
  const { title, children, headerDimmed = false } = props

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: 700,
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <div
        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
      >
        <div style={{ flex: 1 }}>
          <Brand title={title} dimmed={headerDimmed} />
        </div>
        <OnSiteSearch />
      </div>
      {children}
      <Copyright />
    </div>
  )
}

export default Layout
