import React from 'react'
import { Copyright } from './Copyright'
import { Brand } from './Brand'
import { rhythm } from '../utils/typography'
import '../styles/Layout.css'

// React.lazy and Suspense is not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend Loadable Components. It has a nice guide for bundle splitting with server-side rendering.
// https://reactjs.org/docs/code-splitting.html#reactlazy
// https://github.com/gatsbyjs/gatsby/issues/11960
import loadable from '@loadable/component'

function Layout(props) {
  const { title, children, headerDimmed = false, amp = false } = props
  const OnSiteSearch = loadable(() => import('./OnSiteSearch'))

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: 700,
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}
    >
      <div className="Brand__container">
        <div style={{ flex: 1 }}>
          <Brand title={title} dimmed={headerDimmed} />
        </div>
        {amp ? null : <OnSiteSearch />}
      </div>
      {children}
      <Copyright />
    </div>
  )
}

export default Layout
