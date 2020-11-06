import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import '../styles/Bio.css'

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
        const { author, social } = data.site.siteMetadata
        return (
          <aside className="Bio">
            <div className="Bio__content">
              <Image
                fixed={data.avatar.childImageSharp.fixed}
                alt={author}
                className="Bio__avatar"
                style={{
                  minWidth: 50,
                }}
              />
              <p className="Bio__info-wrap">
                <strong className="Bio__info-wrap__name">{author}</strong>
                <br />
                <a
                  href={`https://leko.jp`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="social"
                >
                  About
                </a>
                {' / '}
                <a
                  href={`https://twitter.com/${social.twitter}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="social"
                >
                  Twitter
                </a>
                {' / '}
                <a
                  href={`https://github.com/${social.github}`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="social"
                >
                  GitHub
                </a>
              </p>
            </div>
          </aside>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed_withWebp
        }
      }
    }
    site {
      siteMetadata {
        author
        social {
          twitter
          github
        }
      }
    }
  }
`

export default Bio
