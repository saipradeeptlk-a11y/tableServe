import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import {UtensilsCrossed} from 'lucide-react'

export default function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const navigate = useNavigate()

    React.useEffect(() => {
        async function checkSetup() {
            try {
                const response = await axios.get('https://tableserve-u7mk.onrender.com/api/setup/check')
                if (!response.data.setupComplete) navigate('/setup')
            } catch { }
        }
        checkSetup()
    }, [])

    async function handleLogin() {
        if (!email || !password) { setError('Please fill in all fields'); return }
        try {
            const response = await axios.post('https://tableserve-u7mk.onrender.com/api/auth/login', { email, password })
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('role', response.data.role)
            if (response.data.role === 'waiter') navigate('/waiter')
            else if (response.data.role === 'kitchen') navigate('/kitchen')
            else if (response.data.role === 'admin') navigate('/admin')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden px-4">

            {/* Background */}
            <div className="absolute w-64 h-64 rounded-full -top-20 -right-16" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent)' }}></div>
            <div className="absolute w-48 h-48 rounded-full top-10 -left-16" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent)' }}></div>
            <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, rgba(249,115,22,0.08), transparent)' }}></div>
            <div className="absolute bottom-0 left-14 w-28 h-44 rounded-t-full opacity-10" style={{ background: 'linear-gradient(to top, #F97316, #FCD34D, transparent)', transform: 'rotate(-15deg)' }}></div>
            <div className="absolute bottom-0 left-44 w-24 h-40 rounded-t-full opacity-10" style={{ background: 'linear-gradient(to top, #EA580C, #F97316, transparent)', transform: 'rotate(5deg)' }}></div>
            <div className="absolute bottom-0 right-20 w-24 h-40 rounded-t-full opacity-10" style={{ background: 'linear-gradient(to top, #EA580C, #F97316, transparent)', transform: 'rotate(15deg)' }}></div>

            {/* Card — w-full on mobile, w-96 on desktop */}
            <div className="relative z-10 w-full max-w-md rounded-2xl p-8 sm:p-10" style={{ background: 'rgba(22,33,62,0.95)', border: '0.5px solid rgba(249,115,22,0.2)' }}>

                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-2xl mb-3"><UtensilsCrossed/></div>
                    <h1 className="text-white text-2xl font-medium">TableServe</h1>
                    <p className="text-white text-opacity-40 text-sm mt-1">Restaurant Management System</p>
                </div>

                {error && (
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="text-white text-opacity-60 text-sm mb-2 block">Email address</label>
                    <input
                        type="email"
                        placeholder="you@restaurant.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-3 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-white text-opacity-60 text-sm mb-2 block">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-3 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                    />
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-primary text-white rounded-lg py-3 font-medium text-sm hover:opacity-90 transition-opacity"
                >
                    Sign in
                </button>

                <p className="text-center text-white text-opacity-20 text-xs mt-6">TableServe v1.0 </p>
            </div>
        </div>
    )
}