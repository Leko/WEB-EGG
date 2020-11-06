import React from 'react'
import Bio from '../components/Bio'
import Img from 'gatsby-image'
import { Tag } from './Tag'
import { BeforeReading } from './BeforeReading'
import '../styles/BlogPost.css'

export function BlogPostFull(props) {
  const {
    title,
    publishedAtStr,
    timeToRead,
    tags,
    bodyHtml,
    featuredImage = null,
    renderBeforeBody = () => null,
    renderPostBody = () => null,
  } = props
  return (
    <section className="BlogPost BlogPost--full">
      {featuredImage && (
        <Img className="BlogPost__featuredImage" fluid={featuredImage} />
      )}
      <h1 className="BlogPost__title">{title}</h1>
      <div className="BeforeReading__wrap">
        <BeforeReading
          publishedAtStr={publishedAtStr}
          timeToRead={timeToRead}
        />
      </div>
      <div className="Bio__wrap">
        <Bio />
      </div>
      {renderBeforeBody()}
      <div
        className="BlogPost__body"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
      {renderPostBody()}
      {tags && (
        <small className="Tags">
          {tags.map(tagName => (
            <Tag key={tagName} tagName={tagName} />
          ))}
        </small>
      )}
    </section>
  )
}
