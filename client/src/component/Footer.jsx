import React from "react"
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <footer className="mt-20 px-6 md:px-16 lg:px-36 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
                <div className="md:max-w-96">
                    <img alt="ONIX" className="h-11 object-contain" src={assets.logo} />
                    <p className="mt-6 text-sm">
                        Discover, book, and enjoy your favorite movies with ONIX. Experience hassle-free movie ticket bookings with real-time seat selections and exclusive offers.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src={assets.googlePlay} alt="google play" className="h-10 w-auto border border-white rounded" />
                        <img src={assets.appStore} alt="app store" className="h-10 w-auto border border-white rounded" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5 text-white">Company</h2>
                        <ul className="text-sm space-y-2">
                            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                            <li><Link to="/movie" className="hover:text-white transition">Movies</Link></li>
                            <li><a href="#" className="hover:text-white transition">About us</a></li>
                            <li><a href="#" className="hover:text-white transition">Contact us</a></li>
                            <li><a href="#" className="hover:text-white transition">Privacy policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-white">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+1-234-567-890</p>
                            <p>support@onix.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © ONIX. All Rights Reserved.
            </p>
        </footer>
    )
}

export default Footer