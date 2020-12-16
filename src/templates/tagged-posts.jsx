import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { Root } from '../components/Root'
import { BlogPostSummary } from '../components/BlogPostSummary'

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
          <h2>Tag: {tag}</h2>
          {posts.map(({ node }) => {
            const title = node.frontmatter.title || node.fields.slug
            return (
              <BlogPostSummary
                key={node.fields.slug}
                title={title}
                slug={node.fields.slug}
                publishedAtStr={node.frontmatter.date}
                timeToRead={node.timeToRead}
                excerptHtml={node.excerpt}
                featuredImage={
                  node.frontmatter.featuredImage?.childImageSharp?.fluid
                }
              />
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
