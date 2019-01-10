import React from 'react'
import { Copyright } from './Copyright'
import { Brand } from './Brand'
import { rhythm } from '../utils/typography'

class Layout extends React.Component {
  render() {
    const { title, children, headerDimmed = false } = this.props

    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: 700,
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <Brand title={title} dimmed={headerDimmed} />
        {children}
        <Copyright />
      </div>
    )
  }
}

export default Layout
