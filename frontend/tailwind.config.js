/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'on-background': '#1f1b16',
        'on-secondary-fixed': '#00201f',
        surface: '#fff8f3',
        'on-surface': '#1f1b16',
        'on-primary-fixed-variant': '#004e5c',
        'surface-bright': '#fff8f3',
        'surface-dim': '#e1d9d1',
        'secondary-container': '#8df0ee',
        'surface-variant': '#eae1d9',
        'on-tertiary': '#ffffff',
        'inverse-surface': '#34302a',
        'tertiary-fixed': '#ffdad8',
        'primary-fixed': '#aaedff',
        'on-tertiary-container': '#fff2f1',
        'on-primary-fixed': '#001f26',
        'surface-container-lowest': '#ffffff',
        'on-primary-container': '#e3f9ff',
        tertiary: '#b10826',
        'on-tertiary-fixed-variant': '#92001c',
        'on-primary': '#ffffff',
        'inverse-on-surface': '#f8efe7',
        'error-container': '#ffdad6',
        'secondary-fixed': '#90f3f1',
        'tertiary-container': '#d52c3b',
        secondary: '#006a68',
        primary: '#006071',
        'on-secondary-container': '#006e6d',
        'primary-container': '#007b8f',
        error: '#ba1a1a',
        'primary-fixed-dim': '#7ad3e9',
        outline: '#6e797c',
        'on-tertiary-fixed': '#410007',
        'tertiary-fixed-dim': '#ffb3b1',
        'on-error-container': '#93000a',
        'on-surface-variant': '#3e484b',
        'on-secondary-fixed-variant': '#00504f',
        'surface-tint': '#006879',
        'on-secondary': '#ffffff',
        'inverse-primary': '#7ad3e9',
        'secondary-fixed-dim': '#73d6d4',
        'surface-container': '#f5ece4',
        background: '#fff8f3',
        'on-error': '#ffffff',
        'surface-container-highest': '#eae1d9',
        'surface-container-low': '#fbf2ea',
        'surface-container-high': '#f0e7df',
        'outline-variant': '#bec8cc'
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        label: ['Manrope', 'sans-serif']
      }
    }
  },
  plugins: []
}
