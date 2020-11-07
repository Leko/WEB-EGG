import React from 'react'
import '../styles/Button.css'

export function Button(props) {
  const { onClick, title, children } = props
  return (
    <button onClick={onClick} title={title} className="Button">
      {children}
    </button>
  )
}
