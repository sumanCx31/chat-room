import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterConfig from './config/router.config'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterConfig />
  </StrictMode>,
)
