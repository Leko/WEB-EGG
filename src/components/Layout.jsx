import React, { useContext } from 'react'
import { Copyright } from './Copyright'
import { Brand } from './Brand'
import { ColorScheme } from './ColorScheme'
import { Context } from '../components/ColorSchemeContext'
import '../styles/Layout.css'

// React.lazy and Suspense is not yet available for server-side rendering. If you want to do code-splitting in a server rendered app, we recommend Loadable Components. It has a nice guide for bundle splitting with server-side rendering.
// https://reactjs.org/docs/code-splitting.html#reactlazy
// https://github.com/gatsbyjs/gatsby/issues/11960
import loadable from '@loadable/component'

function Layout(props) {
  const { title, children, headerDimmed = false, amp = false } = props
  const { theme, changeTheme } = useContext(Context)
  const OnSiteSearch = loadable(() => import('./OnSiteSearch'))

  return (
    <div
      style={{
        marginLeft: `auto`,
        marginRight: `auto`,
        maxWidth: 700,
        padding: `42px 16px`,
      }}
    >
      <div className="Brand__container">
        <div className="Brand__logo">
          <Brand title={title} dimmed={headerDimmed} />
        </div>
        <div className="Brand__search">{amp ? null : <OnSiteSearch />}</div>
        <div className="Brand__color-scheme">
          <ColorScheme theme={theme} onChange={changeTheme} />
        </div>
      </div>
      {children}
      <Copyright />
    </div>
  )
}

export default Layout
