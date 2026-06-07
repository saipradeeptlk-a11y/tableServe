import React from "react";
import axios from 'axios';

export default function AllOrders() {
    const [order, setOrder] = React.useState([])
    const [startDate, setStartDate] = React.useState(new Date().toISOString().split("T")[0])
    const [endDate, setEndDate] = React.useState(new Date().toISOString().split("T")[0])
    React.useEffect(() => {
        const fetchAllOrder = async () => {
            const token = localStorage.getItem('token')
            const response = await axios.get('http://localhost:5000/api/orders/all', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrder(response.data.orders)
        }
        fetchAllOrder()
    }, [])

    const filteredOrders = order.filter(o => {
        const orderDate = new Date(o.createdAt)
        const start = startDate ? new Date(startDate) : null
        const end = endDate ? new Date(endDate) : null

        if (start && orderDate < start) return false
        if (end && orderDate > end) return false
        return true
    })

    return (<>
        <h1>All My Orders</h1>
        <label >Select Start Date</label>
        <input type="date" onChange={(e) => setStartDate(e.target.value)} />
        <label >Select End Date</label>
        <input type="date" onChange={(e) => setEndDate(e.target.value)} />

        {filteredOrders.map(order => (
            <div key={order._id}>
                <p>Table : {order.tableNumber}</p>
                <p>{order.overallStatus}</p>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
                {
                    order.items.map(item => (
                        <div key={item._id}>
                            <p>{item.menuItem.name}</p>
                            <p>{item.quantity}</p>
                            <p>{item.status}</p>
                        </div>
                    ))
                }

            </div>

        ))}
        {filteredOrders.length === 0 && <p>No orders found</p>}

    </>)
}