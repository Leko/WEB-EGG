import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Root } from '../components/Root'
import { BlogPostSummary } from '../components/BlogPostSummary'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const {
      current,
      total,
      hasNext,
      hasPrev,
      nextPath,
      prevPath,
    } = this.props.pageContext

    return (
      <Root>
        <Layout location={this.props.location} title={siteTitle}>
          <SEO title="All posts" />
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <div key={node.fields.slug}>
                <BlogPostSummary
                  title={title}
                  slug={node.fields.slug}
                  publishedAtStr={node.frontmatter.date}
                  timeToRead={node.timeToRead}
                  excerptHtml={node.excerpt}
                  featuredImage={
                    node.frontmatter.featuredImage?.childImageSharp?.fluid
                  }
                />
              </div>
            )
          })}
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {hasPrev && (
                <Link to={prevPath} rel="prev">
                  ← Prev
                </Link>
              )}
            </li>
            <li>
              {current} of {total}
            </li>
            <li>
              {hasNext && (
                <Link to={nextPath} rel="next">
                  Next →
                </Link>
              )}
            </li>
          </ul>
        </Layout>
      </Root>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          timeToRead
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 1336) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
        }
      }
    }
  }
`
