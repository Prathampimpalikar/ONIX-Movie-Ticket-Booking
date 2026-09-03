import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Film, ArrowRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import MovieCard from '../component/MovieCard'
import BlurCircle from '../component/BlurCircle'

const Favourite = () => {
  const { favorites } = useFavorites()
  const navigate = useNavigate()

  return (
    <div className='pt-32 px-6 md:px-16 lg:px-24 xl:px-44 min-h-[60vh]'>
      <div className='relative flex items-center justify-between pb-8 border-b border-gray-800 mb-8'>
        <BlurCircle top='-20px' right='80px' />
        <div className='flex items-center gap-3'>
          <Heart className='w-7 h-7 text-primary fill-primary' />
          <h1 className='text-2xl md:text-3xl font-semibold text-white'>
            Favorite Movies {favorites.length > 0 && <span className='text-sm text-gray-400 font-normal'>({favorites.length})</span>}
          </h1>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-center'>
          <div className='w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 shadow-inner'>
            <Heart className='w-10 h-10 text-gray-600' />
          </div>
          <h2 className='text-xl md:text-2xl font-medium text-white mb-2'>No Favorites Added Yet</h2>
          <p className='text-gray-400 text-sm md:text-base max-w-md mb-8'>
            Explore our collection of movies and click the heart icon on any movie to save it to your favorites list.
          </p>
          <button
            onClick={() => { navigate('/movie'); window.scrollTo(0, 0); }}
            className='flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dull text-white transition rounded-full font-medium text-sm cursor-pointer shadow-lg'
          >
            <Film className='w-4 h-4' />
            Explore Movies
            <ArrowRight className='w-4 h-4' />
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
          {favorites.map((movie) => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favourite