import React from "react"
import AllOrders from "../components/admin/AllOrders"
import AllStaff from "../components/admin/AllStaff"
import MyMenu from "../components/admin/MyMenu"
import Tables from "../components/admin/tables"

export default function AdminPage() {
    const [activeTab, setActiveTab] = React.useState('orders')

    return (
        <div className="min-h-screen bg-dark flex">

            {/* Sidebar */}
            <div className="w-48 bg-card border-r border-white border-opacity-10 flex flex-col p-4">
                <div className="text-primary font-medium text-lg pb-5 mb-4 border-b border-white border-opacity-10">
                    Table<span className="text-white">Serve</span>
                </div>
                {[
                    { key: 'orders', label: 'Orders', icon: '📋' },
                    { key: 'menu', label: 'Menu', icon: '🍽️' },
                    { key: 'staff', label: 'Staff', icon: '👥' },
                    { key: 'tables', label: 'Tables', icon: '🪑' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 text-left transition-all ${activeTab === tab.key
                                ? 'bg-primary text-white'
                                : 'text-white text-opacity-50 hover:bg-white hover:bg-opacity-5'
                            }`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
                <div className="mt-auto pt-4 border-t border-white border-opacity-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary bg-opacity-30 flex items-center justify-center text-primary text-xs font-medium">AD</div>
                    <div>
                        <div className="text-white text-xs font-medium">Admin</div>
                        <div className="text-white text-opacity-40 text-xs">Administrator</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white text-xl font-medium">
                        {activeTab === 'orders' && 'All Orders'}
                        {activeTab === 'menu' && 'Menu Management'}
                        {activeTab === 'staff' && 'Staff Management'}
                        {activeTab === 'tables' && 'Table Management'}
                    </h1>
                </div>

                {activeTab === 'orders' && <AllOrders />}
                {activeTab === 'menu' && <MyMenu />}
                {activeTab === 'staff' && <AllStaff />}
                {activeTab === 'tables' && <Tables />}
            </div>
        </div>
    )
}