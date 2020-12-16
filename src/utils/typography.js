/* eslint-env node */
import Typography from 'typography'
import TypographyTheme from 'typography-theme-wordpress-2016'

TypographyTheme.overrideThemeStyles = () => {
  return {
    h1: {
      fontFamily: textFontFamily.join(','),
    },
    a: {
      boxShadow: `none`,
    },
    'a.social': {
      borderBottom: '1px solid currentColor',
    },
    'a.gatsby-resp-image-link': {
      borderBottom: 'none',
    },
    'a.anchor': {
      borderBottom: 'none',
    },
    small: {
      fontSize: '16px',
    },
    blockquote: {
      fontSize: TypographyTheme.baseFontSize,
    },
    ':not(pre)>code': {
      fontFamily: codeFontFamily.join(','),
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.58,
      letterSpacing: '-.003em',
      wordBreak: 'break-word',
      textRendering: 'optimizeLegibility',
      background: 'rgba(0, 0, 0, .05)',
      padding: '3px 4px',
      margin: '0 2px',
    },
  }
}

// Override base font for Japanese
// const FONT_FOR_JAPANESE = 'M PLUS Rounded 1c'
const textFontFamily = [
  'Avenir Next',
  'Helvetica Neue',
  'Segoe UI',
  'Helvetica',
  'Arial',
  'sans-serif',
]
const codeFontFamily = [
  'Menlo',
  'Monaco',
  '"Courier New"',
  'Courier',
  'monospace',
]
TypographyTheme.headerFontFamily = textFontFamily
TypographyTheme.bodyFontFamily = textFontFamily
TypographyTheme.baseFontSize = '16px'
TypographyTheme.headerWeight = 700

delete TypographyTheme.googleFonts

const typography = new Typography(TypographyTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
