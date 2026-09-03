import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Calendar, Clock, Ticket, Info, CheckCircle2, Armchair, ShieldCheck } from 'lucide-react'
import { dummyShowsData } from '../assets/assets'
import BlurCircle from '../component/BlurCircle'
import { useBookings } from '../context/BookingsContext'
import toast from 'react-hot-toast'

const SHOW_TIMES = ['10:30 AM', '01:45 PM', '05:00 PM', '08:30 PM', '11:15 PM']
const THEATRES = [
    'ONIX IMAX 4K - Hall 1',
    'ONIX Dolby Cinema - Hall 2',
    'ONIX Grand 4DX - Hall 3'
]

// Rows configuration
const ROWS = [
    { row: 'A', type: 'VIP Recliner', price: 18 },
    { row: 'B', type: 'VIP Recliner', price: 18 },
    { row: 'C', type: 'Executive', price: 14 },
    { row: 'D', type: 'Executive', price: 14 },
    { row: 'E', type: 'Executive', price: 14 },
    { row: 'F', type: 'Executive', price: 14 },
    { row: 'G', type: 'Standard', price: 10 },
    { row: 'H', type: 'Standard', price: 10 },
]

const SEATS_PER_ROW = 12

// Default pre-occupied seats generator for realism
const getOccupiedSeats = (id, time) => {
    const seed = (id + time).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const occupied = new Set()
    const possibleSeats = ['A3', 'A4', 'B7', 'B8', 'C2', 'C9', 'D5', 'D6', 'D7', 'E3', 'F8', 'F9', 'G5', 'G6', 'H1', 'H12']
    
    possibleSeats.forEach((seat, index) => {
        if ((seed + index) % 2 === 0) {
            occupied.add(seat)
        }
    })
    return occupied
}

