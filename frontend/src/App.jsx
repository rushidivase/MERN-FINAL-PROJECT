import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import NavbarComponent from './components/NavbarComponent'
import './App.css'
import Footer from './components/Footer'
import SignUp from './components/SignUp'
import PrivateComponent from './components/PrivateComponent'
import Login from './components/Login'
import AddProduct from './components/AddProduct'
import ProductListingComponent from './components/ProductListingComponent'
import ProfileComponent from './components/ProfileComponent'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavbarComponent />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path="/" element={<ProductListingComponent />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/update/:id" element={<AddProduct />} />
            <Route path="/logout" element={<h1>Logout Component</h1>} />
            <Route path="/profiles" element={<ProfileComponent />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App