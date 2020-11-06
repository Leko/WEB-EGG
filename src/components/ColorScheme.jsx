import React, { useCallback } from 'react'
import { FaMoon } from 'react-icons/fa'
import { FaSun } from 'react-icons/fa'
import { Button } from './Button'

export function ColorScheme(props) {
  const { theme, onChange } = props

  const handleChange = useCallback(() => {
    onChange(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  return (
    <Button onClick={handleChange}>
      {theme === 'dark' ? (
        <FaSun color="var(--leko-foreground-dimmed)" />
      ) : (
        <FaMoon color="var(--leko-foreground-dimmed)" />
      )}
    </Button>
  )
}
