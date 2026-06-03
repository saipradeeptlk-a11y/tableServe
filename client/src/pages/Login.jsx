import React from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Login(){
    const [email,setEmail] = React.useState('')
    const [password,setPassword] = React.useState('')
    const [error,setError] = React.useState('')

    const navigate = useNavigate()

    const handleLogin = async (e) =>{
        e.preventDefault()
        try{
           const response = await axios.post('http://localhost:5000/api/auth/login',{
             email,
             password

           })
           localStorage.setItem('token', response.data.token)
           localStorage.setItem('role', response.data.role)

           const role = response.data.role
            if (role === 'waiter') navigate('/waiter')
            if (role === 'kitchen') navigate('/kitchen')
            if (role === 'admin') navigate('/admin')

        } catch (err) {
            setError('Invalid email or password')
        }
        

    }

    return(
        <div>
            <h1>TableServe Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit">Login</button>
            </form>
        </div>
        

    )
}