import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { sendRealEmailTicket } from '../lib/emailService'

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
            isPaid: true,
            emailSentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setBookings((prev) => [booking, ...prev])
        
        // Dispatch real email ticket to recipient inbox
        sendRealEmailTicket(booking)
        return booking
    }

    const resendEmailTicket = (bookingId) => {
        const target = bookings.find((b) => b.id === bookingId)
        if (target) {
            sendRealEmailTicket(target)
        }
    }

    const cancelBooking = (bookingId) => {
        setBookings((prev) => prev.filter((b) => b.id !== bookingId))
        toast.success('Booking cancelled successfully')
    }

    return (
        <BookingsContext.Provider value={{ bookings, addBooking, resendEmailTicket, cancelBooking }}>
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
