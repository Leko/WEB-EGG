import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

function SEO({
  description,
  date,
  lang,
  meta,
  keywords,
  title,
  slug,
  featuredImageName,
}) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription =
          description || data.site.siteMetadata.description
        const publicUrl = `${data.site.siteMetadata.siteUrl}post${slug}`

        const ldJSON = {
          '@context': 'http://schema.org',
          '@type': 'BlogPosting',
          url: publicUrl,
          headline: title,
          datePublished: date.toISOString(),
          editor: data.site.siteMetadata.author,
          keywords: keywords.join(`, `),
          description: metaDescription,
          author: {
            '@type': 'Person',
            name: data.site.siteMetadata.author,
          },
        }
        if (featuredImageName) {
          ldJSON.image = publicUrl + featuredImageName
        }

        return (
          <Helmet
            // https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet/#titles-dont-appear-when-opening-in-the-background-while-using-gatsby-plugin-offline
            defer={false}
            title={title}
            titleTemplate={`%s | ${data.site.siteMetadata.title}`}
            meta={meta}
          >
            <html lang={lang} amp />
            <meta name="description" content={metaDescription} />
            <meta name="twitter:card" content="summary" />
            <meta
              name="twitter:site"
              content={`@${data.site.siteMetadata.social.twitter}`}
            />
            <meta name="keywords" content={keywords.join(`, `)} />
            <meta property="og:url" content={publicUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={metaDescription} />
            {featuredImageName ? (
              <meta
                property="og:image"
                content={publicUrl + featuredImageName}
              />
            ) : null}
            <meta property="og:type" content="website" />
            <link rel="canonical" href={publicUrl} />
            <script async src="https://cdn.ampproject.org/v0.js" />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(ldJSON),
              }}
            />
          </Helmet>
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
  slug: PropTypes.string.isRequired,
  featuredImageName: PropTypes.string,
}

export default SEO

const detailsQuery = graphql`
  query DefaultSEOQueryAMP {
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
