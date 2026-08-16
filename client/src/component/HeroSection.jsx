import React from 'react'
import { assets } from '../assets/assets'
import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()

    return (
        <div 
            className='relative w-full h-screen overflow-hidden flex flex-col justify-center px-6 md:px-16 lg:px-36 hero-bg text-white'
            style={{ 
                backgroundImage: `url(${assets.spiderManBg})`
            }}
        >
            {/* Cinematic Gradient Overlays to enhance visual contrast and readability */}
            <div className='absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent md:w-1/2 pointer-events-none' />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none' />

            {/* Content Container */}
            <div className='relative z-10 flex flex-col items-start gap-4 mt-16 max-w-2xl'>
                <img src={assets.marvelLogo} alt="Marvel Studios" className="max-h-10 lg:h-11 drop-shadow-md" />
                
                <h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-extrabold leading-tight tracking-tight'>
                    <span className='bg-gradient-to-r from-red-500 via-rose-500 to-red-400 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(226,1,55,0.35)]'>
                        SpiderMan:
                    </span>
                    <br />
                    <span className='whitespace-nowrap bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(251,191,36,0.3)]'>
                        Brand New Day
                    </span>
                </h1>

                <div className='flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base font-medium'>
                    <span className='bg-white/10 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10'>
                        Action | Adventure | Sci-Fi
                    </span>
                    <div className='flex items-center gap-1.5'>
                        <CalendarIcon className='w-4 h-4 text-primary' />
                        <span>2026</span>
                    </div>
                    <div className='flex items-center gap-1.5'>
                        <ClockIcon className='w-4 h-4 text-primary' />
                        <span>2h 48m</span>
                    </div>
                </div>

                <div className='flex items-center gap-4 mt-3'>
                    <button 
                        onClick={() => navigate('/movie')} 
                        className='flex items-center gap-2 px-7 py-3 bg-primary hover:opacity-90 text-white rounded-full font-semibold transition cursor-pointer shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 duration-200'
                    >
                        Explore Movies <ArrowRight className='w-4 h-4' />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection