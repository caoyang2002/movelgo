import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
// import ReactDOM from 'react-dom/client'
// import './index.css'
import 'src/static/styles/global.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
// const element = document.getElementById('root') || document.createElement('div')

// const root = ReactDOM.createRoot(element)
// root.render(
//   <React.StrictMode>
//     <HashRouter>
//       <App />
//     </HashRouter>
//   </React.StrictMode>
// )
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
