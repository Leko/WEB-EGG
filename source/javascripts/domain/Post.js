// @flow

export type PostPayload = {
  objectID: string,
  title: string,
  date: string,
  summary: string,
  tags: Array<string>,
  published: boolean,
  locale: string,
  slug: string,
  path: string,
}

export default class Post {
  objectID: string
  title: string
  date: string
  summary: string
  tags: Array<string>
  published: boolean
  locale: string
  slug: string
  path: string

  constructor({
    objectID,
    title,
    date,
    summary,
    tags,
    published,
    locale,
    slug,
    path,
  }: PostPayload) {
    this.objectID = objectID
    this.title = title
    this.date = date
    this.summary = summary
    this.tags = tags
    this.published = published
    this.locale = locale
    this.slug = slug
    this.path = path
  }
}
