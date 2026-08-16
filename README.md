# ONIX - Movie Booking Platform

<div align="center">

<img src="./client/public/images/oinx-logo.png" alt="ONIX Movie Ticket Booking" width="700">

<h1>ONIX — Movie Ticket Booking</h1>

<p>A modern full-stack movie discovery and ticket booking platform.</p>

</div>
## Features
- **Cinematic Hero Banner**: Dynamic hero presentation featuring upcoming releases like *Spider-Man: Brand New Day*.
- **Authentication**: Seamless user login and session management powered by Clerk.
- **Seat Booking & Layout**: Interactive seat selection system.
- **Movie Catalog & Details**: Browse upcoming and trending movies, trailers, and cast information.
- **My Bookings & Favorites**: Track reservations and save favorite movies.

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v7
- **Authentication**: Clerk React SDK
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn / pnpm

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/OINX.git
   cd OINX/client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file inside the `client/` directory with your Clerk key:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
