import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'
import BlurCircle from './BlurCircle'
import _ReactPlayer from 'react-player'
import { Play } from 'lucide-react'

const ReactPlayer = typeof _ReactPlayer === 'function' ? _ReactPlayer : (_ReactPlayer?.default || _ReactPlayer)

const TrailerSection = () => {
    const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
            <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto mb-4'>Trailers</p>
            
            <div className='relative flex justify-center'>
                <BlurCircle top='-100px' right='-100px' />
                {currentTrailer?.videoUrl && (
                    <ReactPlayer 
                        key={currentTrailer.videoUrl}
                        url={currentTrailer.videoUrl} 
                        controls={true}
                        className="mx-auto max-w-full rounded-2xl overflow-hidden shadow-2xl" 
                        width="960px" 
                        height="540px" 
                    />
                )}
            </div>

            {/* Trailer Selection List */}
            <div className='flex items-center justify-center gap-4 mt-8 max-w-[960px] mx-auto flex-wrap'>
                {dummyTrailers.map((trailer, index) => (
                    <div 
                        key={index} 
                        onClick={() => setCurrentTrailer(trailer)}
                        className={`cursor-pointer group flex flex-col items-center gap-2 p-2.5 rounded-xl border transition duration-300 ${currentTrailer.videoUrl === trailer.videoUrl ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105' : 'border-gray-800 bg-gray-900/60 hover:border-gray-700'}`}
                    >
                        <div className='relative w-36 h-20 overflow-hidden rounded-lg'>
                            <img 
                                src={trailer.image} 
                                alt={trailer.title || `Trailer ${index + 1}`} 
                                className='w-full h-full object-cover group-hover:scale-105 transition duration-300'
                            />
                            <div className='absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition'>
                                <Play className='w-6 h-6 text-white fill-white' />
                            </div>
                        </div>
                        <div className='w-full text-center'>
                            <p className='text-xs text-gray-200 group-hover:text-white font-semibold truncate max-w-[140px]'>
                                {trailer.title || `Trailer ${index + 1}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrailerSection



