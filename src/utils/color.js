const key = 'web-egg-prefers-color-scheme'

export function getPrefersColorScheme() {
  return localStorage?.getItem(key)
}

export function setPrefersColorScheme(theme) {
  localStorage.setItem(key, theme)
}
