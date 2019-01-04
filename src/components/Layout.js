import React from 'react'
import { Link } from 'gatsby'
import { Copyright } from './Copyright'
import { Brand } from './Brand'
import { rhythm, scale } from '../utils/typography'

class Layout extends React.Component {
  render() {
    const { location, title, children, headerDimmed = false } = this.props

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
