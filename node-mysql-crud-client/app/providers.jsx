'use client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6658d9' },
    background: { default: '#f7f8fc', paper: '#ffffff' },
    text: { primary: '#29283f', secondary: '#77758d' },
  },
  shape: { borderRadius: 9 },
  typography: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    button: { textTransform: 'none' },
  },
})

export default function Providers({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
