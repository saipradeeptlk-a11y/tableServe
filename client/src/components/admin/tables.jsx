import React from "react"
import axios from 'axios'

export default function Tables() {
    const [tables, setTables] = React.useState([])
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const [tableNumber, setTableNumber] = React.useState('')
    const [status, setStatus] = React.useState('available')

    async function fetchTables() {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:5000/api/table', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTables(response.data.t)
        } catch { setError('Unable to fetch tables') }
    }

    React.useEffect(() => { fetchTables() }, [])

    async function handleAddTable() {
        try {
            const token = localStorage.getItem('token')
            await axios.post('http://localhost:5000/api/table',
                { TableNumber: tableNumber, Status: status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setSuccess('Table added!')
            fetchTables()
            setTimeout(() => setSuccess(''), 3000)
        } catch { setError('Unable to add table') }
    }

    async function handleUpdateStatus(id, newStatus) {
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:5000/api/table/${id}`,
                { Status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTables()
        } catch { setError('Unable to update table') }
    }

    const statusColor = (status) => {
        if (status === 'available') return 'bg-green-500 bg-opacity-20 text-green-400 border-green-500 border-opacity-30'
        if (status === 'occupied') return 'bg-primary bg-opacity-20 text-primary border-primary border-opacity-30'
        return 'bg-white bg-opacity-10 text-white text-opacity-40 border-white border-opacity-10'
    }

    const available = tables.filter(t => t.Status === 'available')
    const occupied = tables.filter(t => t.Status === 'occupied')
    const closed = tables.filter(t => t.Status === 'closed')

    return (
        <div className="flex flex-col gap-4">

            {error && <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-red-400 text-sm">{error}</p></div>}
            {success && <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-green-400 text-sm">{success}</p></div>}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-white border-opacity-10 rounded-xl p-4">
                    <p className="text-white text-opacity-40 text-xs mb-1">Available</p>
                    <p className="text-green-400 text-2xl font-medium">{available.length}</p>
                </div>
                <div className="bg-card border border-white border-opacity-10 rounded-xl p-4">
                    <p className="text-white text-opacity-40 text-xs mb-1">Occupied</p>
                    <p className="text-primary text-2xl font-medium">{occupied.length}</p>
                </div>
                <div className="bg-card border border-white border-opacity-10 rounded-xl p-4">
                    <p className="text-white text-opacity-40 text-xs mb-1">Closed</p>
                    <p className="text-white text-opacity-40 text-2xl font-medium">{closed.length}</p>
                </div>
            </div>

            {/* Add Table */}
            <div className="bg-card border border-white border-opacity-10 rounded-xl p-5">
                <h2 className="text-white font-medium mb-4">Add New Table</h2>
                <div className="flex gap-3 items-end">
                    <div className="flex-1">
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Table Number</label>
                        <input type="number" placeholder="e.g. 10"
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none" />
                    </div>
                    <div className="flex-1">
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Initial Status</label>
                        <select onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm outline-none">
                            <option value="available">Available</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <button onClick={handleAddTable}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
                        Add Table
                    </button>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="bg-card border border-white border-opacity-10 rounded-xl p-5">
                <h2 className="text-white font-medium mb-4">All Tables</h2>
                {tables.length === 0
                    ? <p className="text-white text-opacity-30 text-sm">No tables found</p>
                    : <div className="grid grid-cols-4 gap-3">
                        {tables.map(table => (
                            <div key={table._id} className={`border rounded-xl p-4 ${statusColor(table.Status)}`}>
                                <p className="font-medium text-lg mb-1">Table {table.TableNumber}</p>
                                <p className="text-xs mb-3 capitalize">{table.Status}</p>
                                <div className="flex flex-col gap-1.5">
                                    {table.Status !== 'available' && (
                                        <button onClick={() => handleUpdateStatus(table._id, 'available')}
                                            className="w-full bg-green-500 bg-opacity-20 text-green-400 text-xs py-1 rounded-md hover:bg-opacity-30">
                                            Available
                                        </button>
                                    )}
                                    {table.Status !== 'closed' && (
                                        <button onClick={() => handleUpdateStatus(table._id, 'closed')}
                                            className="w-full bg-white bg-opacity-10 text-white text-opacity-40 text-xs py-1 rounded-md hover:bg-opacity-20">
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    )
}