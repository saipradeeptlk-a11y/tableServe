import React from 'react'
import axios from 'axios'
import socket from '../socket'

export default function KitchenPage() {
    const [orderlist, setOrderList] = React.useState([])
    const [error, setError] = React.useState('')

    React.useEffect(() => {
        fetchOrders()
        socket.on('newOrder', () => fetchOrders())
        socket.on('orderUpdated', () => fetchOrders())
        socket.on('orderClosed', () => fetchOrders())
        return () => {
            socket.off('newOrder')
            socket.off('orderUpdated')
            socket.off('orderClosed')
        }
    }, [])

    async function fetchOrders() {
        try {
            const token = localStorage.getItem('token')
            const orders = await axios.get('http://localhost:5000/api/orders/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrderList(orders.data.orders)
        } catch {
            setError('Unable to fetch orders')
        }
    }

    async function handleItemStatus(props) {
        try {
            const token = localStorage.getItem('token')
            await axios.put(
                `http://localhost:5000/api/orders/${props.orderId}/items/${props.itemId}/status`,
                { status: props.status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchOrders()
        } catch {
            setError('Unable to update item status')
        }
    }

    return (
        <div className="min-h-screen bg-dark flex">

            {/* Sidebar */}
            <div className="w-48 bg-card border-r border-white border-opacity-10 flex flex-col p-4">
                <div className="text-primary font-medium text-lg pb-5 mb-4 border-b border-white border-opacity-10">
                    Table<span className="text-white">Serve</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-primary rounded-lg text-white text-sm">
                    <span>🍳</span> Kitchen
                </div>
                <div className="flex items-center gap-2 px-3 py-2 text-white text-opacity-50 text-sm mt-1 rounded-lg">
                    <span>📋</span> History
                </div>
                <div className="mt-auto pt-4 border-t border-white border-opacity-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary bg-opacity-30 flex items-center justify-center text-primary text-xs font-medium">
                        KC
                    </div>
                    <div>
                        <div className="text-white text-xs font-medium">Kitchen</div>
                        <div className="text-white text-opacity-40 text-xs">Staff</div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 p-6 flex flex-col gap-4">

                {/* Topbar */}
                <div className="flex justify-between items-center">
                    <h1 className="text-white text-xl font-medium">Kitchen Dashboard</h1>
                    <div className="flex items-center gap-2 bg-green-500 bg-opacity-20 text-green-400 text-xs px-3 py-1.5 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        Live — {orderlist.length} Orders
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Orders Grid */}
                {orderlist.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-white text-opacity-30 text-lg">No active orders</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {orderlist.map(order => (
                            <div key={order._id} className="bg-card border border-white border-opacity-10 rounded-xl p-4">

                                {/* Order Header */}
                                <div className="flex justify-between items-center mb-3 pb-3 border-b border-white border-opacity-10">
                                    <span className="text-white font-medium">Table {order.tableNumber}</span>
                                    <span className="text-white text-opacity-30 text-xs">
                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                {/* Items */}
                                {order.items.map(item => (
                                    <div key={item._id} className="flex justify-between items-center py-2 border-b border-white border-opacity-5 last:border-0">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'done' ? 'bg-green-400' :
                                                    item.status === 'preparing' ? 'bg-blue-400' :
                                                        'bg-white bg-opacity-20'
                                                    }`}></div>
                                                <span className="text-white text-opacity-85 text-sm">
                                                    {item.menuItem?.name || 'Item deleted'}
                                                </span>
                                            </div>
                                            <span className="text-white text-opacity-30 text-xs ml-4">Qty: {item.quantity}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {item.status === 'pending' && (
                                                <button
                                                    onClick={() => handleItemStatus({ orderId: order._id, itemId: item._id, status: 'preparing' })}
                                                    className="bg-blue-600 text-white text-xs px-2.5 py-1 rounded-md font-medium hover:bg-blue-700"
                                                >
                                                    Prep
                                                </button>
                                            )}
                                            {item.status === 'preparing' && (
                                                <button
                                                    onClick={() => handleItemStatus({ orderId: order._id, itemId: item._id, status: 'done' })}
                                                    className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-md font-medium hover:bg-green-700"
                                                >
                                                    Done
                                                </button>
                                            )}
                                            {item.status === 'done' && (
                                                <span className="text-green-400 text-xs px-2.5 py-1">✓ Done</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}