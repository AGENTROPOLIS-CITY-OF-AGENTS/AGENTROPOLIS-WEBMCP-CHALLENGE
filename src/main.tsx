import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/600.css'
import '@fontsource/orbitron/600.css'
import '@fontsource/orbitron/800.css'
import { App } from './App'
import './styles.css'
import { AmbientMediaProvider } from './media/AmbientMediaProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AmbientMediaProvider><App /></AmbientMediaProvider>
  </StrictMode>,
)
