import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { CalendarIcon, ClockIcon, ArrowRight, Ticket, Play, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import _ReactPlayer from 'react-player'

const ReactPlayer = typeof _ReactPlayer === 'function' ? _ReactPlayer : (_ReactPlayer?.default || _ReactPlayer)

const heroMovies = [
    {
        id: 'spiderman',
        title: 'Spider-Man:',
        subtitle: 'Brand New Day',
        titleGradient: 'from-red-500 via-rose-500 to-red-400 drop-shadow-[0_4px_12px_rgba(226,1,55,0.35)]',
        subGradient: 'from-amber-300 via-yellow-400 to-orange-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]',
        genre: 'Action | Adventure | Sci-Fi',
        year: '2026',
        duration: '2h 48m',
        videoUrl: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
        bgImage: assets.spiderManBg,
        canBookTickets: true,
        buttonText: 'Buy Tickets',
        status: 'In Theaters',
        targetRoute: '/movie/spiderman-brand-new-day'
    },
    {
        id: 'doomsday',
        title: 'Avengers:',
        subtitle: 'Doomsday',
        titleGradient: 'from-red-600 via-rose-500 to-red-400 drop-shadow-[0_4px_12px_rgba(226,1,55,0.35)]',
        subGradient: 'from-emerald-400 via-teal-300 to-green-400 drop-shadow-[0_4px_12px_rgba(16,185,129,0.3)]',
        genre: 'Action | Adventure | Sci-Fi',
        year: '2026',
        duration: '2h 45m',
        videoUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        bgImage: assets.avengersBg,
        canBookTickets: false,
        buttonText: 'Explore Movies',
        status: 'Coming Soon',
        targetRoute: '/movie'
    }
]

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showTrailer, setShowTrailer] = useState(false)
    const navigate = useNavigate()

    const currentHero = heroMovies[currentIndex]

    // 15-second automatic rotation between Spider-Man and Avengers: Doomsday
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroMovies.length)
        }, 15000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='relative w-full h-screen overflow-hidden flex items-center bg-[#050505] text-white'>
            {/* Cinematic High-Res Backdrop Image with Smooth Transitions */}
            <div className='absolute top-0 right-0 w-full md:w-[65%] lg:w-[60%] h-full overflow-hidden flex items-center justify-end'>
                <img
                    key={currentHero.id}
                    src={currentHero.bgImage}
                    alt={currentHero.title}
                    className={`w-full h-full ${currentHero.id === 'spiderman' ? 'object-cover object-top md:object-center' : 'object-cover object-center'} opacity-80 scale-100 transition-all duration-700`}
                />
                {/* Edge Gradient Overlays */}
                <div className='absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent w-full md:w-2/3 pointer-events-none' />
                <div className='absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent h-44 top-auto pointer-events-none' />
                <div className='absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-transparent h-32 pointer-events-none' />
            </div>

            {/* Left Content Container */}
            <div className='relative z-10 flex flex-col items-start gap-4 px-6 md:px-16 lg:px-24 xl:px-36 max-w-2xl mt-12 transition-all duration-700'>
                <div className='flex items-center gap-3'>
                    <img src={assets.marvelLogo} alt="Marvel Studios" className="max-h-10 lg:h-11 drop-shadow-md" />
                    <span className={`text-xs px-3 py-0.5 rounded-full font-medium ${
                        currentHero.canBookTickets
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                        ● {currentHero.status}
                    </span>
                </div>

                <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold leading-tight tracking-tight'>
                    <span className={`bg-gradient-to-r ${currentHero.titleGradient} bg-clip-text text-transparent`}>
                        {currentHero.title}
                    </span>
                    <br />
                    <span className={`whitespace-nowrap bg-gradient-to-r ${currentHero.subGradient} bg-clip-text text-transparent`}>
                        {currentHero.subtitle}
                    </span>
                </h1>

                <div className='flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base font-medium'>
                    <span className='bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10'>
                        {currentHero.genre}
                    </span>
                    <div className='flex items-center gap-1.5'>
                        <CalendarIcon className='w-4 h-4 text-primary' />
                        <span>{currentHero.year}</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <ClockIcon className='w-4 h-4 text-primary' />
                        <span>{currentHero.duration}</span>
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-4 mt-4'>
                    <button
                        onClick={() => {
                            navigate(currentHero.targetRoute)
                            window.scrollTo(0, 0)
                        }}
                        className='flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-full font-semibold transition cursor-pointer shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 duration-200'
                    >
                        {currentHero.canBookTickets ? (
                            <>
                                <Ticket className='w-4 h-4' /> Buy Tickets
                            </>
                        ) : (
                            <>
                                Explore Movies <ArrowRight className='w-4 h-4' />
                            </>
                        )}
                    </button>

                    {/* Watch Trailer Button */}
                    <button
                        onClick={() => setShowTrailer(true)}
                        className='flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-full font-medium text-sm transition-all duration-200 cursor-pointer backdrop-blur-md shadow-md hover:scale-105 active:scale-95'
                    >
                        <Play className='w-4 h-4 fill-white' />
                        Watch Trailer
                    </button>
                </div>
            </div>

            {/* Hero Carousel Navigation Indicators */}
            <div className='absolute bottom-8 left-6 md:left-16 lg:left-36 z-20 flex items-center gap-3'>
                {heroMovies.map((movie, index) => (
                    <button
                        key={movie.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all duration-300 cursor-pointer ${
                            currentIndex === index
                                ? 'bg-white/20 border-white/40 text-white shadow-md backdrop-blur-md scale-105'
                                : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:border-white/25 backdrop-blur-sm'
                        }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-primary' : 'bg-gray-500'}`} />
                        {movie.id === 'spiderman' ? 'Spider-Man' : 'Doomsday'}
                    </button>
                ))}
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
                                url={currentHero.videoUrl}
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

export default HeroSection