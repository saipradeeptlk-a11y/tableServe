import React from "react"
import axios from 'axios'

export default function Tables() {
    const [tables, setTables] = React.useState([])
    const [error, setError] = React.useState('')
    const [tableNumber, setTableNumber] = React.useState('')
    const [status, setStatus] = React.useState('available')

    async function fetchTables() {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:5000/api/table', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTables(response.data.t)
        } catch {
            setError("Unable to fetch tables")
        }
    }

    React.useEffect(() => {
        fetchTables()
    }, [])

    async function handleAddTable() {
        try {
            const token = localStorage.getItem('token')
            await axios.post('http://localhost:5000/api/table',
                { TableNumber: tableNumber, Status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTables()
        } catch {
            setError("Unable to add table")
        }
    }

    async function handleUpdateStatus(id, newStatus) {
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:5000/api/table/${id}`,
                { Status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTables()
        } catch {
            setError("Unable to update table status")
        }
    }

    return (
        <div>
            <h1>Tables</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Add Table Form */}
            <div>
                <h2>Add New Table</h2>
                <label>
                    Table Number:
                    <input
                        type="number"
                        onChange={(e) => setTableNumber(e.target.value)}
                    />
                </label>
                <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="closed">Closed</option>
                </select>
                <button onClick={handleAddTable}>Add Table</button>
            </div>

            {/* Tables List */}
            <div>
                <h2>All Tables</h2>
                {tables.length === 0 && <p>No tables found</p>}
                {tables.map(table => (
                    <div key={table._id}>
                        <p>Table Number: {table.TableNumber}</p>
                        <p>Status: {table.Status}</p>
                        <button onClick={() => handleUpdateStatus(table._id, 'available')}>Available</button>
                        <button onClick={() => handleUpdateStatus(table._id, 'occupied')}>Occupied</button>
                        <button onClick={() => handleUpdateStatus(table._id, 'closed')}>Closed</button>
                    </div>
                ))}
            </div>
        </div>
    )
}