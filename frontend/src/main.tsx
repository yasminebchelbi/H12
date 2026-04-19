import L from 'leaflet'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// leaflet.heat (UMD) expects global L — assign before loading the plugin
;(globalThis as unknown as { L: typeof L }).L = L
await import('leaflet.heat/dist/leaflet-heat.js')

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
