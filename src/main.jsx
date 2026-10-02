import React from 'react'
import ReactDOM from 'react-dom/client'

// /autorizar/:id se sirve con su propia entrada (sin el resto del sitio).
const loadRoot = window.location.pathname.startsWith('/autorizar/')
  ? import('./pages/autorizar/AutorizarPagoRoot.jsx')
  : import('./index.css').then(() => import('./i18n')).then(() => import('./App.jsx'))

loadRoot.then((module) => {
  const Root = module.default
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>,
  )
})
