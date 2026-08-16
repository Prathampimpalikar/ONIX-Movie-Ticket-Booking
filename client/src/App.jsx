import React from 'react'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Movie from './pages/Movie'
import MovieDetails from './pages/MovieDetail'
import SeatLayout from './pages/SeatLayout'
import MyBooking from './pages/MyBooking'
import Favourite from './pages/Favourite'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const isAdminRouter = useLocation().pathname.startsWith('/admin')
  return (
    <>
      <Toaster />
      {!isAdminRouter && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie' element={<Movie />} />
        <Route path='/movie/:id' element={<MovieDetails />} />
        <Route path='/movie/:id/:date' element={<SeatLayout />} />
        <Route path='/mybooking' element={<MyBooking />} />
        <Route path='/Favourite' element={<Favourite />} />
      </Routes>
      {!isAdminRouter && <Footer />}
    </>
  )
}

export default App
