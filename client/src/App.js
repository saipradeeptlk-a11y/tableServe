import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import WaiterPage from './pages/WaiterPage'
import KitchenPage from './pages/KitchenPage'
import AdminPage from './pages/AdminPage'
import SetupPage from './pages/SetupPages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/waiter" element={<WaiterPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/setup" element={<SetupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
