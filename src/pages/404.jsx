import React from 'react'
import { Root } from '../components/Root'
import Layout from '../components/Layout'
import SEO from '../components/seo'

class NotFoundPage extends React.Component {
  render() {
    return (
      <Root>
        <Layout location={this.props.location}>
          <SEO title="404: Not Found" />
          <h1>Not Found</h1>
          <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        </Layout>
      </Root>
    )
  }
}

export default NotFoundPage
