import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Root } from '../components/Root'
import { BeforeReading } from '../components/BeforeReading'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { tag } = this.props.pageContext

    return (
      <Root>
        <Layout location={this.props.location} title={siteTitle}>
          <SEO title={`Tag:${tag}`} keywords={[tag]} />
          <Bio />
          <h2>Tag: {tag}</h2>
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
                    to={`/post${node.fields.slug}`}
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
                      fluid={
                        node.frontmatter.featuredImage.childImageSharp.fluid
                      }
                    />
                  )}
                <p
                  style={{ marginTop: rhythm(0.5) }}
                  dangerouslySetInnerHTML={{ __html: node.excerpt }}
                />
              </div>
            )
          })}
        </Layout>
      </Root>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query taggedListQuery($tag: String!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
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
                fluid(maxWidth: 700) {
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