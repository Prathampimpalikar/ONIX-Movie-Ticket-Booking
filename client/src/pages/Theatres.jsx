import React from 'react'
import { MapPin, Sparkles, Volume2, Monitor, Coffee, Car, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets'
import BlurCircle from '../component/BlurCircle'

const THEATRES_LIST = [
    {
        id: 'theatre-1',
        name: 'ONIX IMAX & Dolby Atmos - Downtown',
        location: '742 Broadway Ave, City Center',
        screens: '12 Screens (IMAX 4K Dual Laser)',
        sound: 'Dolby Atmos Surround 3D',
        rating: '4.9 ★',
        amenities: ['IMAX 4K Laser', 'Dolby Atmos', 'Recliner Seats', 'Gourmet Food Court', 'Valet Parking'],
        currentlyShowing: [dummyShowsData[0], dummyShowsData[1], dummyShowsData[6]]
    },
    {
        id: 'theatre-2',
        name: 'ONIX Grand 4DX - Metro Mall',
        location: 'Level 4, Metro Grand Mall',
        screens: '8 Screens (4DX Motion & Effects)',
        sound: 'DTS-X High Definition Audio',
        rating: '4.8 ★',
        amenities: ['4DX Motion Seats', 'Environmental Effects', 'Premium Recliners', 'Café & Lounge'],
        currentlyShowing: [dummyShowsData[0], dummyShowsData[2], dummyShowsData[4]]
    },
    {
        id: 'theatre-3',
        name: 'ONIX Cineplex - Riverside Plaza',
        location: 'Riverside Drive, Tech District',
        screens: '10 Screens (RealD 3D)',
        sound: '7.1 Surround Sound System',
        rating: '4.7 ★',
        amenities: ['RealD 3D', 'VIP Lounges', 'Popcorn Bar', 'Spacious Parking'],
        currentlyShowing: [dummyShowsData[3], dummyShowsData[5], dummyShowsData[7]]
    }
]

const Theatres = () => {
    const navigate = useNavigate()

    return (
        <div className='relative min-h-screen text-white pt-28 md:pt-32 pb-24 px-6 md:px-16 lg:px-24 xl:px-36 max-w-7xl mx-auto'>
            <BlurCircle top='80px' right='80px' />
            <BlurCircle top='600px' left='40px' />

            {/* Header */}
            <div className='pb-8 border-b border-gray-800 mb-10'>
                <div className='flex items-center gap-3 mb-2'>
                    <MapPin className='w-8 h-8 text-primary' />
                    <h1 className='text-3xl md:text-4xl font-bold text-white'>Partner Theaters & Cinemas</h1>
                </div>
                <p className='text-gray-400 text-sm md:text-base max-w-2xl'>
                    Discover premium ONIX cinema locations equipped with state-of-the-art IMAX 4K, Dolby Atmos audio, and luxury recliners.
                </p>
            </div>

            {/* Theaters list */}
            <div className='grid grid-cols-1 gap-8'>
                {THEATRES_LIST.map((theatre) => (
                    <div
                        key={theatre.id}
                        className='bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/90 border border-gray-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-xl hover:border-gray-700 transition duration-300'
                    >
                        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-800/80'>
                            <div>
                                <div className='flex items-center gap-3'>
                                    <h2 className='text-xl sm:text-2xl font-bold text-white'>{theatre.name}</h2>
                                    <span className='px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold'>
                                        {theatre.rating}
                                    </span>
                                </div>
                                <p className='text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-1.5'>
                                    <MapPin className='w-3.5 h-3.5 text-primary shrink-0' />
                                    {theatre.location}
                                </p>
                            </div>

                            <div className='flex flex-wrap items-center gap-2 text-xs text-gray-300'>
                                <span className='bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5'>
                                    <Monitor className='w-3.5 h-3.5 text-primary' />
                                    {theatre.screens}
                                </span>
                                <span className='bg-white/5 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5'>
                                    <Volume2 className='w-3.5 h-3.5 text-primary' />
                                    {theatre.sound}
                                </span>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className='py-5'>
                            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3'>
                                Key Amenities & Features
                            </p>
                            <div className='flex flex-wrap gap-2'>
                                {theatre.amenities.map((item, idx) => (
                                    <span
                                        key={idx}
                                        className='px-3 py-1 bg-red-950/30 border border-red-900/40 text-red-200 rounded-full text-xs font-medium flex items-center gap-1.5'
                                    >
                                        <Sparkles className='w-3 h-3 text-primary' />
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Currently Screening Movies */}
                        <div className='pt-4 border-t border-gray-800/80'>
                            <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4'>
                                Screening Now
                            </p>
                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                {theatre.currentlyShowing.map((movie) => (
                                    <div
                                        key={movie._id || movie.id}
                                        onClick={() => { navigate(`/movie/${movie._id || movie.id}`); window.scrollTo(0, 0); }}
                                        className='flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-gray-800 hover:border-primary/60 transition cursor-pointer group'
                                    >
                                        <img
                                            src={movie.poster_path || movie.backdrop_path}
                                            alt={movie.title}
                                            className='w-12 h-16 object-cover rounded-xl shrink-0 group-hover:scale-105 transition'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <h4 className='text-xs sm:text-sm font-bold text-white truncate group-hover:text-primary transition'>
                                                {movie.title}
                                            </h4>
                                            <p className='text-[11px] text-gray-400 truncate mt-0.5'>
                                                {movie.genres?.[0]?.name || 'Action'} • {movie.runtime || 120} min
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Theatres
