const key = 'web-egg-prefers-color-scheme'
const windowGlobal = (typeof window !== 'undefined' && window) || null

export function getPrefersColorScheme() {
  return (
    windowGlobal?.localStorage.getItem(key) ??
    (windowGlobal?.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')
  )
}

export function setPrefersColorScheme(theme) {
  windowGlobal?.localStorage.setItem(key, theme)
}
