import React, { useCallback } from 'react'
import { FaMoon } from 'react-icons/fa'
import { FaSun } from 'react-icons/fa'

export function ColorScheme(props) {
  const { theme, onChange } = props

  const handleChange = useCallback(() => {
    onChange(theme === 'dark' ? 'light' : 'dark')
  }, [theme])

  return (
    <button
      onClick={handleChange}
      style={{
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1.4rem',
      }}
    >
      {theme === 'dark' ? (
        <FaSun color="var(--leko-foreground-dimmed)" />
      ) : (
        <FaMoon color="var(--leko-foreground-dimmed)" />
      )}
    </button>
  )
}
