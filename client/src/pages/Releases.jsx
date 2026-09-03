import React, { useState } from 'react'
import { Film, Calendar, Star, Play, Sparkles } from 'lucide-react'
import { dummyShowsData, dummyTrailers } from '../assets/assets'
import MovieCard from '../component/MovieCard'
import BlurCircle from '../component/BlurCircle'
import _ReactPlayer from 'react-player'

const ReactPlayer = typeof _ReactPlayer === 'function' ? _ReactPlayer : (_ReactPlayer?.default || _ReactPlayer)

const Releases = () => {
    const [selectedGenre, setSelectedGenre] = useState('All')
    const [selectedTrailer, setSelectedTrailer] = useState(null)

    const genres = ['All', 'Action', 'Adventure', 'Sci-Fi', 'Horror', 'Family', 'Thriller']

    const filteredMovies = selectedGenre === 'All'
        ? dummyShowsData
        : dummyShowsData.filter((m) =>
            m.genres?.some((g) => g.name?.toLowerCase().includes(selectedGenre.toLowerCase()))
        )

    return (
        <div className='relative min-h-screen text-white pt-28 md:pt-32 pb-24 px-6 md:px-16 lg:px-24 xl:px-36 max-w-7xl mx-auto'>
            <BlurCircle top='80px' right='80px' />

            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-800 mb-10'>
                <div>
                    <div className='flex items-center gap-3 mb-2'>
                        <Film className='w-8 h-8 text-primary' />
                        <h1 className='text-3xl md:text-4xl font-bold text-white'>New & Upcoming Releases</h1>
                    </div>
                    <p className='text-gray-400 text-sm md:text-base max-w-2xl'>
                        Browse the latest cinematic releases, upcoming blockbusters, and official trailer previews.
                    </p>
                </div>
            </div>

            {/* Genre Filter Pills */}
            <div className='flex items-center gap-2.5 overflow-x-auto pb-6 scrollbar-none mb-8'>
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                            selectedGenre === genre
                                ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                : 'bg-neutral-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                        }`}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            {/* Movies Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
                {filteredMovies.map((movie) => (
                    <MovieCard key={movie._id || movie.id} movie={movie} />
                ))}
            </div>

            {/* Trailer Modal */}
            {selectedTrailer && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4'>
                    <div className='relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl'>
                        <button
                            onClick={() => setSelectedTrailer(null)}
                            className='absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer'
                        >
                            ✕
                        </button>
                        <div className='aspect-video w-full'>
                            <ReactPlayer
                                url={selectedTrailer}
                                controls={true}
                                playing={true}
                                width='100%'
                                height='100%'
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Releases
