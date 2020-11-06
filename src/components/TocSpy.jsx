import React, { useEffect, useState } from 'react'
import '../styles/TocSpy.css'

function slugify(raw) {
  return encodeURIComponent(
    raw
      .replace(/[./]/g, '')
      .replace(/ /g, '-')
      .toLowerCase()
  )
}

function classNames(list) {
  return list.filter(Boolean).join(' ')
}

export function TocSpy(props) {
  const { headings, maxDepth = 3 } = props
  const [activeIndex, setActiveIndex] = useState(-1)
  const headingsForDisplay = headings
    .filter(heading => heading.depth <= maxDepth)
    .map(h => ({
      ...h,
      slug: slugify(h.value),
    }))

  useEffect(() => {
    let prevMap = new Map()
    const observers = headingsForDisplay.map((heading, index) => {
      const targetEl = document.querySelector(
        `h${heading.depth} [href="#${slugify(heading.value)}"]`
      )
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
          rootMargin: '-200px',
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
      <aside className="TocSpy__list TocSpy__list--fixed">
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
            <a href={`#${h.slug}`}>{h.value}</a>
          </div>
        ))}
      </aside>
    </div>
  )
}
