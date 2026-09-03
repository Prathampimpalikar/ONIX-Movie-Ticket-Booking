import React from "react"
import { dummyShowsData } from '../assets/assets'
import MovieCard from '../component/MovieCard'
import BlurCircle from '../component/BlurCircle'

const Movie = () => {
  return (
    <div className='pt-32 px-6 md:px-16 lg:px-24 xl:px-44 min-h-[60vh]'>
      <div className='relative flex items-center justify-between pb-8'>
        <BlurCircle top='-20px' right='80px' />
        <h1 className='text-2xl md:text-3xl font-semibold text-white'>All Movies</h1>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
        {dummyShowsData.map((movie) => (
          <MovieCard key={movie._id || movie.id} movie={movie} />
        ))}
      </div>
    </div>
  )
}

export default Movie