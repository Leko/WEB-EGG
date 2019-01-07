const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve(`./src/templates/blog-post.js`)
    const blogPostList = path.resolve(`./src/templates/index.js`)
    const blogTaggedPostList = path.resolve(`./src/templates/tagged-posts.js`)
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
              limit: 1000
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  frontmatter {
                    title
                    tags
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges

        // Create list of posts pages
        // https://www.gatsbyjs.org/docs/adding-pagination/
        const postsPerPage = 10
        const numPages = Math.ceil(posts.length / postsPerPage)
        Array.from({ length: numPages }).forEach((_, index) => {
          const withPrefix = pageNumber =>
            pageNumber === 1 ? `/` : `/page/${pageNumber}`
          const pageNumber = index + 1
          createPage({
            path: withPrefix(pageNumber),
            component: blogPostList,
            context: {
              limit: postsPerPage,
              skip: index * postsPerPage,
              current: pageNumber,
              total: numPages,
              hasNext: pageNumber < numPages,
              nextPath: withPrefix(pageNumber + 1),
              hasPrev: index > 0,
              prevPath: withPrefix(pageNumber - 1),
            },
          })
        })

        // Create list of tagged posts pages
        const tags = posts.reduce(
          (tagsSet, post) =>
            new Set([...tagsSet, ...new Set(post.node.frontmatter.tags)]),
          new Set()
        )
        Array.from(tags).forEach(tag => {
          const escape = tagName => tagName.replace(/(\#|\?)/g, '')
          const withPrefix = tagName => `/tag/${escape(tagName)}`
          createPage({
            path: withPrefix(tag),
            component: blogTaggedPostList,
            context: {
              tag: tag,
            },
          })
        })

        // Create blog posts pages.
        posts.forEach((post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node
          const next = index === 0 ? null : posts[index - 1].node

          createPage({
            path: `/post${post.node.fields.slug}`,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
