import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { BeforeReading } from '../components/BeforeReading'
import { rhythm, scale } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const {
      now,
      current,
      total,
      hasNext,
      hasPrev,
      nextPath,
      prevPath,
    } = this.props.pageContext
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const nowTime = new Date(now).getTime()
    const posts = data.allMarkdownRemark.edges.filter(
      ({ node }) => new Date(node.frontmatter.rawDate).getTime() <= nowTime
    )

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title="All posts" />
        <Bio />
        {posts.map(({ node }) => {
          const title = node.frontmatter.title || node.fields.slug
          return (
            <div key={node.fields.slug}>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}
              >
                <Link
                  style={{ boxShadow: `none` }}
                  to={`post${node.fields.slug}`}
                >
                  {title}
                </Link>
              </h3>
              <BeforeReading
                publishedAtStr={node.frontmatter.date}
                timeToRead={node.timeToRead}
              />
              {node.frontmatter.featuredImage &&
                node.frontmatter.featuredImage.childImageSharp && (
                  <Img
                    fluid={node.frontmatter.featuredImage.childImageSharp.fluid}
                  />
                )}
              <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
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
            rawDate: date
            date(formatString: "MMMM DD, YYYY")
            title
            featuredImage {
              childImageSharp {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
