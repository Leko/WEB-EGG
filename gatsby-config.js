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
              maxWidth: 700,
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
              maxWidth: 700,
            },
          },
          // {
          //   resolve: `gatsby-remark-responsive-iframe`,
          //   options: {
          //     wrapperStyle: `margin-bottom: 1.0725rem`,
          //   },
          // },
          `gatsby-remark-autolink-headers`,
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
                const permalink = `${site.siteMetadata.siteUrl}post${
                  edge.node.fields.slug
                }`
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
    `gatsby-plugin-netlify`,
    `gatsby-plugin-zopfli`,
    `gatsby-plugin-brotli`,
    {
      resolve: `gatsby-plugin-webpack-bundle-analyzer`,
      options: {
        disable: true,
      },
    },
    {
      resolve: `gatsby-plugin-sentry`,
      options: {
        dsn: 'https://12665dacfb554ecea25f3ef119a904af@sentry.io/244064',
        // https://docs.sentry.io/clients/node/config/#optional-settings
        // https://www.netlify.com/docs/continuous-deployment/#build-environment-variables
        // https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables
        environment: process.env.CONTEXT || process.env.NODE_ENV,
        enabled: process.env.NODE_ENV === 'production',
        release: require('git-rev-sync').long(),
      },
    },
    `gatsby-plugin-twitter`,
    `gatsby-plugin-nprogress`,
  ],
}
