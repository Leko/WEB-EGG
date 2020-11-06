import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Root } from '../components/Root'
import { BlogPostFull } from '../components/BlogPostFull'
import { TocSpy } from '../components/TocSpy'

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
          <div className="Layout__post">
            <div className="Layout__post__toc">
              <TocSpy headings={post.headings} />
            </div>
            <div className="Layout__post__post">
              <BlogPostFull
                title={post.frontmatter.title}
                publishedAtStr={post.frontmatter.date}
                timeToRead={post.timeToRead}
                bodyHtml={post.html}
                featuredImage={
                  post.frontmatter.featuredImage?.childImageSharp?.fluid
                }
                tags={post.frontmatter.tags ?? []}
              />
            </div>
          </div>
          <ul
            style={{
              marginTop: 56,
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
      headings {
        value
        depth
      }
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
