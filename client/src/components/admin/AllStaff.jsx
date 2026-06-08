import React from "react"
import axios from 'axios'
export default function AllStaff() {
  const [staff, setStaff] = React.useState([])
  const [error, setError] = React.useState('')
  const [waiter, setWaiter] = React.useState([])
  const [kitchen, setKichen] = React.useState([])
  const [admin, setAdmin] = React.useState([])


  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [role, setRole] = React.useState('waiter')
  async function fetchAllStaff() {
    try {
      console.log("fetchAllStaff called!")
      const token = localStorage.getItem('token')
      const users = await axios.get('http://localhost:5000/api/auth', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setStaff(users.data.staff)
      console.log(setStaff)

    } catch {
      setError("unable to fetch staff")
    }

  }


  function getAllWaiters() {
    const filtered = staff.filter(s => s.role === "waiter")
    setWaiter(filtered)
  }

  function getAllKitchen() {
    const filtered = staff.filter(s => s.role === "kitchen")
    setKichen(filtered)
  }

  function getAllAdmin() {
    const filtered = staff.filter(s => s.role === "admin")
    setAdmin(filtered)
  }
  React.useEffect(() => {
    fetchAllStaff()
  }, [])
  React.useEffect(() => {

    getAllAdmin()
    getAllKitchen()
    getAllWaiters()
  }, [staff])

  async function handleUserRegister() {
    try {

      const token = localStorage.getItem('token')
      const users = await axios.post('http://localhost:5000/api/auth/register', {
        name, email, password, role
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetchAllStaff()


    } catch {
      setError("unable to fetch staff")
    }


  }

  return (
    <>
      <h1>All Staff</h1>
      {error && <p>{error}</p>}
      <form>
        <label>
          Name:
          <input type="String" onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email:
          <input type="String" onChange={(e) => setEmail(e.target.value)} />
        </label>
        <select onChange={(e) => setRole(e.target.value)}>
          <option value="waiter">Waiter</option>
          <option value="kitchen">Kitchen</option>
          <option value="admin">Admin</option>
        </select>
        <label>
          Password:
          <input type="Password" onChange={(e) => setPassword(e.target.value)} />
        </label>

        <button onClick={handleUserRegister}>Add Item</button>
      </form >
      <div>
        <h1>Staff List</h1>
        <h2>Waiters</h2>
        {waiter.map(member => (
          <div key={member._id}>
            <p>Name:{member.name}</p>
            <p>Email:{member.email}</p>
            <p>Role:{member.role}</p>
          </div>
        )

        )

        }
        {waiter.length === 0 && <p>No Waiters found</p>}
        <h2>Kitchen Staff </h2>
        {kitchen.map(member => (
          <div key={member._id}>
            <p>Name:{member.name}</p>
            <p>Email:{member.email}</p>
            <p>Role:{member.role}</p>
          </div>
        )

        )

        }
        {kitchen.length === 0 && <p>No kitchen staff found</p>}
        <h2>Admin</h2>
        {admin.map(member => (
          <div key={member._id}>
            <p>Name:{member.name}</p>
            <p>Email:{member.email}</p>
            <p>Role:{member.role}</p>
          </div>
        )

        )

        }
        {admin.length === 0 && <p>No Admins found</p>}
      </div>
    </>
  )
}