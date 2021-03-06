import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'
import { Context } from './ColorSchemeContext'

function SEO({
  description,
  lang,
  meta,
  keywords,
  title,
  slug,
  featuredImageName,
}) {
  const { theme } = useContext(Context)

  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description
        const publicUrl = `${data.site.siteMetadata.siteUrl}/post${slug}`

        return (
          <Helmet
            htmlAttributes={{
              lang,
            }}
            bodyAttributes={{
              'data-theme': theme,
            }}
            title={title}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
            link={[
              {
                rel: 'amphtml',
                href: publicUrl.replace('/post/', '/amp/post/'),
              },
              {
                rel: 'canonical',
                href: slug ? publicUrl : null,
              },
              {
                rel: 'author',
                href: 'http://www.hatena.ne.jp/L_e_k_o/',
              },
            ].filter(({ href }) => !!href)}
            meta={[
              {
                name: `description`,
                content: metaDescription,
              },
              {
                property: `og:url`,
                content: publicUrl,
              },
              {
                property: `og:title`,
                content: title,
              },
              {
                property: `og:description`,
                content: metaDescription,
              },
              featuredImageName
                ? {
                    property: `og:image`,
                    content: data.site.siteMetadata.siteUrl + featuredImageName,
                  }
                : null,
              {
                property: `og:type`,
                content: `website`,
              },
              {
                name: `twitter:card`,
                content: `summary_large_image`,
              },
              {
                property: `twitter:title`,
                content: title,
              },
              {
                property: `twitter:description`,
                content: metaDescription,
              },
              featuredImageName
                ? {
                    property: `twitter:image`,
                    content: data.site.siteMetadata.siteUrl + featuredImageName,
                  }
                : null,
              {
                name: `twitter:site`,
                content: `@${data.site.siteMetadata.social.twitter}`,
              },
              {
                name: `twitter:creator`,
                content: `@${data.site.siteMetadata.social.twitter}`,
              },
            ]
              .concat(
                keywords.length > 0
                  ? {
                      name: `keywords`,
                      content: keywords.join(`, `),
                    }
                  : []
              )
              .concat(meta)
              .filter(Boolean)}
          />
        )
      }}
    />
  )
}

SEO.defaultProps = {
  lang: `ja`,
  meta: [],
  keywords: [],
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
  slug: PropTypes.string,
  featuredImageName: PropTypes.string,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site {
      siteMetadata {
        title
        description
        author
        siteUrl
        social {
          twitter
        }
      }
    }
  }
`
