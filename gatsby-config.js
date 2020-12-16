/* eslint-env node */

module.exports = {
  siteMetadata: {
    title: 'WEB EGG',
    author: 'Leko',
    description: 'JavaScriptとNode.jsを中心に、web開発関連のことを書きます',
    siteUrl: `https://blog.leko.jp/`,
    social: {
      twitter: `L_e_k_o`,
      github: `Leko`,
    },
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/assets`,
        name: `assets`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-discoverable-oembed`,
            options: {
              experimental_lazyload: false,
              maxWidth: 1336, // 668 * 2
              whitelist: [
                `https://*.hatenablog.com/entry/**/*`,
                `https://npmcharts.com/**/*`,
                `https://runkit.com/**/*`,
                `https://speakerdeck.com/**/*`,
                `https://codesandbox.io/**/*`,
                `https://talks.leko.jp/**/*`,
              ],
            },
          },
          {
            resolve: `gatsby-remark-expand-github-embedded-code-snippet`,
            options: {
              whitelist: [`Leko/*`, `denoland/deno`],
              token: process.env.GITHUB_TOKEN,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 1336, // 668 * 2
            },
          },
          // {
          //   resolve: `gatsby-remark-responsive-iframe`,
          //   options: {
          //     wrapperStyle: `margin-bottom: 1.0725rem`,
          //   },
          // },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              offsetY: 200,
              className: `autolink-header`,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              noInlineHighlight: true,
              aliases: {
                sh: 'bash',
                rb: 'ruby',
              },
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-external-links`,
          `gatsby-remark-emoji-unicode`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: 'GTM-MC5WFRX',
        includeInDevelopment: false,
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIROMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIROMENT_PREVIEW_NAME",
      },
    },
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                const permalink = `${site.siteMetadata.siteUrl}post${edge.node.fields.slug}`
                return {
                  title: edge.node.frontmatter.title,
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: permalink,
                  guid: permalink,
                }
              })
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: 'RSS Feed | WEB EGG',
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `WEB EGG`,
        short_name: `WEB EGG`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#FCB900`,
        display: `minimal-ui`,
        icon: `content/assets/icon.png`,
      },
    },
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_API_KEY,
        indexName: process.env.ALGOLIA_INDEX_NAME,
        queries: [
          {
            query: `{
              allMarkdownRemark {
                edges {
                  node {
                    timeToRead
                    excerpt
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date(formatString: "MMMM DD, YYYY")
                      tags
                    }
                    # rawMarkdownBody
                    # internal {
                    #   contentDigest
                    # }
                  }
                }
              }
            }`,
            transformer: ({ data }) =>
              data.allMarkdownRemark.edges.flatMap(({ node }) => {
                return {
                  id: node.fields.slug,
                  timeToRead: node.timeToRead,
                  excerpt: node.excerpt,
                  // body: node.rawMarkdownBody,
                  title: node.frontmatter.title,
                  publishedAt: new Date(node.frontmatter.date),
                  tags: node.frontmatter.tags,
                }
              }),
          },
        ],
        chunkSize: 10000,
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-brotli`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyser-v2`,
      options: {
        disable: true,
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-nprogress`,
    {
      resolve: `gatsby-plugin-polyfill-io`,
      options: {
        features: [`IntersectionObserver`],
      },
    },
  ],
}
