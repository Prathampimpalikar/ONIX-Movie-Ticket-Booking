import React, { useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from "lucide-react"
import { useUser, UserButton, useClerk } from "@clerk/react"

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useUser()
    const { openSignIn } = useClerk()
    const navigate = useNavigate()

    return (
        <div className='fixed top-0 left-0 w-full z-50 flex items-center justify-between md:justify-start md:gap-10 px-6 md:px-16 lg:px-36 py-5'>
            <Link to='/' className='flex items-center shrink-0'>
                <img src={assets.logo} alt="ONIX" className='h-12 md:h-14 w-auto object-contain' />
            </Link>

            <div className='flex items-center gap-5'>
                <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium
                                    max-md:text-lg z-50 flex flex-col md:flex-row items-center
                                    max-md:justify-center gap-8 md:px-8 py-3 max-md:h-screen
                                    md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
                                    border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
                    <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
                    <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }} to='/'>Home</Link>
                    <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }} to='/movie' className='text-gray-300 hover:text-white transition-colors duration-200'>Movies</Link>
                    <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }} to='/theatre' className='text-gray-300 hover:text-white transition-colors duration-200'>Theaters</Link>
                    <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }} to='/releases' className='text-gray-300 hover:text-white transition-colors duration-200'>Releases</Link>
                    <Link onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }} to='/Favourite' className='text-gray-300 hover:text-white transition-colors duration-200'>Favorites</Link>
                </div>

                <div className='flex items-center gap-4'>
                    <SearchIcon className='max-md:hidden w-5 h-5 cursor-pointer text-gray-300 hover:text-white transition-colors duration-200' />
                    {
                        !user ? (
                            <button onClick={openSignIn} className='px-5 py-2 bg-primary hover:opacity-90 text-white transition rounded-full font-medium text-sm cursor-pointer shadow-md'>
                                Login
                            </button>
                        ) : (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action label="My booking" labelIcon={<TicketPlus width={20} />} onClick={() => navigate('/mybooking')} />
                                </UserButton.MenuItems>
                            </UserButton>
                        )
                    }
                </div>

                <MenuIcon className='max-md:ml-2 md:hidden w-8 h-8 cursor-pointer text-white' onClick={() => setIsOpen(!isOpen)} />
            </div>
        </div>
    )
}

export default Navbar