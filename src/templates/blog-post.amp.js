import React from 'react'
import { Link, graphql } from 'gatsby'
import Img from 'gatsby-image'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import AMPSEO from '../components/AMPSEO'
import { Tag } from '../components/Tag'
import { BeforeReading } from '../components/BeforeReading'
import { rhythm } from '../utils/typography'

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { previous, next, amp = false } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle} headerDimmed amp={amp}>
        <AMPSEO
          amp={amp}
          title={post.frontmatter.title}
          description={post.excerpt}
          slug={this.props.pageContext.slug}
          date={new Date(post.frontmatter.date)}
          featuredImageName={
            post.frontmatter.featuredImage
              ? post.frontmatter.featuredImage.base
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
            <Img fluid={post.frontmatter.featuredImage.childImageSharp.fluid} />
          )}
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
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
          <li>
            {previous && (
              <Link to={`post${previous.fields.slug}`} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={`post${next.fields.slug}`} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlugAMP($slug: String!) {
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
          base
          childImageSharp {
            fluid(maxWidth: 700) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
