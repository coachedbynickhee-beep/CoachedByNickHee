import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Landing from './Landing.jsx'

function Root() {
  // Login is hidden from the public page. Coach/clients can still reach it at
  // coachedbynickhee.app/#login (needed for Coach mode → Edit page).
  const [showApp, setShowApp] = useState(window.location.hash === '#login')
  if (showApp) return <App />
  return <Landing onSignIn={() => setShowApp(true)} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
