import React from "react"
import axios from 'axios'

export default function AllStaff() {
  const [staff, setStaff] = React.useState([])
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [waiter, setWaiter] = React.useState([])
  const [kitchen, setKitchen] = React.useState([])
  const [admin, setAdmin] = React.useState([])
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [role, setRole] = React.useState('waiter')

  async function fetchAllStaff() {
    try {
      const token = localStorage.getItem('token')
      const users = await axios.get('https://tableserve-u7mk.onrender.com/api/auth', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setStaff(users.data.staff)
    } catch { setError('Unable to fetch staff') }
  }

  React.useEffect(() => { fetchAllStaff() }, [])

  React.useEffect(() => {
    setWaiter(staff.filter(s => s.role === 'waiter'))
    setKitchen(staff.filter(s => s.role === 'kitchen'))
    setAdmin(staff.filter(s => s.role === 'admin'))
  }, [staff])

  async function handleUserRegister() {
    try {
      const token = localStorage.getItem('token')
      await axios.post('https://tableserve-u7mk.onrender.com/api/auth/register',
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSuccess('Staff registered!')
      fetchAllStaff()
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Unable to register staff') }
  }

  const roleColor = (role) => {
    if (role === 'waiter') return 'bg-primary bg-opacity-20 text-primary'
    if (role === 'kitchen') return 'bg-blue-500 bg-opacity-20 text-blue-400'
    return 'bg-green-500 bg-opacity-20 text-green-400'
  }

  const avatarColor = (role) => {
    if (role === 'waiter') return 'bg-primary bg-opacity-30 text-primary'
    if (role === 'kitchen') return 'bg-blue-500 bg-opacity-30 text-blue-400'
    return 'bg-green-500 bg-opacity-30 text-green-400'
  }

  const StaffSection = ({ title, members }) => (
    <div className="bg-card border border-white border-opacity-10 rounded-xl p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white font-medium">{title}</h2>
        <span className="text-white text-opacity-40 text-xs">{members.length} members</span>
      </div>
      {members.length === 0
        ? <p className="text-white text-opacity-30 text-sm">No {title.toLowerCase()} found</p>
        : <div className="grid grid-cols-2 gap-3">
          {members.map(member => (
            <div key={member._id} className="flex items-center gap-3 bg-white bg-opacity-3 border border-white border-opacity-5 rounded-lg p-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${avatarColor(member.role)}`}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{member.name}</p>
                <p className="text-white text-opacity-40 text-xs truncate">{member.email}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${roleColor(member.role)}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      }
    </div>
  )

  return (
    <div className="flex flex-col gap-4">

      {error && <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-red-400 text-sm">{error}</p></div>}
      {success && <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-green-400 text-sm">{success}</p></div>}

      {/* Register Form */}
      <div className="bg-card border border-white border-opacity-10 rounded-xl p-5">
        <h2 className="text-white font-medium mb-4">Register New Staff</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-white text-opacity-50 text-xs mb-1.5 block">Full Name</label>
            <input type="text" placeholder="e.g. John Doe" onChange={(e) => setName(e.target.value)}
              className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none" />
          </div>
          <div>
            <label className="text-white text-opacity-50 text-xs mb-1.5 block">Email</label>
            <input type="email" placeholder="staff@restaurant.com" onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none" />
          </div>
          <div>
            <label className="text-white text-opacity-50 text-xs mb-1.5 block">Password</label>
            <input type="password" placeholder="••••••••" onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none" />
          </div>
          <div>
            <label className="text-white text-opacity-50 text-xs mb-1.5 block">Role</label>
            <select onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm outline-none">
              <option value="waiter">Waiter</option>
              <option value="kitchen">Kitchen</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <button onClick={handleUserRegister}
          className="mt-4 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
          Register Staff
        </button>
      </div>

      <StaffSection title="Waiters" members={waiter} />
      <StaffSection title="Kitchen Staff" members={kitchen} />
      <StaffSection title="Admins" members={admin} />
    </div>
  )
}