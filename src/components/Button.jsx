import React from 'react'
import '../styles/Button.css'

export function Button(props) {
  const { onClick, children } = props
  return (
    <button onClick={onClick} className="Button">
      {children}
    </button>
  )
}
