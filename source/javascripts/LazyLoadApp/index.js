// @flow
export default (images) => {
  const callback = function(entries, observer) { 
    for (let entry of entries) {
      if (entry.isIntersecting && !entry.target.src) {
        let target = entry.target
        target.setAttribute('src', target.getAttribute('data-src'))
      }
    }
  }
  const options = {
    root: null,
    rootMargin: '200px'
  }
  const observer = new IntersectionObserver(callback, options)

  images.forEach(el => observer.observe(el))
}
