// importだと静的に解決されてpolifillにならないのでrequire
import 'intersection-observer'

export default function lazyLoader (images: NodeList<HTMLElement>): void {
  const callback = function(entries, observer) { 
    for (let entry of entries) {
      if (entry.isIntersecting && !entry.target.src) {
        let target = entry.target
        target.setAttribute('src', target.getAttribute('data-src'))
        target.addEventListener('load', () => {
          target.removeAttribute('style')
        })
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
