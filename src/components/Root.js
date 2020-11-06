import React, { useState, useCallback } from 'react'
import { Provider } from './ColorSchemeContext'
import { getPrefersColorScheme, setPrefersColorScheme } from '../utils/color'

export function Root(props) {
  const { children } = props
  const [theme, setTheme] = useState(getPrefersColorScheme())

  const changeTheme = useCallback(
    theme => {
      setTheme(theme)
      setPrefersColorScheme(theme)
    },
    [setTheme]
  )

  return <Provider value={{ theme, changeTheme }}>{children}</Provider>
}
