import React from 'react'
import { Link } from 'gatsby'
import Bio from '../components/Bio'
import Img from 'gatsby-image'
import { BeforeReading } from './BeforeReading'
import '../styles/BlogPost.css'

export function BlogPostSummary(props) {
  const {
    title,
    slug,
    publishedAtStr,
    timeToRead,
    excerptHtml,
    featuredImage = null,
  } = props
  return (
    <section className="BlogPost">
      {featuredImage && (
        <Img
          className="BlogPost__featuredImage"
          fluid={featuredImage}
          loading="eager"
          fadeIn={false}
        />
      )}
      <h3 className="BlogPost__title">
        <Link className="BlogPost__title__link" to={`/post${slug}`}>
          {title}
        </Link>
      </h3>
      <div className="BeforeReading__wrap">
        <BeforeReading
          publishedAtStr={publishedAtStr}
          timeToRead={timeToRead}
        />
      </div>
      <div
        className="BlogPost__excerpt"
        dangerouslySetInnerHTML={{ __html: excerptHtml }}
      />
    </section>
  )
}
