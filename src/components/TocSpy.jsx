import React, { useEffect, useState, useCallback } from 'react'
import { FaList } from 'react-icons/fa'
import { Button } from './Button'
import '../styles/TocSpy.css'

function classNames(list) {
  return list.filter(Boolean).join(' ')
}

function getSelector(root, macDepth) {
  const selectors = []
  for (let depth = 1; depth <= macDepth; depth++) {
    selectors.push(`${root} h${depth}[id]`)
  }
  return selectors.join(',')
}

const MARGIN = 200

export function TocSpy(props) {
  const { root, maxDepth = 3 } = props
  const [activeIndex, setActiveIndex] = useState(-1)
  const [headings, setHeadings] = useState([])
  const [open, setOpen] = useState(false)

  const toggleOpen = useCallback(() => {
    window.gtag?.('event', 'select_content', {
      content_type: 'link',
      item_id: 'toc',
    })
    setOpen(before => !before)
  })
  const scrollTo = (e, { depth, slug }, index) => {
    window.gtag?.('event', 'select_content', {
      content_type: 'link',
      item_id: 'toc_item',
    })

    const targetEl = document.querySelector(`h${depth} [href="${slug}"]`)
      .parentElement
    e.preventDefault()
    history.pushState({}, document.title, slug)
    window.scrollTo({
      left: 0,
      top: Math.max(0, targetEl.offsetTop - MARGIN + 1),
    })
    requestAnimationFrame(() => {
      setActiveIndex(index)
    })
  }

  useEffect(() => {
    const selector = getSelector(root, maxDepth)
    const headingElements = [...document.querySelectorAll(selector)]
    const headings = headingElements.map(el => ({
      el,
      text: el.textContent,
      depth: parseInt(el.tagName.slice(-1)),
      slug: el.id,
    }))

    let prevMap = new Map()
    const observers = headings.map((heading, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          const init = !prevMap.has(index)
          const prev = prevMap.get(index)
          prevMap.set(index, entry)

          if (init && entry.isIntersecting) {
            setActiveIndex(index)
            return
          }
          if (!prev?.isIntersecting && entry.isIntersecting) {
            setActiveIndex(index)
            return
          }
          if (prev?.isIntersecting && !entry.isIntersecting) {
            const up = prev.boundingClientRect.y > entry.boundingClientRect.y
            if (!up) {
              setActiveIndex(index - 1)
            }
            return
          }
        },
        {
          rootMargin: `-${MARGIN}px`,
          threshold: 0,
        }
      )
      observer.observe(heading.el)
      return observer
    })
    setHeadings(headings)

    return () => {
      observers.forEach(o => o.disconnect())
    }
  }, [root])

  return (
    <div className="TocSpy">
      <header className="TocSpy__nav">
        <Button onClick={toggleOpen} title="Table of contents">
          <FaList color="var(--leko-foreground-dimmed)" />
        </Button>
      </header>
      <aside
        className={classNames([
          'TocSpy__list',
          'TocSpy__list--fixed',
          open ? 'TocSpy__list--open' : null,
        ])}
      >
        <h4
          className={classNames([
            'TocSpy__item',
            'TocSpy__list__heading',
            activeIndex === -1 ? 'TocSpy__item--active' : null,
          ])}
        >
          Table of Contents
        </h4>
        {headings.map((h, index) => (
          <div
            key={h.text + h.depth + (index === activeIndex)}
            className={classNames([
              'TocSpy__item',
              `TocSpy__item--level-${h.depth}`,
              index === activeIndex ? 'TocSpy__item--active' : null,
            ])}
          >
            <a href={`${h.slug}`} onClick={e => scrollTo(e, h, index)}>
              {h.text}
            </a>
          </div>
        ))}
      </aside>
    </div>
  )
}

// To use suspense
export default TocSpy
