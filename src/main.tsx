import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import Landing from './Landing.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Landing />
    {/* <App /> */}
  </StrictMode>,
)
