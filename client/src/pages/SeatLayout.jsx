import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Calendar, Clock, Ticket, Mail, CheckCircle2, Armchair, ExternalLink, Printer, X, Film } from 'lucide-react'
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

// Rows configuration in INR (₹)
const ROWS = [
    { row: 'A', type: 'VIP Recliner', price: 350 },
    { row: 'B', type: 'VIP Recliner', price: 350 },
    { row: 'C', type: 'Executive', price: 250 },
    { row: 'D', type: 'Executive', price: 250 },
    { row: 'E', type: 'Executive', price: 250 },
    { row: 'F', type: 'Executive', price: 250 },
    { row: 'G', type: 'Standard', price: 180 },
    { row: 'H', type: 'Standard', price: 180 },
]

const SEATS_PER_ROW = 12

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
    const location = useLocation()
    const navigate = useNavigate()
    const { addBooking } = useBookings()

    const searchParams = new URLSearchParams(location.search)
    const initialTime = searchParams.get('time') || SHOW_TIMES[2]

    const movie = dummyShowsData.find((m) => String(m._id || m.id) === String(id)) || dummyShowsData[0]

    // Generate upcoming 14 days
    const [dateList, setDateList] = useState([])
    const [selectedDateObj, setSelectedDateObj] = useState(null)
    const [selectedTime, setSelectedTime] = useState(initialTime)
    const [selectedTheatre, setSelectedTheatre] = useState(THEATRES[0])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [occupiedSeats, setOccupiedSeats] = useState(new Set())
    const [userEmail, setUserEmail] = useState('prathampimpalikar@gmail.com')
    const [emailModalBooking, setEmailModalBooking] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0)
        
        // Generate upcoming dates
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

        const activeDate = dates.find(d => d.fullDate === date) || dates[0]
        setSelectedDateObj(activeDate)
        setOccupiedSeats(getOccupiedSeats(movie._id || movie.id, selectedTime))
        setSelectedSeats([])
    }, [id, date, selectedTime, movie._id, movie.id])

    const formattedDateStr = selectedDateObj
        ? new Date(selectedDateObj.fullDate).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
        : 'Today'

    const handleSeatClick = (seatId, isOccupied) => {
        if (isOccupied) return
        setSelectedSeats((prev) =>
            prev.includes(seatId) ? prev.filter((s) => s !== seatId) : [...prev, seatId]
        )
    }

    // Subtotal in INR
    const calculateSubtotal = () => {
        return selectedSeats.reduce((sum, seatId) => {
            const rowLabel = seatId.charAt(0)
            const rowConfig = ROWS.find((r) => r.row === rowLabel)
            return sum + (rowConfig ? rowConfig.price : 200)
        }, 0)
    }

    const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 30 : 0
    const totalAmount = calculateSubtotal() + convenienceFee

    // Helper to generate mailto URL for direct email client opening
    const generateMailtoUrl = (booking) => {
        const subject = encodeURIComponent(`🎟️ ONIX Ticket Order #${booking.id} - ${booking.movieTitle}`)
        const body = encodeURIComponent(
            `OFFICIAL ONIX MOVIE TICKET CONFIRMATION\n` +
            `======================================\n\n` +
            `Website: ONIX Movie Ticket Booking\n` +
            `Movie Name: ${booking.movieTitle}\n` +
            `Cinema Hall: ${booking.theatre}\n` +
            `Show Date: ${booking.formattedShowDate}\n` +
            `Show Time: ${booking.showTime}\n` +
            `Reserved Seats: ${booking.seats?.join(', ')}\n` +
            `Total Amount Paid: ₹${booking.totalAmount?.toFixed(2)}\n` +
            `Ticket ID: ${booking.id}\n\n` +
            `Scan your digital QR stub at the ONIX cinema entrance 15 minutes before showtime.\n` +
            `Thank you for booking with ONIX!`
        )
        return `mailto:${booking.userEmail}?subject=${subject}&body=${body}`
    }

    const handleProceedToBook = () => {
        if (selectedSeats.length === 0) {
            toast.error('Please select at least one seat to proceed')
            return
        }

        if (!userEmail || !userEmail.includes('@')) {
            toast.error('Please enter a valid email address for ticket delivery')
            return
        }

        const newBooking = {
            movieId: movie._id || movie.id,
            movieTitle: movie.title,
            posterPath: movie.poster_path || movie.backdrop_path,
            backdropPath: movie.backdrop_path || movie.poster_path,
            runtime: movie.runtime || 120,
            showDate: selectedDateObj?.fullDate || date || new Date().toISOString().split('T')[0],
            formattedShowDate: formattedDateStr,
            showTime: selectedTime,
            theatre: selectedTheatre,
            seats: selectedSeats.sort(),
            subtotal: calculateSubtotal(),
            convenienceFee,
            totalAmount,
            userEmail: userEmail.trim(),
            currency: '₹'
        }

        const bookingResult = addBooking(newBooking)
        setEmailModalBooking(bookingResult)
    }

    return (
        <div className='relative min-h-screen text-white pt-24 md:pt-28 pb-20 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto'>
            <BlurCircle top='100px' right='50px' />
            <BlurCircle top='400px' left='20px' />

            {/* Top Navigation & Movie Header */}
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
                                2D / IMAX 4K
                            </span>
                        </h1>
                        <div className='flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-400 mt-1'>
                            <span className='flex items-center gap-1.5'>
                                <Calendar className='w-3.5 h-3.5 text-primary' />
                                {formattedDateStr}
                            </span>
                            <span>•</span>
                            <span className='flex items-center gap-1.5'>
                                <Clock className='w-3.5 h-3.5 text-primary' />
                                {selectedTime}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Theatre Dropdown */}
                <div className='flex items-center gap-3 self-start md:self-auto'>
                    <span className='text-xs text-gray-400 font-medium hidden sm:inline'>Cinema Hall:</span>
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

            {/* Date & Showtime Selector Bar */}
            <div className='mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
                {/* Date Carousel */}
                <div className='flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none'>
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5'>
                        <Calendar className='w-4 h-4 text-primary' /> Date:
                    </span>
                    <div className='flex items-center gap-2'>
                        {dateList.slice(0, 7).map((item, idx) => {
                            const isSelected = selectedDateObj?.fullDate === item.fullDate
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDateObj(item)}
                                    className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl text-xs transition-all duration-200 cursor-pointer min-w-[52px] ${
                                        isSelected
                                            ? 'bg-primary text-white shadow-md font-bold scale-105'
                                            : 'bg-black/40 border border-gray-800 text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    <span className='text-[10px] font-medium'>{item.day}</span>
                                    <span className='font-bold text-sm'>{item.date}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Showtime Slots */}
                <div className='flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none'>
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5'>
                        <Clock className='w-4 h-4 text-primary' /> Showtime:
                    </span>
                    <div className='flex items-center gap-2'>
                        {SHOW_TIMES.map((time, idx) => {
                            const isSelected = selectedTime === time
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedTime(time)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                        isSelected
                                            ? 'bg-primary text-white shadow-md scale-105'
                                            : 'bg-black/40 border border-gray-800 text-gray-300 hover:border-gray-600'
                                    }`}
                                >
                                    {time}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Cinema Screen Visual Graphic */}
            <div className='flex flex-col items-center my-6'>
                <div className='relative w-full max-w-2xl h-14 flex flex-col items-center justify-center overflow-hidden'>
                    <div className='w-[110%] h-24 rounded-[100%] border-t-4 border-primary/80 bg-gradient-to-b from-primary/30 via-primary/5 to-transparent shadow-[0_-15px_30px_rgba(226,1,55,0.4)] transform -rotate-1' />
                    <p className='absolute top-2 text-[11px] font-semibold tracking-widest text-gray-400 uppercase'>
                        All Eyes This Way — Screen
                    </p>
                </div>
            </div>

            {/* Seating Grid */}
            <div className='flex flex-col items-center gap-3 overflow-x-auto py-4 pb-10 scrollbar-none'>
                {ROWS.map((rowObj) => {
                    const { row, type, price } = rowObj
                    return (
                        <div key={row} className='flex items-center gap-2 sm:gap-3 min-w-max'>
                            <span className='w-6 text-center text-xs font-bold text-gray-400'>{row}</span>

                            <div className='flex items-center gap-1.5 sm:gap-2'>
                                {Array.from({ length: SEATS_PER_ROW }, (_, i) => {
                                    const seatNumber = i + 1
                                    const seatId = `${row}${seatNumber}`
                                    const isOccupied = occupiedSeats.has(seatId)
                                    const isSelected = selectedSeats.includes(seatId)
                                    const hasAisle = seatNumber === 4 || seatNumber === 8

                                    return (
                                        <React.Fragment key={seatId}>
                                            <button
                                                onClick={() => handleSeatClick(seatId, isOccupied)}
                                                disabled={isOccupied}
                                                title={`${seatId} - ${type} (₹${price})`}
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

                            <span className='text-[11px] text-gray-500 font-mono ml-2 hidden sm:inline'>
                                ₹{price}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Seat Legend */}
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
                    <span>VIP Recliner (₹350)</span>
                    <span className='w-2 h-2 rounded-full bg-blue-400 ml-2' />
                    <span>Executive (₹250)</span>
                    <span className='w-2 h-2 rounded-full bg-emerald-400 ml-2' />
                    <span>Standard (₹180)</span>
                </div>
            </div>

            {/* Checkout & Email Bar */}
            <div className='sticky bottom-4 z-40 mt-8 p-5 rounded-2xl bg-gradient-to-r from-neutral-900/95 via-neutral-900/98 to-neutral-900/95 border border-red-900/40 backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6'>
                <div className='flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto text-center sm:text-left'>
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

                    {/* Email Input Field */}
                    <div className='flex items-center gap-2 bg-black/60 border border-gray-800 rounded-xl px-3.5 py-2 w-full sm:w-64'>
                        <Mail className='w-4 h-4 text-primary shrink-0' />
                        <input
                            type='email'
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            placeholder='Ticket Delivery Email'
                            className='bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none w-full'
                        />
                    </div>
                </div>

                <div className='flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end'>
                    <div className='text-right'>
                        <p className='text-xs text-gray-400'>Total Amount</p>
                        <p className='text-2xl font-extrabold text-primary'>₹{totalAmount.toFixed(2)}</p>
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

            {/* Delivered Email Ticket Modal */}
            {emailModalBooking && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto'>
                    <div className='relative w-full max-w-lg bg-neutral-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl text-left'>
                        <div className='bg-emerald-600/20 border-b border-emerald-500/30 p-6 flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-400'>
                                    <Mail className='w-5 h-5' />
                                </div>
                                <div>
                                    <h3 className='text-base font-bold text-white'>ONIX Email Ticket Sent!</h3>
                                    <p className='text-xs text-emerald-300'>Delivered to {emailModalBooking.userEmail}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setEmailModalBooking(null)
                                    navigate('/mybooking')
                                }}
                                className='p-1.5 rounded-full bg-black/50 text-gray-300 hover:text-white transition cursor-pointer'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        {/* Email Preview Content */}
                        <div className='p-6 space-y-4 text-xs text-gray-300 bg-black/40'>
                            <div className='border-b border-gray-800 pb-3 flex items-center justify-between text-gray-400'>
                                <span>From: <strong>ONIX Cinema Tickets &lt;tickets@onix.com&gt;</strong></span>
                                <span>{emailModalBooking.emailSentAt}</span>
                            </div>

                            <div className='p-5 bg-neutral-950 rounded-2xl border border-gray-800 space-y-3 text-gray-200'>
                                <div className='flex items-center justify-between border-b border-gray-800 pb-2'>
                                    <span className='text-sm font-extrabold tracking-wider text-primary'>ONIX CINEMAS</span>
                                    <span className='text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-gray-300'>OFFICIAL PASS</span>
                                </div>

                                <div className='flex items-center gap-3 pt-1'>
                                    <Film className='w-7 h-7 text-primary shrink-0' />
                                    <div>
                                        <h4 className='text-base font-bold text-white'>{emailModalBooking.movieTitle}</h4>
                                        <p className='text-xs text-gray-400'>{emailModalBooking.theatre}</p>
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-3 text-xs bg-white/5 p-3.5 rounded-xl border border-white/10 mt-3'>
                                    <div>
                                        <span className='text-gray-400 block text-[10px]'>Show Date</span>
                                        <strong className='text-white'>{emailModalBooking.formattedShowDate}</strong>
                                    </div>
                                    <div>
                                        <span className='text-gray-400 block text-[10px]'>Show Time</span>
                                        <strong className='text-white'>{emailModalBooking.showTime}</strong>
                                    </div>
                                    <div>
                                        <span className='text-gray-400 block text-[10px]'>Reserved Seats</span>
                                        <strong className='text-primary text-sm'>{emailModalBooking.seats?.join(', ')}</strong>
                                    </div>
                                    <div>
                                        <span className='text-gray-400 block text-[10px]'>Total Amount Paid</span>
                                        <strong className='text-emerald-400 text-sm'>₹{emailModalBooking.totalAmount?.toFixed(2)}</strong>
                                    </div>
                                </div>

                                <div className='pt-2 text-center'>
                                    <p className='text-[10px] font-mono text-gray-400 uppercase tracking-widest'>
                                        Ticket Reference Code: <strong className='text-white font-bold'>{emailModalBooking.id}</strong>
                                    </p>
                                </div>
                            </div>

                            <div className='flex flex-wrap items-center justify-between gap-3 pt-2'>
                                <button
                                    onClick={() => {
                                        toast.success(`Resending real ticket email to ${emailModalBooking.userEmail}...`)
                                        sendRealEmailTicket(emailModalBooking)
                                    }}
                                    className='flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-md'
                                >
                                    <Mail className='w-4 h-4' /> Resend Ticket Email
                                </button>

                                <button
                                    onClick={() => {
                                        window.print()
                                    }}
                                    className='flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl text-xs font-medium cursor-pointer transition'
                                >
                                    <Printer className='w-4 h-4' /> Print Ticket Stub
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SeatLayout