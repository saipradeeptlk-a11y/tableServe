import React from "react"
import AllOrders from "../components/admin/AllOrders"
import AllStaff from "../components/admin/AllStaff"
import MyMenu from "../components/admin/MyMenu"
import Tables from "../components/admin/tables"

export default function AdminPage() {
    const [activeTab, setactiveTab] = React.useState('orders')
    return (
        <>
            <h1>Admin Dashboard</h1>
            <div>
                <button onClick={() => { setactiveTab("orders") }}>Orders</button>
                <button onClick={() => { setactiveTab("menu") }}>Menu</button>
                <button onClick={() => { setactiveTab("staff") }}>Staff</button>
                <button onClick={() => { setactiveTab("tables") }}>tables</button>
            </div>
            {activeTab === 'orders' && <AllOrders />}
            {activeTab === 'menu' && <MyMenu />}
            {activeTab === 'staff' && <AllStaff />}
            {activeTab === 'tables' && <Tables />}
        </>
    )
}