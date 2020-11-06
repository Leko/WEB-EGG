import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Root } from '../components/Root'
import { Tag } from '../components/Tag'
import { BeforeReading } from '../components/BeforeReading'
import { rhythm } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next } = this.props.pageContext

    return (
      <Root>
        <Layout location={this.props.location} title={siteTitle} headerDimmed>
          <SEO
            title={post.frontmatter.title}
            description={post.excerpt}
            slug={this.props.pageContext.slug}
            featuredImageName={
              post.frontmatter.featuredImage &&
              post.frontmatter.featuredImage.childImageSharp
                ? post.frontmatter.featuredImage.childImageSharp.fluid.src
                : null
            }
          />
          <h1>{post.frontmatter.title}</h1>
          <BeforeReading
            publishedAtStr={post.frontmatter.date}
            timeToRead={post.timeToRead}
          />
          {post.frontmatter.featuredImage &&
            post.frontmatter.featuredImage.childImageSharp && (
              <Img
                fluid={post.frontmatter.featuredImage.childImageSharp.fluid}
              />
            )}
          {post.frontmatter.tags && (
            <small
              style={{
                display: `block`,
                marginTop: rhythm(0.5),
                marginBottom: rhythm(0.5),
              }}
            >
              Tags:
              {post.frontmatter.tags.map(tagName => (
                <Tag key={tagName} tagName={tagName} />
              ))}
            </small>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: post.html }}
            style={{ margin: '1em 0' }}
          />
          {post.frontmatter.tags && (
            <small
              style={{
                display: `block`,
                marginBottom: rhythm(0.5),
              }}
            >
              Tags:
              {post.frontmatter.tags.map(tagName => (
                <Tag key={tagName} tagName={tagName} />
              ))}
            </small>
          )}
          <Bio />

          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li style={{ flex: 1 }}>
              {previous && (
                <Link to={`/post${previous.fields.slug}`} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li style={{ flex: 1 }}>
              {next && (
                <Link to={`/post${next.fields.slug}`} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </Layout>
      </Root>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      timeToRead
      frontmatter {
        title
        tags
        date(formatString: "MMMM DD, YYYY")
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
`