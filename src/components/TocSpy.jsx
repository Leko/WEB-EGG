import React, { useEffect, useState, useCallback } from 'react'
import { FaList } from 'react-icons/fa'
import Slugger from 'github-slugger'
import { Button } from './Button'
import '../styles/TocSpy.css'

function slugify(raw) {
  return encodeURIComponent(Slugger.slug(raw))
}

function classNames(list) {
  return list.filter(Boolean).join(' ')
}

const MARGIN = 200

export function TocSpy(props) {
  const { headings, maxDepth = 3 } = props
  const [activeIndex, setActiveIndex] = useState(-1)
  const [open, setOpen] = useState(false)
  const headingsForDisplay = headings
    .filter(heading => heading.depth <= maxDepth)
    .map(h => ({
      ...h,
      slug: slugify(h.value),
    }))

  const toggleOpen = useCallback(() => {
    setOpen(before => !before)
  })
  const scrollTo = (e, { depth, slug }, index) => {
    const targetEl = document.querySelector(`h${depth} [href="#${slug}"]`)
      .parentElement
    e.preventDefault()
    history.pushState({}, document.title, `#${slug}`)
    window.scrollTo({
      left: 0,
      top: Math.max(0, targetEl.offsetTop - MARGIN + 1),
    })
    requestAnimationFrame(() => {
      setActiveIndex(index)
    })
  }

  useEffect(() => {
    let prevMap = new Map()
    const observers = headingsForDisplay.map((heading, index) => {
      const targetEl = document.querySelector(
        `h${heading.depth} [href="#${heading.slug}"]`
      )
      if (!targetEl) {
        throw new Error(
          `Unknown element for ${heading.value}, h${heading.depth} [href="#${heading.slug}"]`
        )
      }
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
      observer.observe(targetEl)
      return observer
    })

    return () => {
      observers.forEach(o => o.disconnect())
    }
  }, [headings])

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
        {headingsForDisplay.map((h, index) => (
          <div
            key={h.value + (index === activeIndex)}
            className={classNames([
              'TocSpy__item',
              `TocSpy__item--level-${h.depth}`,
              index === activeIndex ? 'TocSpy__item--active' : null,
            ])}
          >
            <a href={`#${h.slug}`} onClick={e => scrollTo(e, h, index)}>
              {h.value}
            </a>
          </div>
        ))}
      </aside>
    </div>
  )
}

// To use suspense
export default TocSpy
