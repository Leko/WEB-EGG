const key = 'web-egg-prefers-color-scheme'
const windowGlobal = (typeof window !== 'undefined' && window) || null

export function getPrefersColorScheme() {
  return windowGlobal?.localStorage.getItem(key)
}

export function setPrefersColorScheme(theme) {
  windowGlobal?.localStorage.setItem(key, theme)
}
