import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, Play, Heart, ArrowRight, ChevronLeft, ChevronRight, X, Clock, Calendar } from 'lucide-react'
import { dummyShowsData, dummyTrailers } from '../assets/assets'
import MovieCard from '../component/MovieCard'
import BlurCircle from '../component/BlurCircle'
import timeformat from '../lib/timeformat'
import { useFavorites } from '../context/FavoritesContext'
import _ReactPlayer from 'react-player'

const ReactPlayer = typeof _ReactPlayer === 'function' ? _ReactPlayer : (_ReactPlayer?.default || _ReactPlayer)

const MovieDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isFavorite, toggleFavorite } = useFavorites()
    const dateSectionRef = useRef(null)

    // Find movie by ID, or fallback to first dummy show
    const movie = dummyShowsData.find((m) => String(m._id || m.id) === String(id)) || dummyShowsData[0]
    const isFav = isFavorite(movie?._id || movie?.id)

    // Trailer modal state
    const [showTrailer, setShowTrailer] = useState(false)
    const [trailerUrl, setTrailerUrl] = useState('')

    // Generate upcoming 10 days for date picker
    const [dateList, setDateList] = useState([])
    const [selectedDate, setSelectedDate] = useState(null)
    const [dateStartIndex, setDateStartIndex] = useState(0)

    useEffect(() => {
        window.scrollTo(0, 0)

        // Generate next 14 days
        const dates = []
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        for (let i = 0; i < 14; i++) {
            const d = new Date()
            d.setDate(d.getDate() + i)
            dates.push({
                day: daysOfWeek[d.getDay()],
                date: d.getDate(),
                fullDate: d.toISOString().split('T')[0]
            })
        }
        setDateList(dates)
        setSelectedDate(dates[1] || dates[0])

        // Find relevant trailer or fallback
        if (movie.trailer_url) {
            setTrailerUrl(movie.trailer_url)
        } else {
            const matchingTrailer = dummyTrailers.find((t) => t.title?.toLowerCase().includes(movie.title.toLowerCase())) || dummyTrailers[0]
            setTrailerUrl(matchingTrailer?.videoUrl || 'https://www.youtube.com/watch?v=JfVOs4VSpmA')
        }
    }, [id, movie.title, movie.trailer_url])

    const handleBuyTicketsClick = () => {
        dateSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleBookNow = () => {
        if (selectedDate) {
            navigate(`/movie/${movie._id || movie.id}/${selectedDate.fullDate}`)
        }
    }

    // Recommended movies (exclude current movie)
    const recommendedMovies = dummyShowsData.filter((m) => String(m._id || m.id) !== String(movie._id || movie.id)).slice(0, 4)

    const visibleDates = dateList.slice(dateStartIndex, dateStartIndex + 6)

    const handlePrevDates = () => {
        if (dateStartIndex > 0) {
            setDateStartIndex(prev => Math.max(0, prev - 1))
        }
    }

    const handleNextDates = () => {
        if (dateStartIndex + 6 < dateList.length) {
            setDateStartIndex(prev => Math.min(dateList.length - 6, prev + 1))
        }
    }

    const formattedReleaseDate = movie.release_date
        ? new Date(movie.release_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        : '2026'

    return (
        <div className='relative min-h-screen text-white pt-24 md:pt-28 pb-16 overflow-hidden'>
            {/* Background Backdrop Glow */}
            <div className='absolute top-0 left-0 w-full h-[550px] overflow-hidden -z-10 opacity-30'>
                <img
                    src={movie.backdrop_path || movie.poster_path}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className='w-full h-full object-cover blur-2xl scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]' />
            </div>

            <div className='px-6 md:px-16 lg:px-24 xl:px-44 max-w-7xl mx-auto'>
                <BlurCircle top='80px' right='40px' />

                {/* Top Section: Movie Hero / Details */}
                <div className='flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-14 pt-6'>
                    {/* Poster Card */}
                    <div className='relative shrink-0 group'>
                        <img
                            src={movie.poster_path || movie.backdrop_path}
                            alt={movie.title}
                            referrerPolicy="no-referrer"
                            className='w-64 sm:w-72 md:w-80 h-[380px] sm:h-[420px] md:h-[450px] rounded-2xl shadow-2xl object-cover object-top border border-white/10'
                        />
                        <div className='absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none' />
                    </div>

                    {/* Movie Info */}
                    <div className='flex-1 flex flex-col items-center md:items-start text-center md:text-left'>
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white'>
                            {movie.title}
                        </h1>

                        {/* IMDb Rating */}
                        <div className='flex items-center gap-2 mt-3 text-sm md:text-base'>
                            <Star className='w-5 h-5 text-primary fill-primary' />
                            <span className='font-semibold text-white'>
                                {movie.vote_average?.toFixed(1) || '8.5'} IMDb Rating
                            </span>
                        </div>

                        {/* Overview */}
                        <p className='text-gray-300 text-sm md:text-base leading-relaxed mt-4 max-w-2xl'>
                            {movie.overview}
                        </p>

                        {/* Metadata tags */}
                        <div className='flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 text-xs md:text-sm text-gray-300'>
                            <span className='flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full'>
                                <Clock className='w-3.5 h-3.5 text-primary' />
                                {timeformat(movie.runtime || 120)}
                            </span>
                            <span>•</span>
                            <span className='bg-white/5 border border-white/10 px-3 py-1 rounded-full'>
                                {movie.genres?.map(g => g.name).join(' | ') || 'Action | Adventure'}
                            </span>
                            <span>•</span>
                            <span className='flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-full'>
                                <Calendar className='w-3.5 h-3.5 text-primary' />
                                {formattedReleaseDate}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8'>
                            <button
                                onClick={() => setShowTrailer(true)}
                                className='flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-full font-medium text-sm transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md hover:scale-105'
                            >
                                <Play className='w-4 h-4 fill-white' />
                                Watch Trailer
                            </button>

                            <button
                                onClick={handleBuyTicketsClick}
                                className='px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-full font-medium text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-primary/30 hover:scale-105'
                            >
                                Buy Tickets
                            </button>

                            <button
                                onClick={() => toggleFavorite(movie)}
                                title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                                aria-label="Toggle Favorite"
                                className={`p-3 rounded-full border transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md hover:scale-110 ${isFav
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-white/10 border-white/15 text-gray-300 hover:text-primary hover:border-primary'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isFav ? 'fill-primary' : ''}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section: Your Favorite Cast */}
                {movie.casts && movie.casts.length > 0 && (
                    <div className='mt-16 md:mt-20'>
                        <h2 className='text-xl md:text-2xl font-semibold text-white mb-6 text-left'>
                            Your Favorite Cast
                        </h2>
                        <div className='flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none'>
                            {movie.casts.slice(0, 10).map((cast, index) => (
                                <div key={index} className='flex flex-col items-center shrink-0 group cursor-pointer'>
                                    <div className='w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-gray-700/60 group-hover:border-primary transition duration-300 shadow-md'>
                                        <img
                                            src={cast.profile_path}
                                            alt={cast.name}
                                            referrerPolicy="no-referrer"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cast.name)}&background=1f2937&color=fff&size=200`
                                            }}
                                            className='w-full h-full object-cover group-hover:scale-110 transition duration-300'
                                        />
                                    </div>
                                    <p className='text-xs md:text-sm font-medium text-gray-200 mt-2 text-center truncate w-24'>
                                        {cast.name}
                                    </p>
                                    <p className='text-[11px] text-gray-400 text-center truncate w-24'>
                                        {cast.character || 'Star Cast'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section: Choose Date (Booking) */}
                <div
                    ref={dateSectionRef}
                    className='mt-14 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-red-950/20 via-neutral-900/70 to-red-950/20 border border-red-900/30 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8'
                >
                    <div className='flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto'>
                        <h3 className='text-xl font-semibold text-white whitespace-nowrap'>
                            Choose Date
                        </h3>

                        {/* Date Carousel */}
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={handlePrevDates}
                                disabled={dateStartIndex === 0}
                                className='p-2 rounded-lg border border-gray-800 bg-gray-900/80 text-gray-300 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer'
                            >
                                <ChevronLeft className='w-5 h-5 text-primary' />
                            </button>

                            <div className='flex items-center gap-2.5 sm:gap-3 overflow-hidden'>
                                {visibleDates.map((item, index) => {
                                    const isSelected = selectedDate?.fullDate === item.fullDate
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedDate(item)}
                                            className={`flex flex-col items-center justify-center w-14 h-16 sm:w-16 sm:h-20 rounded-xl transition-all duration-200 cursor-pointer ${isSelected
                                                    ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105 font-bold'
                                                    : 'bg-black/40 border border-gray-800 text-gray-300 hover:border-gray-600 hover:text-white'
                                                }`}
                                        >
                                            <span className='text-xs font-medium'>{item.day}</span>
                                            <span className='text-lg sm:text-xl font-bold mt-0.5'>{item.date}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={handleNextDates}
                                disabled={dateStartIndex + 6 >= dateList.length}
                                className='p-2 rounded-lg border border-gray-800 bg-gray-900/80 text-gray-300 hover:text-white hover:border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer'
                            >
                                <ChevronRight className='w-5 h-5 text-primary' />
                            </button>
                        </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                        onClick={handleBookNow}
                        className='w-full sm:w-auto px-10 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-full font-semibold text-base shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-200 cursor-pointer text-center'
                    >
                        Book Now
                    </button>
                </div>

                {/* Section: You May Also Like */}
                <div className='mt-16 md:mt-20'>
                    <div className='flex items-center justify-between pb-8'>
                        <h2 className='text-xl md:text-2xl font-semibold text-white'>
                            You May Also Like
                        </h2>
                        <Link
                            to='/movie'
                            onClick={() => window.scrollTo(0, 0)}
                            className='group flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition cursor-pointer'
                        >
                            View All
                            <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition duration-200' />
                        </Link>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
                        {recommendedMovies.map((recMovie) => (
                            <MovieCard key={recMovie._id || recMovie.id} movie={recMovie} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4'>
                    <div className='relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden border border-gray-800 shadow-2xl'>
                        <button
                            onClick={() => setShowTrailer(false)}
                            className='absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer'
                        >
                            <X className='w-6 h-6' />
                        </button>
                        <div className='aspect-video w-full'>
                            <ReactPlayer
                                url={trailerUrl}
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

export default MovieDetail