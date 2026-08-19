import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { CalendarIcon, ClockIcon, ArrowRight, Ticket, Volume2, VolumeX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const heroMovies = [
    {
        id: 'spiderman',
        title: 'SpiderMan:',
        subtitle: 'Brand New Day',
        titleGradient: 'from-red-500 via-rose-500 to-red-400 drop-shadow-[0_4px_12px_rgba(226,1,55,0.35)]',
        subGradient: 'from-amber-300 via-yellow-400 to-orange-400 drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]',
        genre: 'Action | Adventure | Sci-Fi',
        year: '2026',
        duration: '2h 48m',
        videoId: 'xa9Aqo1lmZo',
        bgImage: assets.spiderManBg,
        canBookTickets: true,
        buttonText: 'Buy Tickets',
        status: 'In Theaters'
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
        videoId: 'xLYuvLspFgQ',
        bgImage: assets.backgroundImage,
        canBookTickets: false,
        buttonText: 'Explore Movies',
        status: 'Coming Soon'
    }
]

const HeroSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isMuted, setIsMuted] = useState(true)
    const iframeRef = useRef(null)
    const navigate = useNavigate()

    const currentHero = heroMovies[currentIndex]

    // 15-second automatic rotation between Spider-Man and Avengers: Doomsday
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % heroMovies.length)
        }, 15000)
        return () => clearInterval(interval)
    }, [])

    const sendIframeCommand = (func, args = []) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({ event: 'command', func, args }),
                '*'
            )
        }
    }

    const toggleSound = () => {
        const nextMuted = !isMuted
        setIsMuted(nextMuted)
        if (!nextMuted) {
            sendIframeCommand('unMute')
            sendIframeCommand('setVolume', [100])
            sendIframeCommand('playVideo')
        } else {
            sendIframeCommand('mute')
        }
    }

    const handleIframeLoad = () => {
        if (!isMuted) {
            setTimeout(() => {
                sendIframeCommand('unMute')
                sendIframeCommand('setVolume', [100])
                sendIframeCommand('playVideo')
            }, 300)
        }
    }

    return (
        <div className='relative w-full h-screen overflow-hidden flex items-center bg-[#050505] text-white'>
            {/* Right-Half High-Quality Background Video for active movie */}
            <div className='absolute top-0 right-0 w-full md:w-[60%] lg:w-[56%] h-full overflow-hidden pointer-events-none'>
                <iframe
                    ref={iframeRef}
                    key={`${currentHero.videoId}-${isMuted ? 'muted' : 'unmuted'}`}
                    onLoad={handleIframeLoad}
                    className='w-full h-[150%] -mt-[12%] scale-150 md:scale-115 object-cover pointer-events-none transition-all duration-1000'
                    style={{ filter: 'brightness(1.15) contrast(1.12) saturate(1.28)' }}
                    src={`https://www.youtube-nocookie.com/embed/${currentHero.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${currentHero.videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&vq=hd1080&hd=1`}
                    title={`${currentHero.title} ${currentHero.subtitle} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />

                {/* Seamless Edge Blends for the Video */}
                <div className='absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent pointer-events-none w-1/3' />
                <div className='absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none h-32 top-auto' />
                <div className='absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-transparent pointer-events-none h-24' />
            </div>

            {/* Floating Audio / Sound Toggle Control in the Trailer view */}
            <div className='absolute bottom-8 right-6 md:right-16 z-30'>
                <button
                    onClick={toggleSound}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full backdrop-blur-md border text-xs font-semibold shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
                        !isMuted
                            ? 'bg-primary/90 border-primary text-white shadow-primary/30'
                            : 'bg-black/70 hover:bg-black/90 border-white/20 text-gray-200 hover:text-white'
                    }`}
                >
                    {!isMuted ? (
                        <>
                            <div className='flex items-end gap-0.5 h-3.5'>
                                <span className='w-1 bg-white rounded-full animate-pulse h-3.5'></span>
                                <span className='w-1 bg-white rounded-full animate-bounce h-2'></span>
                                <span className='w-1 bg-white rounded-full animate-pulse h-3'></span>
                            </div>
                            <Volume2 className='w-4 h-4 text-white' />
                            <span>Movie Sound: <span className='text-white font-bold'>ON</span></span>
                        </>
                    ) : (
                        <>
                            <VolumeX className='w-4 h-4 text-primary' />
                            <span>Movie Sound: <span className='text-primary font-bold'>OFF</span> (Click for Sound 🔊)</span>
                        </>
                    )}
                </button>
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

                <div className='flex flex-wrap items-center gap-4 mt-3'>
                    <button 
                        onClick={() => {
                            navigate('/movie')
                            window.scrollTo(0, 0)
                        }} 
                        className='flex items-center gap-2 px-7 py-3 bg-primary hover:opacity-90 text-white rounded-full font-semibold transition cursor-pointer shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 duration-200'
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

                    {/* Movie Voice / Audio Toggle Button */}
                    <button
                        onClick={toggleSound}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full backdrop-blur-md border transition cursor-pointer hover:scale-105 active:scale-95 duration-200 ${
                            !isMuted 
                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' 
                                : 'bg-white/10 hover:bg-white/15 border-white/20 text-gray-200 hover:text-white'
                        }`}
                        title={isMuted ? 'Turn on Movie Voice / Audio' : 'Mute Movie Voice'}
                    >
                        {!isMuted ? (
                            <>
                                <Volume2 className='w-4 h-4 text-white animate-pulse' />
                                <span className='text-sm font-semibold text-white'>Sound: ON</span>
                                <span className='flex h-2 w-2 relative'>
                                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
                                    <span className='relative inline-flex rounded-full h-2 w-2 bg-white'></span>
                                </span>
                            </>
                        ) : (
                            <>
                                <VolumeX className='w-4 h-4 text-primary' />
                                <span className='text-sm font-medium'>Play Movie Sound 🔊</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Hero Carousel Navigation Indicators */}
            <div className='absolute bottom-8 left-6 md:left-16 lg:left-36 z-20 flex items-center gap-3'>
                {heroMovies.map((movie, index) => (
                    <button
                        key={movie.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium transition-all duration-300 cursor-pointer ${
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
        </div>
    )
}

export default HeroSection



