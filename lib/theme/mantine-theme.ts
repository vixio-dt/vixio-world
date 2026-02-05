import { createTheme, virtualColor, MantineColorsTuple } from '@mantine/core'

// Brand color palette (cyan-based, matching current design)
const brand: MantineColorsTuple = [
  '#e0f7fa', // 0 - lightest
  '#b2ebf2',
  '#80deea',
  '#4dd0e1',
  '#26c6da',
  '#00bcd4', // 5 - base
  '#00acc1',
  '#0097a7',
  '#00838f',
  '#006064', // 9 - darkest
]

// Slate palette for text/backgrounds
const slate: MantineColorsTuple = [
  '#f8fafc', // 0 - lightest
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
  '#94a3b8',
  '#64748b', // 5 - base
  '#475569',
  '#334155',
  '#1e293b',
  '#0f172a', // 9 - darkest
]

export const theme = createTheme({
  // Primary color adapts to light/dark mode
  primaryColor: 'primary',
  
  colors: {
    brand,
    slate,
    // Virtual color that switches between brand variants for light/dark
    primary: virtualColor({
      name: 'primary',
      light: 'brand',
      dark: 'brand',
    }),
    // Virtual color for surface backgrounds
    surface: virtualColor({
      name: 'surface',
      light: 'slate',
      dark: 'slate',
    }),
  },
  
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  
  defaultRadius: 'md',
  
  // Consistent spacing scale
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  // Shadow tokens
  shadows: {
    xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
  
  // Component-specific overrides
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    Input: {
      defaultProps: {
        radius: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
})
