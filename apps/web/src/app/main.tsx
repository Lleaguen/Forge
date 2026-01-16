import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
// main.tsx
import '../styles/globals.css'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <App />
  </React.StrictMode>
)

// import React from 'react'
// import ReactDOM from 'react-dom/client'

// console.log('MAIN TSX LOADED');

// const root = document.getElementById('root')
// console.log('ROOT:', root)

// ReactDOM.createRoot(root!).render(
//   <div style={{ color: 'red' }}>
//     VITE APP OK
//   </div>
// )
