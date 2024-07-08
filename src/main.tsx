import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AudioContextProvider } from './hooks/AudioContext';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AudioContextProvider>
      <App />
    </AudioContextProvider>
  </React.StrictMode>,
)
