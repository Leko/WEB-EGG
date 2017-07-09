// @flow
type IntersectionObserverInit = {
  root: string | null,
  rootMargin: string,
}
declare class IntersectionObserver {
  constructor(function, IntersectionObserverInit): IntersectionObserver;
  observe(HTMLElement): void;
}

export default function lazyLoader (images: NodeList<HTMLElement>): void {
  const callback = function(entries, observer) { 
    for (let entry of entries) {
      if (entry.isIntersecting && !entry.target.src) {
        let target = entry.target
        target.setAttribute('src', target.getAttribute('data-src'))
      }
    }
  }
  const options: IntersectionObserverInit = {
    root: null,
    rootMargin: '200px'
  }
  const observer: IntersectionObserver = new IntersectionObserver(callback, options)

  images.forEach(el => observer.observe(el))
}
