import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Heart } from 'lucide-react'
import timeformat from '../lib/timeformat'
import { useFavorites } from '../context/FavoritesContext'

const MovieCard = ({ movie }) => {
    const navigate = useNavigate()
    const { isFavorite, toggleFavorite } = useFavorites()
    const isFav = isFavorite(movie?._id || movie?.id)

    return (
        <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-64'>
            <div className='relative'>
                <img
                    onClick={() => { navigate(`/movie/${movie._id || movie.id}`); window.scrollTo(0, 0) }}
                    src={movie.backdrop_path}
                    alt={movie.title}
                    className='rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer'
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(movie)
                    }}
                    title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                    aria-label="Toggle Favorite"
                    className='absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all duration-200 cursor-pointer shadow-md'
                >
                    <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isFav ? 'fill-primary text-primary' : 'text-white hover:text-primary'}`} />
                </button>
            </div>

            <p className='font-semibold mt-2 truncate text-white'>{movie.title}</p>
            <p className='text-sm text-gray-400 mt-2'>
                {new Date(movie.release_date).getFullYear()} . {movie.genres?.slice(0, 2).map(genre => genre.name).join(" | ")} . {timeformat(movie.runtime)}
            </p>
            <div className='flex items-center justify-between mt-2'>
                <button
                    onClick={() => { navigate(`/movie/${movie._id || movie.id}`); window.scrollTo(0, 0) }}
                    className='px-4 py-2 text-xs bg-primary hover:bg-primary-dull text-white transition rounded-full font-medium cursor-pointer'
                >
                    Buy ticket
                </button>
                <p className='flex items-center gap-1 text-sm text-white'>
                    <Star className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average?.toFixed(1)}
                </p>
            </div>
        </div>
    )
}

export default MovieCard
