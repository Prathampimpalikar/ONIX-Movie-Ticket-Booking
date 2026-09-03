import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const BookingsContext = createContext()

export const BookingsProvider = ({ children }) => {
    const [bookings, setBookings] = useState(() => {
        try {
            const saved = localStorage.getItem('onix_bookings')
            return saved ? JSON.parse(saved) : []
        } catch (e) {
            console.error('Failed to load bookings from localStorage', e)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem('onix_bookings', JSON.stringify(bookings))
        } catch (e) {
            console.error('Failed to save bookings to localStorage', e)
        }
    }, [bookings])

    const addBooking = (newBookingData) => {
        const bookingId = 'ONIX-' + Math.floor(100000 + Math.random() * 900000)
        const booking = {
            id: bookingId,
            ...newBookingData,
            createdAt: new Date().toISOString(),
            status: 'CONFIRMED',
            isPaid: true
        }

        setBookings((prev) => [booking, ...prev])
        toast.success(`Booking confirmed for ${newBookingData.movieTitle || 'your movie'}!`)
        return booking
    }

    const cancelBooking = (bookingId) => {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId))
        toast.success('Booking cancelled successfully')
    }

    return (
        <BookingsContext.Provider value={{ bookings, addBooking, cancelBooking }}>
            {children}
        </BookingsContext.Provider>
    )
}

export const useBookings = () => {
    const context = useContext(BookingsContext)
    if (!context) {
        throw new Error('useBookings must be used within a BookingsProvider')
    }
    return context
}
