#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const deindent = require('deindent')
const open = require('open-editor')
const { prompt } = require('enquirer')

const DIST_DIR = path.resolve(__dirname, '..', 'content', 'blog')
const zeroFill = num => String(num).padStart(2, '0')

async function main() {
  const now = new Date()
  const article = await prompt({
    type: 'snippet',
    name: 'frontmatter',
    message: 'Fill out the fields in frontmatter',
    required: true,
    fields: [
      {
        name: 'author_name',
        message: 'Author Name',
      },
      {
        name: 'version',
        validate(value, state, item, index) {
          if (item && item.name === 'version' && !semver.valid(value)) {
            return prompt.styles.danger(
              'version should be a valid semver value'
            )
          }
          return true
        },
      },
    ],
    template: deindent`---
    title: \${title}
    date: ${now.getFullYear()}-${zeroFill(now.getMonth() + 1)}-${zeroFill(
      now.getDate()
    )}T10:30:00+0900
    tags:
    - JavaScript
    ---
    `,
  })
  const { slug } = await prompt({
    type: 'input',
    name: 'slug',
    message: 'Fill out slug of article',
  })

  const distDir = path.join(DIST_DIR, slug)
  const distPath = path.join(distDir, 'index.md')
  fs.mkdirSync(distDir)
  fs.writeFileSync(distPath, article.frontmatter.result, 'utf8')
  console.log('Create and open', distPath)
  open([distPath], { editor: 'code' })
}

main()
  .then(() => console.log('Done'))
  .catch(console.error)
