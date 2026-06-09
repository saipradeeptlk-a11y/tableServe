import React from "react"
import axios from 'axios'
import socket from '../socket'
export default function KitchenPage() {
    const [orderlist, setOrderList] = React.useState([])
    const [error, setError] = React.useState('')


    React.useEffect(() => {
        fetchOrders()

        socket.on('newOrder', () => {
            fetchOrders()
        })

        socket.on('orderUpdated', () => {
            fetchOrders()
        })

        return () => {
            socket.off('newOrder')
            socket.off('orderUpdated')
            socket.off('orderClosed')
        }
    }, [])

    async function fetchOrders() {
        try {
            const token = localStorage.getItem('token')
            const orders = await axios.get(`http://localhost:5000/api/orders/`, {

                headers: {
                    Authorization: `Bearer ${token}`
                }

            })
            setOrderList(orders.data.orders)


        } catch {
            setError("unable to fetch orders")
        }
    }


    async function handleItemStatus(props) {
        console.log("Sending:", props)

        try {
            const token = localStorage.getItem('token')
            const item = await axios.put(`http://localhost:5000/api/orders/${props.orderId}/items/${props.itemId}/status`, {
                status: props.status
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fetchOrders()

        } catch {
            setError("Unable to update item status")

        }
    }



    return (
        <div>
            <h1>Kitchen Dashboard</h1>
            {error && <p>{error}</p>}

            {orderlist.map(order => (
                <div key={order._id}>
                    <h2>Table {order.tableNumber}</h2>
                    <p>Status: {order.overallStatus}</p>

                    {order.items.map(item => (
                        <div key={item._id}>
                            <p>item name: {item.menuItem?.name || 'Item deleted'}</p>
                            <p>item quantity: {item.quantity}</p>
                            <p>item status: {item.status}</p>

                            {item.status === "pending" && <button onClick={() => handleItemStatus({ orderId: order._id, itemId: item._id, status: "preparing" })}>Preparing</button>}
                            {item.status === "preparing" && <button onClick={() => handleItemStatus({ orderId: order._id, itemId: item._id, status: "done" })}>Done</button>}
                        </div>
                    ))}

                </div>
            ))}
            {(orderlist.length === 0) && <p>No active orders</p>}
        </div>
    )
}