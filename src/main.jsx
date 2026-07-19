import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Landing from './Landing.jsx'

function Root() {
  const [showApp, setShowApp] = useState(false)
  if (showApp) return <App />
  return <Landing onSignIn={() => setShowApp(true)} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
