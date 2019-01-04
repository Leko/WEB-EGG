module.exports = {
  siteMetadata: {
    title: 'WEB EGG',
    author: 'Leko',
    description: '',
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
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 700,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-autolink-headers`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              noInlineHighlight: true,
            },
          },
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
          `gatsby-remark-external-links`,
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
    `gatsby-plugin-feed`,
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
    // {
    //   resolve: `gatsby-plugin-algolia`,
    //   options: {
    //     appId: process.env.ALGOLIA_APP_ID,
    //     apiKey: process.env.ALGOLIA_API_KEY,
    //     indexName: process.env.ALGOLIA_INDEX_NAME,
    //     queries: [
    //       {
    //         query: `{
    //           allSitePage {
    //             edges {
    //               node {
    //                 objectID: id
    //                 component
    //                 path
    //                 componentChunkName
    //                 jsonName
    //                 internal {
    //                   type
    //                   contentDigest
    //                   owner
    //                 }
    //               }
    //             }
    //           }
    //         }`,
    //       },
    //     ],
    //     chunkSize: 10000,
    //   },
    // },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    `gatsby-plugin-netlify-cache`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-zopfli`,
    `gatsby-plugin-brotli`,
    `gatsby-plugin-webpack-bundle-analyzer`,
  ],
}
