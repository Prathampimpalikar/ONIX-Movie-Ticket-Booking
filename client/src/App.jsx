import React from 'react'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/home'
import Movie from './pages/Movie'
import MovieDetail from './pages/MovieDetail'
import SeatLayout from './pages/SeatLayout'
import MyBooking from './pages/MyBooking'
import Favourite from './pages/Favourite'
import Theatres from './pages/Theatres'
import Releases from './pages/Releases'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const isAdminRouter = useLocation().pathname.startsWith('/admin')
  return (
    <div className='min-h-screen flex flex-col justify-between bg-[#050505] text-white'>
      <Toaster />
      {!isAdminRouter && <Navbar />}
      <div className='flex-1'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movie' element={<Movie />} />
          <Route path='/movie/:id' element={<MovieDetail />} />
          <Route path='/movie/:id/:date' element={<SeatLayout />} />
          <Route path='/mybooking' element={<MyBooking />} />
          <Route path='/Favourite' element={<Favourite />} />
          <Route path='/favorite' element={<Favourite />} />
          <Route path='/favorites' element={<Favourite />} />
          <Route path='/theatre' element={<Theatres />} />
          <Route path='/theatres' element={<Theatres />} />
          <Route path='/releases' element={<Releases />} />
        </Routes>
      </div>
      {!isAdminRouter && <Footer />}
    </div>
  )
}

export default App
