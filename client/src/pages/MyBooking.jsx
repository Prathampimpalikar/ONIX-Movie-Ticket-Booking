import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ticket, Calendar, Clock, MapPin, QrCode, Trash2, Film, CheckCircle2, X, AlertCircle, Mail, Send } from 'lucide-react'
import { useBookings } from '../context/BookingsContext'
import BlurCircle from '../component/BlurCircle'

const MyBooking = () => {
    const { bookings, resendEmailTicket, cancelBooking } = useBookings()
    const navigate = useNavigate()

    const [selectedTicket, setSelectedTicket] = useState(null)
    const [cancelId, setCancelId] = useState(null)

    return (
        <div className='relative min-h-screen text-white pt-28 md:pt-32 pb-24 px-6 md:px-16 lg:px-24 xl:px-36 max-w-7xl mx-auto'>
            <BlurCircle top='80px' right='80px' />
            <BlurCircle top='500px' left='40px' />

            {/* Header Title */}
            <div className='relative flex items-center justify-between pb-8 border-b border-gray-800 mb-10'>
                <div className='flex items-center gap-3.5'>
                    <div className='w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20'>
                        <Ticket className='w-6 h-6' />
                    </div>
                    <div>
                        <h1 className='text-2xl md:text-3xl font-bold text-white'>My Bookings</h1>
                        <p className='text-xs sm:text-sm text-gray-400 mt-0.5'>
                            Manage your active movie tickets, email confirmations, and digital passes
                        </p>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {bookings.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-20 text-center bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md max-w-xl mx-auto my-12 shadow-2xl'>
                    <div className='w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-6 shadow-inner text-gray-500'>
                        <Film className='w-10 h-10' />
                    </div>
                    <h2 className='text-xl md:text-2xl font-bold text-white mb-2'>No Active Bookings Found</h2>
                    <p className='text-gray-400 text-sm max-w-md mb-8 leading-relaxed'>
                        You haven't reserved any movie tickets yet. Explore our latest blockbuster releases and select your seats!
                    </p>
                    <button
                        onClick={() => { navigate('/movie'); window.scrollTo(0, 0); }}
                        className='px-8 py-3.5 bg-primary hover:bg-primary-dull text-white transition rounded-full font-semibold text-sm cursor-pointer shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 duration-200'
                    >
                        Explore Movies
                    </button>
                </div>
            ) : (
                /* Bookings List */
                <div className='grid grid-cols-1 gap-6'>
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className='relative flex flex-col lg:flex-row items-stretch bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/90 border border-gray-800 hover:border-gray-700/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300 group'
                        >
                            {/* Poster image preview */}
                            <div className='lg:w-48 h-48 lg:h-auto shrink-0 relative overflow-hidden bg-black/40'>
                                <img
                                    src={booking.posterPath || booking.backdropPath}
                                    alt={booking.movieTitle}
                                    className='w-full h-full object-cover object-center group-hover:scale-105 transition duration-500'
                                />
                                <div className='absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md flex items-center gap-1'>
                                    <CheckCircle2 className='w-3 h-3' /> CONFIRMED
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div className='flex-1 p-6 flex flex-col justify-between gap-4'>
                                <div>
                                    <div className='flex flex-wrap items-center justify-between gap-2 mb-2'>
                                        <h2 className='text-xl sm:text-2xl font-bold text-white tracking-tight'>
                                            {booking.movieTitle}
                                        </h2>
                                        <span className='text-xs font-mono px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gray-300'>
                                            ID: <strong className='text-primary'>{booking.id}</strong>
                                        </span>
                                    </div>

                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-300 mt-4'>
                                        <div className='flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl'>
                                            <Calendar className='w-4 h-4 text-primary shrink-0' />
                                            <span className='truncate'>{booking.formattedShowDate || booking.showDate}</span>
                                        </div>
                                        <div className='flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl'>
                                            <Clock className='w-4 h-4 text-primary shrink-0' />
                                            <span>{booking.showTime}</span>
                                        </div>
                                        <div className='flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl col-span-1 sm:col-span-2 md:col-span-1'>
                                            <MapPin className='w-4 h-4 text-primary shrink-0' />
                                            <span className='truncate'>{booking.theatre}</span>
                                        </div>
                                    </div>

                                    <div className='flex flex-wrap items-center justify-between gap-4 mt-4 text-xs sm:text-sm'>
                                        <div className='flex flex-wrap items-center gap-3'>
                                            <div className='bg-red-950/40 border border-red-900/50 px-3.5 py-1.5 rounded-xl text-red-200'>
                                                Seats: <strong className='text-white font-bold'>{booking.seats?.join(', ')}</strong> ({booking.seats?.length} tickets)
                                            </div>
                                            <div className='flex items-center gap-1.5 text-gray-400 text-xs bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl'>
                                                <Mail className='w-3.5 h-3.5 text-primary' />
                                                <span className='truncate max-w-[160px]'>{booking.userEmail || 'user@onix.com'}</span>
                                            </div>
                                        </div>

                                        <div className='text-gray-400'>
                                            Total Paid: <strong className='text-emerald-400 text-base font-bold'>₹{booking.totalAmount?.toFixed(2)}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-800/80'>
                                    <button
                                        onClick={() => resendEmailTicket(booking.id)}
                                        className='flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/15 border border-white/10 text-gray-200 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer'
                                    >
                                        <Send className='w-3.5 h-3.5 text-primary' /> Resend Ticket Email
                                    </button>

                                    <button
                                        onClick={() => setCancelId(booking.id)}
                                        className='flex items-center gap-1.5 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer'
                                    >
                                        <Trash2 className='w-4 h-4' /> Cancel
                                    </button>

                                    <button
                                        onClick={() => setSelectedTicket(booking)}
                                        className='flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary-dull text-white rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shadow-md shadow-primary/20 hover:scale-105'
                                    >
                                        <QrCode className='w-4 h-4' /> View Ticket
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* E-Ticket Digital Stub Modal */}
            {selectedTicket && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto'>
                    <div className='relative w-full max-w-md bg-neutral-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200'>
                        {/* Ticket Header */}
                        <div className='relative bg-gradient-to-r from-red-950 via-primary/30 to-red-950 p-6 text-center border-b border-gray-800'>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className='absolute top-4 right-4 p-1.5 rounded-full bg-black/50 text-gray-300 hover:text-white transition cursor-pointer'
                            >
                                <X className='w-5 h-5' />
                            </button>
                            <span className='text-[10px] font-bold tracking-widest text-primary uppercase bg-black/60 px-3 py-1 rounded-full border border-primary/40'>
                                ONIX E-TICKET PASS
                            </span>
                            <h3 className='text-2xl font-bold text-white mt-3'>{selectedTicket.movieTitle}</h3>
                            <p className='text-xs text-gray-300 mt-1'>{selectedTicket.theatre}</p>
                        </div>

                        {/* Ticket Stub Content */}
                        <div className='p-6 space-y-4 text-xs sm:text-sm'>
                            <div className='grid grid-cols-2 gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl'>
                                <div>
                                    <p className='text-gray-400 text-[11px]'>Date</p>
                                    <p className='font-bold text-white mt-0.5'>{selectedTicket.formattedShowDate || selectedTicket.showDate}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-[11px]'>Time</p>
                                    <p className='font-bold text-white mt-0.5'>{selectedTicket.showTime}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-[11px]'>Seats</p>
                                    <p className='font-bold text-primary text-base mt-0.5'>{selectedTicket.seats?.join(', ')}</p>
                                </div>
                                <div>
                                    <p className='text-gray-400 text-[11px]'>Booking ID</p>
                                    <p className='font-mono font-bold text-white mt-0.5'>{selectedTicket.id}</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-2 text-xs text-gray-400 bg-white/5 p-3 rounded-xl border border-white/10'>
                                <Mail className='w-4 h-4 text-primary shrink-0' />
                                <span>Ticket sent to: <strong className='text-white'>{selectedTicket.userEmail || 'user@onix.com'}</strong></span>
                            </div>

                            {/* Simulated QR Code */}
                            <div className='flex flex-col items-center justify-center p-6 bg-white rounded-2xl text-black shadow-inner my-4'>
                                <div className='w-36 h-36 border-4 border-black p-2 bg-white flex items-center justify-center rounded-lg'>
                                    <div className='w-full h-full bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:8px_8px] flex items-center justify-center'>
                                        <Film className='w-12 h-12 text-black' />
                                    </div>
                                </div>
                                <p className='font-mono text-[11px] tracking-widest mt-3 font-bold'>
                                    {selectedTicket.id}
                                </p>
                                <p className='text-[10px] text-gray-600 mt-0.5'>Scan at Cinema Entrance</p>
                            </div>

                            <p className='text-[11px] text-gray-400 text-center leading-relaxed'>
                                Please present this QR code at the ticket counter or automated gate 15 minutes before showtime.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {cancelId && (
                <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'>
                    <div className='bg-neutral-900 border border-gray-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center space-y-4'>
                        <div className='w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto'>
                            <AlertCircle className='w-6 h-6' />
                        </div>
                        <h3 className='text-lg font-bold text-white'>Cancel Ticket Booking?</h3>
                        <p className='text-xs text-gray-400 leading-relaxed'>
                            Are you sure you want to cancel this booking? This action will release your reserved seats.
                        </p>
                        <div className='flex items-center gap-3 pt-2'>
                            <button
                                onClick={() => setCancelId(null)}
                                className='flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-medium transition cursor-pointer'
                            >
                                Keep Ticket
                            </button>
                            <button
                                onClick={() => {
                                    cancelBooking(cancelId)
                                    setCancelId(null)
                                }}
                                className='flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-md'
                            >
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyBooking