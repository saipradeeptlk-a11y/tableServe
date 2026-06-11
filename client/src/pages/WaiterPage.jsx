import React from 'react'
import axios from 'axios'
import socket from '../socket'

export default function WaiterPage() {
  const [tableNumber, setTableNumber] = React.useState('')
  const [selectedCourse, setSelectedCourse] = React.useState('Starter')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [menuItems, setMenuItems] = React.useState([])
  const [searchResults, setSearchResults] = React.useState([])
  const [orderItems, setOrderItems] = React.useState([])
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [tableOrder, setTableOrder] = React.useState([])
  const [activeTable, setActiveTable] = React.useState('')
  const activeTableRef = React.useRef('')
  const [notifications, setNotifications] = React.useState([])
  const [availableTables, setAvailableTables] = React.useState([])
  const [aiQuestion, setAiQuestion] = React.useState('')
  const [aiAnswer, setAiAnswer] = React.useState('')
  const [aiLoading, setAiLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('order') // ✅ mobile tab switcher

  React.useEffect(() => {
    fetchMenu()
    fetchAvailableTables()
    getMyorders()

    socket.on('orderUpdated', () => getMyorders())
    socket.on('courseReady', (data) => {
      setNotifications(prev => [...prev, `Table ${data.tableNumber} — ${data.course}s are ready! 🍽️`])
    })
    socket.on('orderClosed', () => {
      getMyorders()
      fetchAvailableTables()
    })
    return () => {
      socket.off('orderUpdated')
      socket.off('courseReady')
      socket.off('orderClosed')
    }
  }, [])

  async function fetchMenu() {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('https://tableserve-u7mk.onrender.com/api/menu', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setMenuItems(response.data.items)
    } catch { setError('Failed to load menu') }
  }

  async function fetchAvailableTables() {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('https://tableserve-u7mk.onrender.com/api/table', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const available = response.data.t.filter(t => t.Status === 'available')
      setAvailableTables(available)
    } catch { setError('Failed to load tables') }
  }

  async function getMyorders() {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('https://tableserve-u7mk.onrender.com/api/orders/active', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTableOrder(response.data.orders)
    } catch { setError('Failed to fetch orders') }
  }

  React.useEffect(() => {
    if (!searchQuery) { setSearchResults([]); return }
    const filtered = menuItems.filter(item =>
      item.course === selectedCourse &&
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(filtered)
  }, [searchQuery, selectedCourse, menuItems])

  function handleAddItem(item) {
    if (orderItems.find(i => i._id === item._id)) { setError('Item already added!'); return }
    setOrderItems(prev => [...prev, { ...item, quantity: 1 }])
    setSearchQuery('')
    setSearchResults([])
    setError('')
  }

  function handleIncreaseQuantity(id) {
    setOrderItems(prev => prev.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i))
  }

  function handleDecreaseQuantity(id) {
    setOrderItems(prev => prev.map(i => i._id === id ? i.quantity === 1 ? i : { ...i, quantity: i.quantity - 1 } : i))
  }

  function handleRemoveItem(id) {
    setOrderItems(prev => prev.filter(item => item._id !== id))
  }

  async function handleSendOrder() {
    if (!tableNumber) { setError('Please select a table'); return }
    if (orderItems.length === 0) { setError('Please add at least one item!'); return }
    try {
      const token = localStorage.getItem('token')
      await axios.post('https://tableserve-u7mk.onrender.com/api/orders', {
        tableNumber: Number(tableNumber),
        items: orderItems.map(item => ({
          menuItem: item._id,
          quantity: item.quantity || 1,
          status: 'pending'
        }))
      }, { headers: { Authorization: `Bearer ${token}` } })
      setSuccess('Order sent to kitchen!')
      setActiveTable(tableNumber)
      activeTableRef.current = String(tableNumber)
      localStorage.setItem('activeTable', String(tableNumber))
      setOrderItems([])
      setTableNumber('')
      setError('')
      fetchAvailableTables()
      getMyorders()
      setActiveTab('orders') // ✅ switch to orders tab on mobile after sending
      setTimeout(() => setSuccess(''), 3000)
    } catch { setError('Failed to send order') }
  }

  async function handleCloseOrder(orderId) {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`https://tableserve-u7mk.onrender.com/api/orders/${orderId}/status`,
        { status: 'closed' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      getMyorders()
      fetchAvailableTables()
    } catch (error) {
      setError(error.response?.data?.message || 'Unable to close order — make sure all items are done first')
    }
  }

  async function handleAskAI() {
    if (!aiQuestion) return
    try {
      setAiLoading(true)
      const token = localStorage.getItem('token')
      const response = await axios.post('https://tableserve-u7mk.onrender.com/api/ai/ask',
        { question: aiQuestion },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setAiAnswer(response.data.answer)
    } catch { setError('AI request failed') }
    finally { setAiLoading(false) }
  }

  const starters = orderItems.filter(i => i.course === 'Starter')
  const mains = orderItems.filter(i => i.course === 'Main')
  const desserts = orderItems.filter(i => i.course === 'Dessert')

  return (
    <div className="min-h-screen bg-dark flex flex-col">

      {/* Topbar */}
      <div className="bg-card border-b border-white border-opacity-10 px-4 sm:px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-primary font-medium text-lg">Table<span className="text-white">Serve</span></span>
          <div className="hidden sm:block w-px h-6 bg-white bg-opacity-10"></div>
          <span className="hidden sm:block text-white text-opacity-60 text-sm">Waiter Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-white text-sm font-medium">Waiter</div>
            <div className="text-white text-opacity-40 text-xs">Staff</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">W</div>
        </div>
      </div>

      {/* Mobile Tab Switcher — only shows on mobile */}
      <div className="flex sm:hidden border-b border-white border-opacity-10">
        {['order', 'orders', 'ai'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-all ${activeTab === tab
              ? 'text-primary border-b-2 border-primary'
              : 'text-white text-opacity-40'
              }`}
          >
            {tab === 'order' ? '🍽️ New Order' : tab === 'orders' ? '📋 Active' : '🤖 AI'}
          </button>
        ))}
      </div>

      {/* Alerts */}
      <div className="px-4 sm:px-6 pt-3 flex flex-col gap-2">
        {notifications.map((note, index) => (
          <div key={index} className="flex justify-between items-center bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg px-4 py-2">
            <span className="text-green-400 text-sm">{note}</span>
            <button onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))} className="text-green-400 text-lg">×</button>
          </div>
        ))}
        {error && <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-red-400 text-sm">{error}</p></div>}
        {success && <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-green-400 text-sm">{success}</p></div>}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 sm:p-6">

        {/* Desktop — side by side, Mobile — tabs */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">

          {/* Order Builder — hidden on mobile when not active tab */}
          <div className={`bg-card border border-white border-opacity-10 rounded-xl p-5 flex flex-col gap-4 ${activeTab !== 'order' ? 'hidden sm:flex' : 'flex'}`}>
            <h2 className="text-white font-medium">New Order</h2>

            <select
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              style={{ backgroundColor: '#16213E', color: 'white' }}
              className="w-full border border-white border-opacity-10 rounded-lg px-4 py-2.5 text-sm outline-none"
            >
              <option value="" style={{ backgroundColor: '#16213E', color: 'white' }}>Select a table</option>
              {availableTables.map(table => (
                <option key={table._id} value={table.TableNumber} style={{ backgroundColor: '#16213E', color: 'white' }}>
                  Table {table.TableNumber}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              {['Starter', 'Main', 'Dessert'].map(course => (
                <button
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedCourse === course
                    ? 'bg-primary text-white'
                    : 'bg-white bg-opacity-5 text-white text-opacity-50 border border-white border-opacity-10'
                    }`}
                >
                  {course}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${selectedCourse} dishes...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-card border border-white border-opacity-10 rounded-lg mt-1 z-10 overflow-hidden">
                  {searchResults.map(item => (
                    <div key={item._id} onClick={() => handleAddItem(item)} className="px-4 py-3 text-white text-sm cursor-pointer hover:bg-white hover:bg-opacity-5 flex justify-between">
                      <span>{item.name}</span>
                      <span className="text-white text-opacity-40">Rs. {item.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-64 sm:max-h-none">
              {[{ title: 'Starters', items: starters }, { title: 'Main Course', items: mains }, { title: 'Desserts', items: desserts }].map(section => (
                <div key={section.title}>
                  <h3 className="text-white text-opacity-40 text-xs uppercase tracking-wider mb-2">{section.title}</h3>
                  {section.items.length === 0
                    ? <p className="text-white text-opacity-20 text-sm">No {section.title.toLowerCase()} added</p>
                    : section.items.map(item => (
                      <div key={item._id} className="flex justify-between items-center py-2 border-b border-white border-opacity-5">
                        <div>
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-white text-opacity-40 text-xs">Rs. {item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleDecreaseQuantity(item._id)} className="w-6 h-6 rounded-full bg-white bg-opacity-10 text-white text-sm flex items-center justify-center">-</button>
                          <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => handleIncreaseQuantity(item._id)} className="w-6 h-6 rounded-full bg-white bg-opacity-10 text-white text-sm flex items-center justify-center">+</button>
                          <button onClick={() => handleRemoveItem(item._id)} className="text-red-400 text-xs ml-1">✕</button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))}
            </div>

            <button onClick={handleSendOrder} className="w-full bg-primary text-white rounded-lg py-3 font-medium text-sm hover:opacity-90">
              Send to Kitchen
            </button>
          </div>

          {/* Right column — Active Orders + AI */}
          <div className="flex flex-col gap-4">

            {/* Active Orders */}
            <div className={`bg-card border border-white border-opacity-10 rounded-xl p-5 flex-1 ${activeTab !== 'orders' ? 'hidden sm:block' : 'block'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-medium">Active Orders</h2>
                <button onClick={getMyorders} className="text-white text-opacity-40 text-xs border border-white border-opacity-10 px-3 py-1 rounded-lg">
                  Refresh
                </button>
              </div>

              {tableOrder.length === 0
                ? <p className="text-white text-opacity-30 text-sm">No active orders</p>
                : tableOrder.map(order => (
                  <div key={order._id} className="bg-dark border border-white border-opacity-10 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm font-medium">Table {order.tableNumber}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${order.overallStatus === 'done'
                          ? 'bg-green-500 bg-opacity-20 text-green-400'
                          : 'bg-primary bg-opacity-20 text-primary'
                          }`}>
                          {order.overallStatus}
                        </span>
                        {order.overallStatus === 'done' && (
                          <button onClick={() => handleCloseOrder(order._id)} className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-md">
                            Close
                          </button>
                        )}
                      </div>
                    </div>
                    {order.items.map(item => (
                      <div key={item._id} className="flex justify-between text-xs py-1.5 border-b border-white border-opacity-5 last:border-0">
                        <span className="text-white text-opacity-80">{item.menuItem?.name || 'Item deleted'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-white text-opacity-40">x{item.quantity}</span>
                          <span className={`${item.status === 'done' ? 'text-green-400' :
                            item.status === 'preparing' ? 'text-blue-400' :
                              'text-white text-opacity-30'
                            }`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              }
            </div>

            {/* AI Assistant */}
            <div className={`bg-card border border-primary border-opacity-30 rounded-xl p-4 ${activeTab !== 'ai' ? 'hidden sm:block' : 'block'}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-primary">🤖</span>
                <h3 className="text-white text-sm font-medium">AI Menu Assistant</h3>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Ask about menu, allergens..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  className="flex-1 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                />
                <button onClick={handleAskAI} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
                  {aiLoading ? '...' : 'Ask'}
                </button>
              </div>
              {aiAnswer && (
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <p className="text-white text-opacity-80 text-sm leading-relaxed">{aiAnswer}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}