const SeatLayout = () => {
    const { id, date } = useParams()
    const navigate = useNavigate()
    const { addBooking } = useBookings()

    const movie = dummyShowsData.find((m) => String(m._id || m.id) === String(id)) || dummyShowsData[0]

    const [selectedTime, setSelectedTime] = useState(SHOW_TIMES[2]) // default 5:00 PM
    const [selectedTheatre, setSelectedTheatre] = useState(THEATRES[0])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [occupiedSeats, setOccupiedSeats] = useState(new Set())

    useEffect(() => {
        window.scrollTo(0, 0)
        setOccupiedSeats(getOccupiedSeats(movie._id || movie.id, selectedTime))
        setSelectedSeats([])
    }, [id, selectedTime, movie._id, movie.id])

    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'Today'

    const handleSeatClick = (seatId, isOccupied) => {
        if (isOccupied) return
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
        )
    }

    // Calculate subtotal
    const calculateSubtotal = () => {
        return selectedSeats.reduce((sum, seatId) => {
            const rowLabel = seatId.charAt(0)
            const rowConfig = ROWS.find((r) => r.row === rowLabel)
            return sum + (rowConfig ? rowConfig.price : 12)
        }, 0)
    }

    const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 1.5 : 0
    const totalAmount = calculateSubtotal() + convenienceFee

    const handleProceedToBook = () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat to proceed')
            return
        }

        const newBooking = {
            movieId: movie._id || movie.id,
            movieTitle: movie.title,
            posterPath: movie.poster_path || movie.backdrop_path,
            backdropPath: movie.backdrop_path || movie.poster_path,
            runtime: movie.runtime || 120,
            showDate: date || new Date().toISOString().split('T')[0],
            formattedShowDate: formattedDate,
            showTime: selectedTime,
            theatre: selectedTheatre,
            seats: selectedSeats.sort(),
            subtotal: calculateSubtotal(),
            convenienceFee,
            totalAmount,
            userEmail: 'user@onix.com'
        }

        addBooking(newBooking)
        navigate('/mybooking')
    }

    return (
        <div className='relative min-h-screen text-white pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto'>
            <BlurCircle top='100px' right='50px' />
            <BlurCircle top='400px' left='20px' />

            {/* Top Navigation & Movie Summary Header */}
            <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800/80 mb-8'>
                <div className='flex items-center gap-4'>
                    <button
                        onClick={() => navigate(-1)}
                        className='p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition cursor-pointer text-gray-300 hover:text-white'
                    >
                        <ChevronLeft className='w-5 h-5' />
                    </button>
                    <div>
                        <h1 className='text-2xl sm:text-3xl font-bold text-white flex items-center gap-3'>
                            {movie.title}
                            <span className='text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-medium'>
                                2D / IMAX
                            </span>
                        </h1>
                        <div className='flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mt-1'>
                            <span className='flex items-center gap-1.5'>
                                <Calendar className='w-3.5 h-3.5 text-primary' />
                                {formattedDate}
                            </span>
                            <span>•</span>
                            <span className='flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5 text-primary' />
                                {selectedTime}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Theatre Selection Dropdown */}
                <div className='flex items-center gap-3 self-start md:self-auto'>
                    <span className='text-xs text-gray-400 font-medium hidden sm:inline'>Cinema:</span>
                    <select
                        value={selectedTheatre}
                        onChange={(e) => setSelectedTheatre(e.target.value)}
                        className='bg-neutral-900 border border-gray-800 text-gray-200 text-xs sm:text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-primary transition cursor-pointer'
                    >
                        {THEATRES.map((t, idx) => (
                            <option key={idx} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Showtime Selection Buttons */}
            <div className='mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md'>
                <span className='text-sm font-semibold text-gray-300 shrink-0 flex items-center gap-2'>
                    <Clock className='w-4 h-4 text-primary' /> Select Showtime:
                </span>
                <div className='flex flex-wrap items-center gap-2.5 w-full'>
                    {SHOW_TIMES.map((time, idx) => {
                        const isSelected = selectedTime === time
                        return (
                            <button
                                key={idx}
                                onClick={() => setSelectedTime(time)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                                    isSelected
                                        ? 'bg-primary text-white shadow-lg shadow-primary/40 scale-105 font-bold'
                                        : 'bg-black/50 border border-gray-800 text-gray-300 hover:border-gray-600 hover:text-white'
                                }`}
                            >
                                {time}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Cinema Screen Visual Graphic */}
            <div className='flex flex-col items-center my-8'>
                <div className='relative w-full max-w-2xl h-14 flex flex-col items-center justify-center overflow-hidden'>
                    {/* Glowing Arc Screen */}
                    <div className='w-[110%] h-24 rounded-[100%] border-t-4 border-primary/80 bg-gradient-to-b from-primary/30 via-primary/5 to-transparent shadow-[0_-15px_30px_rgba(226,1,55,0.4)] transform -rotate-1' />
                    <p className='absolute top-2 text-[11px] font-semibold tracking-widest text-gray-400 uppercase'>
                        All Eyes This Way — Screen
                    </p>
                </div>
            </div>

            {/* Main Seating Map Grid */}
            <div className='flex flex-col items-center gap-3 overflow-x-auto py-6 pb-12 scrollbar-none'>
                {ROWS.map((rowObj) => {
                    const { row, type, price } = rowObj
                    return (
                        <div key={row} className='flex items-center gap-2 sm:gap-3 min-w-max'>
                            {/* Row Label */}
                            <span className='w-6 text-center text-xs font-bold text-gray-400'>{row}</span>

                            {/* Seats Array */}
                            <div className='flex items-center gap-1.5 sm:gap-2'>
                                {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                                    const seatNumber = i + 1
                                    const seatId = `${row}${seatNumber}`
                                    const isOccupied = occupiedSeats.has(seatId)
                                    const isSelected = selectedSeats.includes(seatId)

                                    // Add aisle space after seat 4 and seat 8
                                    const hasAisle = seatNumber === 4 || seatNumber === 8

                                    return (
                                        <React.Fragment key={seatId}>
                                            <button
                                                onClick={() => handleSeatClick(seatId, isOccupied)}
                                                disabled={isOccupied}
                                                title={`${seatId} - ${type} ($${price})`}
                                                className={`w-7 h-7 sm:w-9 sm:h-9 rounded-t-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                                    isOccupied
                                                        ? 'bg-gray-800/60 border border-gray-800 text-gray-600 cursor-not-allowed line-through'
                                                        : isSelected
                                                        ? 'bg-primary text-white border border-red-400 shadow-md shadow-primary/50 scale-110'
                                                        : 'bg-neutral-900 border border-gray-700/70 text-gray-300 hover:border-primary/80 hover:text-white hover:scale-105'
                                                }`}
                                            >
                                                {seatNumber}
                                            </button>

                                            {hasAisle && <div className='w-4 sm:w-6' />}
                                        </React.Fragment>
                                    )
                                })}
                            </div>

                            {/* Row Price Tag */}
                            <span className='text-[11px] text-gray-500 font-mono ml-2 hidden sm:inline'>
                                ${price}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Seat Map Legend */}
            <div className='flex flex-wrap items-center justify-center gap-6 py-4 border-t border-b border-gray-800/80 my-6 text-xs sm:text-sm text-gray-300'>
                <div className='flex items-center gap-2'>
                    <div className='w-5 h-5 rounded-t-md bg-neutral-900 border border-gray-700/70' />
                    <span>Available</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-5 h-5 rounded-t-md bg-primary border border-red-400 shadow-sm' />
                    <span>Selected</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='w-5 h-5 rounded-t-md bg-gray-800/60 border border-gray-800 text-gray-600 flex items-center justify-center text-[10px] font-bold line-through'>
                        X
                    </div>
                    <span>Sold Out</span>
                </div>
                <div className='flex items-center gap-2 text-gray-400 border-l border-gray-800 pl-6 hidden md:flex'>
                    <span className='w-2 h-2 rounded-full bg-amber-400' />
                    <span>VIP Recliner ($18)</span>
                    <span className='w-2 h-2 rounded-full bg-blue-400 ml-2' />
                    <span>Executive ($14)</span>
                    <span className='w-2 h-2 rounded-full bg-emerald-400 ml-2' />
                    <span>Standard ($10)</span>
                </div>
            </div>

            {/* Bottom Checkout & Ticket Summary Bar */}
            <div className='sticky bottom-4 z-40 mt-8 p-5 rounded-2xl bg-gradient-to-r from-neutral-900/95 via-neutral-900/98 to-neutral-900/95 border border-red-900/40 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6'>
                <div className='flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto text-center sm:text-left'>
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0'>
                            <Armchair className='w-6 h-6' />
                        </div>
                        <div>
                            <p className='text-xs text-gray-400 font-medium'>Selected Seats ({selectedSeats.length})</p>
                            <p className='text-sm sm:text-base font-bold text-white max-w-xs truncate'>
                                {selectedSeats.length > 0 ? selectedSeats.sort().join(', ') : 'None'}
                            </p>
                        </div>
                    </div>

                    {selectedSeats.length > 0 && (
                        <div className='border-t sm:border-t-0 sm:border-l border-gray-800 pt-3 sm:pt-0 sm:pl-6 text-xs text-gray-400 space-y-0.5'>
                            <p>Subtotal: <span className='text-white font-medium'>${calculateSubtotal().toFixed(2)}</span></p>
                            <p>Convenience Fee: <span className='text-white font-medium'>${convenienceFee.toFixed(2)}</span></p>
                        </div>
                    )}
                </div>

                <div className='flex items-center gap-6 w-full md:w-auto justify-between md:justify-end'>
                    <div className='text-right'>
                        <p className='text-xs text-gray-400'>Total Amount</p>
                        <p className='text-2xl font-extrabold text-primary'>${totalAmount.toFixed(2)}</p>
                    </div>

                    <button
                        onClick={handleProceedToBook}
                        className='px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-full font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap'
                    >
                        <Ticket className='w-4 h-4' />
                        Book Tickets
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SeatLayout