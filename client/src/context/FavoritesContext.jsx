import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const FavoritesContext = createContext()

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('onix_favorites')
            return saved ? JSON.parse(saved) : []
        } catch (e) {
            console.error('Failed to load favorites from localStorage', e)
            return []
        }
    })

    useEffect(() => {
        try {
            localStorage.setItem('onix_favorites', JSON.stringify(favorites))
        } catch (e) {
            console.error('Failed to save favorites to localStorage', e)
        }
    }, [favorites])

    const isFavorite = (movieId) => {
        if (!movieId) return false
        return favorites.some(
            (m) => String(m._id || m.id) === String(movieId)
        )
    }

    const toggleFavorite = (movie) => {
        if (!movie) return
        const movieId = String(movie._id || movie.id)
        const exists = favorites.some((m) => String(m._id || m.id) === movieId)

        if (exists) {
            setFavorites((prev) => prev.filter((m) => String(m._id || m.id) !== movieId))
            toast.success(`Removed "${movie.title}" from favorites`)
        } else {
            setFavorites((prev) => [...prev, movie])
            toast.success(`Added "${movie.title}" to favorites!`)
        }
    }

    return (
        <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}
