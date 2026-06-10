import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SetupPage() {
    const [name, setName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        async function checkSetup() {
            try {
                const response = await axios.get('http://localhost:5000/api/setup/check')
                if (response.data.setupComplete) {
                    navigate('/')
                }
            } catch { }
        }
        checkSetup()
    }, [])

    async function handleSetup() {
        if (!name || !email || !password) {
            setError('Please fill in all fields')
            return
        }
        try {
            setLoading(true)
            await axios.post('http://localhost:5000/api/setup', { name, email, password })
            setSuccess('Admin account created! Redirecting to login...')
            setTimeout(() => navigate('/'), 2000)
        } catch (err) {
            setError(err.response?.data?.message || 'Setup failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center relative overflow-hidden">

            {/* Background circles */}
            <div className="absolute w-64 h-64 rounded-full -top-20 -right-16" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent)' }}></div>
            <div className="absolute w-48 h-48 rounded-full top-10 -left-16" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.1), transparent)' }}></div>
            <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to top, rgba(249,115,22,0.08), transparent)' }}></div>

            {/* Flames */}
            <div className="absolute bottom-0 left-14 w-28 h-44 rounded-t-full opacity-10" style={{ background: 'linear-gradient(to top, #F97316, #FCD34D, transparent)', transform: 'rotate(-15deg)' }}></div>
            <div className="absolute bottom-0 left-44 w-24 h-40 rounded-t-full opacity-10" style={{ background: 'linear-gradient(to top, #EA580C, #F97316, transparent)', transform: 'rotate(5deg)' }}></div>
            <div className="absolute bottom-0 right-20 w-24 h-40 rounded-t-full opacity-10" style={{ background: 'linear-gradient(to top, #EA580C, #F97316, transparent)', transform: 'rotate(15deg)' }}></div>

            {/* Card */}
            <div className="relative z-10 w-96 rounded-2xl p-10" style={{ background: 'rgba(22,33,62,0.95)', border: '0.5px solid rgba(249,115,22,0.2)' }}>

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-2xl mb-3">🍽️</div>
                    <h1 className="text-white text-2xl font-medium">TableServe</h1>
                    <p className="text-white text-opacity-40 text-sm mt-1">First Time Setup</p>
                    <p className="text-white text-opacity-30 text-xs mt-2 text-center">Create your admin account to get started</p>
                </div>

                {error && (
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2 mb-4">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg px-4 py-2 mb-4">
                        <p className="text-green-400 text-sm">{success}</p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="text-white text-opacity-60 text-sm mb-2 block">Full Name</label>
                    <input
                        type="text"
                        placeholder="e.g. John Smith"
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-3 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                    />
                </div>

                <div className="mb-4">
                    <label className="text-white text-opacity-60 text-sm mb-2 block">Email address</label>
                    <input
                        type="email"
                        placeholder="admin@restaurant.com"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-3 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                    />
                </div>

                <div className="mb-6">
                    <label className="text-white text-opacity-60 text-sm mb-2 block">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-3 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                    />
                    <p className="text-white text-opacity-30 text-xs mt-1.5">Must be 8+ chars with uppercase, lowercase, number and special character</p>
                </div>

                <button
                    onClick={handleSetup}
                    disabled={loading}
                    className="w-full bg-primary text-white rounded-lg py-3 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                    {loading ? 'Creating account...' : 'Create Admin Account'}
                </button>

                <p className="text-center text-white text-opacity-20 text-xs mt-6">This page is only accessible once</p>
            </div>
        </div>
    )
}