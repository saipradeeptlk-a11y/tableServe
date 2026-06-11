import React from "react"
import axios from 'axios'

export default function AllOrders() {
    const [order, setOrder] = React.useState([])
    const [error, setError] = React.useState('')
    const [startDate, setStartDate] = React.useState('')
    const [endDate, setEndDate] = React.useState('')

    React.useEffect(() => {
        fetchAllOrder()
    }, [])

    async function fetchAllOrder() {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get('https://tableserve-u7mk.onrender.com/api/orders/all', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrder(response.data.orders)
        } catch {
            setError('Failed to fetch orders')
        }
    }

    const filteredOrders = order.filter(o => {
        const orderDate = new Date(o.createdAt)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null
        if (start && orderDate < start) return false
        if (end && orderDate > end) return false
        return true
    })

    return (
        <div className="flex flex-col gap-4">

            {error && <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-red-400 text-sm">{error}</p></div>}

            {/* Date Filter */}
            <div className="bg-card border border-white border-opacity-10 rounded-xl p-4 flex items-center gap-4">
                <span className="text-white text-opacity-50 text-sm">Filter by date:</span>
                <div className="flex items-center gap-2">
                    <label className="text-white text-opacity-40 text-xs">From</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-1.5 text-white text-sm outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-white text-opacity-40 text-xs">To</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-1.5 text-white text-sm outline-none"
                    />
                </div>
                <button
                    onClick={() => { setStartDate(''); setEndDate('') }}
                    className="text-white text-opacity-40 text-xs border border-white border-opacity-10 px-3 py-1.5 rounded-lg hover:bg-white hover:bg-opacity-5"
                >
                    Clear
                </button>
                <span className="ml-auto text-white text-opacity-40 text-xs">{filteredOrders.length} orders</span>
            </div>

            {/* Orders Grid */}
            {filteredOrders.length === 0
                ? <div className="bg-card border border-white border-opacity-10 rounded-xl p-10 text-center"><p className="text-white text-opacity-30">No orders found</p></div>
                : <div className="grid grid-cols-2 gap-4">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-card border border-white border-opacity-10 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white border-opacity-10">
                                <div>
                                    <span className="text-white font-medium">Table {order.tableNumber}</span>
                                    <p className="text-white text-opacity-30 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString()}</p>
                                </div>
                                <span className={`text-xs px-2.5 py-1 rounded-full ${order.overallStatus === 'done'
                                    ? 'bg-green-500 bg-opacity-20 text-green-400'
                                    : 'bg-primary bg-opacity-20 text-primary'
                                    }`}>
                                    {order.overallStatus}
                                </span>
                            </div>
                            {order.items.map(item => (
                                <div key={item._id} className="flex justify-between items-center py-1.5 border-b border-white border-opacity-5 last:border-0">
                                    <span className="text-white text-opacity-70 text-sm">{item.menuItem?.name || 'Item deleted'}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white text-opacity-30 text-xs">x{item.quantity}</span>
                                        <span className={`text-xs ${item.status === 'done' ? 'text-green-400' :
                                            item.status === 'preparing' ? 'text-blue-400' :
                                                'text-white text-opacity-30'
                                            }`}>{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}