import React from 'react'
import { Routes, Route } from 'react-router-dom'

import molecule, { create } from '@dtinsight/molecule'
import '@dtinsight/molecule/esm/style/mo.css'

import extensions from './extensions'
import MoveWorkbench from './views/Workbench'
// import './App.css'
// import dotenv from 'dotenv'
// dotenv.config()
console.log('env app', process.env.REACT_APP_RPC_PORT)
;(window as any).__DEVELOPMENT__ = false

function NotFound() {
  return (
    <main style={{ padding: '1rem' }}>
      <p className="text-black-500">There's nothing here!</p>
    </main>
  )
}

const movelgoInst = create({
  extensions,
})

// movelgoInst.onBeforeInit(() => {
//   molecule.builtin.inactiveModule('activityBarData')
// })
movelgoInst.onBeforeInit(() =>
  molecule.builtin.inactiveConstant('EXPLORER_TOGGLE_VERTICAL')
)

// const DefaultWorkbench = () => moleculeInst.render(<Workbench />)
const CustomWorkbench = () => movelgoInst.render(<MoveWorkbench />)

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CustomWorkbench />} />
        {/* <Route path="vscode" element={<DefaultWorkbench />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
