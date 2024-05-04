import './App.css'
import Login from './layout/Login'
import Admin from './layout/Admin'
import Company from './layout/Company'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from './layout/Register'
import Home from './layout/Home'

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/company" element={<Company />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App