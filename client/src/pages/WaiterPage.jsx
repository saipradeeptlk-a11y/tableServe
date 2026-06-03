import React from 'react'
import axios from 'axios'

export default function WaiterPage() {

  
  const [tableNumber, setTableNumber] = React.useState('')
  const [selectedCourse, setSelectedCourse] = React.useState('starter')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [menuItems, setMenuItems] = React.useState([])
  const [searchResults, setSearchResults] = React.useState([])
  const [orderItems, setOrderItems] = React.useState([])
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [tableOrder,setTableOrder]= React.useState([])

  // hint 1 — fetch menu from backend when page loads
  // useEffect goes here
  React.useEffect(()=>{
    const fetchMenu = async () => {
      try{
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:5000/api/menu', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setMenuItems(response.data.items)

      }catch(err){
        setError('Failed to load menu')
      }
    }
    fetchMenu()
  },[])

  // hint 2 — filter menu when search or course changes
  // useEffect goes here
  React.useEffect(()=>{
    if(!searchQuery){
      setSearchResults([])
      return
    }
    const filtered = menuItems.filter(item => item.course === selectedCourse && item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setSearchResults(filtered)
  },[searchQuery,selectedCourse,menuItems])

  // hint 3 — add item to order
  function handleAddItem(item) { 
    const alreadyAdded = orderItems.find(i => i._id === item._id)
    if (alreadyAdded) {
      setError('Item already added!')
      return
    }
    setOrderItems(
      prev =>[
        ...prev,{...item,quantity:1}]
      
    )
    setSearchQuery('')
    setSearchResults([])
  }
  function handleIncreaseQuantity(id){
    
    
    setOrderItems(
      prev => prev.map(i => i._id === id ? {...i,quantity:i.quantity+1 }: i)
    )

  }
  function handleDecreaseQuantity(id){
    setOrderItems(
      prev => prev.map(i => i._id === id ? i.quantity ===1 ? i :{...i,quantity:i.quantity-1 }: i)
    )
  }

  // hint 4 — remove item from order
  function handleRemoveItem(id) {
    setOrderItems(prev => prev.filter(item => item._id !== id))
  }
  async function getMyorders() {
  try {
    const token = localStorage.getItem('token')

    const response = await axios.get(
      `http://localhost:5000/api/orders/table/${tableNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    setTableOrder(response.data.orders)

  } catch (err) {
    console.log(err.response?.data)
    setError('Failed to fetch the order for the particular table number')
  }
}

  // hint 5 — send order to kitchen
  async function handleSendOrder() {
    if(!tableNumber){
      setError('Please enter a table number')
      return 
    }
    if(orderItems.length === 0){
      setError('Please add at least one item! ')
      return
    }
    try{
      const token = localStorage.getItem('token')
      const response = await axios.post('http://localhost:5000/api/orders',{
         tableNumber:Number(tableNumber),
         items:orderItems.map(item => ({
              menuItem: item._id,
              quantity: item.quantity || 1,
              status:'pending'
         }))
      },{headers:{Authorization:`Bearer ${token}`}})
      setSuccess('Order sent to kitchen!')
      setOrderItems([])
      setTableNumber('')
      setError('')
    } catch (err) {
      setError('Failed to send order')
    }
    
    
  

  }
  async function handleCloseOrder(orderId) {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:5000/api/orders/${orderId}/status`,
      { status: 'done' },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    getMyorders()

  } catch (error) {
    setError(error.response?.data?.message || "Unable to close order")
  }
}

  // split orderItems into 3 groups
  const starters = orderItems.filter(i => i.course === 'Starter')
  const mains = orderItems.filter(i => i.course === 'Main')
  const desserts = orderItems.filter(i => i.course === 'Dessert')

  return (
    <div>

      {/* header + table number input */}
      <header>
        <h1>TableServe — Waiter</h1>
        <input
          type="number"
          placeholder="Enter Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <button onClick={getMyorders}>
          Get Active Orders
        </button>
      </header>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* radio buttons — starter / main / dessert */}
      <div>
        <label>
          <input
            type="radio"
            value="starter"
            checked={selectedCourse === 'Starter'}
            onChange={() => setSelectedCourse('Starter')}
          />
          Starter
        </label>
        <label>
          <input
            type="radio"
            value="main"
            checked={selectedCourse === 'Main'}
            onChange={() => setSelectedCourse('Main')}
          />
          Main Course
        </label>
        <label>
          <input
            type="radio"
            value="dessert"
            checked={selectedCourse === 'Dessert'}
            onChange={() => setSelectedCourse('Dessert')}
          />
          Dessert
        </label>
      </div>

      {/* search bar */}
      <div>
        <input
          type="text"
          placeholder={`Search ${selectedCourse} dishes...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div style={{ border: '1px solid gray' }}>
            {searchResults.map(item => (
              <div
                key={item._id}
                onClick={() => handleAddItem(item)}
                style={{ cursor: 'pointer', padding: '8px' }}
              >
                <p>{item.name} — Rs. {item.price} </p>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {searchQuery && searchResults.length === 0 && (
          <p>No {selectedCourse} dishes found</p>
        )}
      </div>

      {/* search results appear below search bar */}

      {/* order display — 3 sections */}
      <div>
      {/* section 1 — starters */}
      <div>
          <h3>Starters</h3>
          {starters.length === 0
            ? <p>No starters added</p>
            : starters.map(item => (
              <div key={item._id}>
                <p>{item.name} — Rs. {item.price}</p>
                <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
              </div>
            ))
          }
        </div>
      {/* section 2 — mains */}
       <div>
          <h3>Main Course</h3>
          {mains.length === 0
            ? <p>No mains added</p>
            : mains.map(item => (
              <div key={item._id}>
                <p>{item.name} — Rs. {item.price}</p>
                <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
              </div>
            ))
          }
        </div>
      {/* section 3 — desserts */}
       <div>
          <h3>Desserts</h3>
          {desserts.length === 0
            ? <p>No desserts added</p>
            : desserts.map(item => (
              <div key={item._id}>
                <p>{item.name} — Rs. {item.price}</p>
                <button onClick={() => handleDecreaseQuantity(item._id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleIncreaseQuantity(item._id)}>+</button>
                <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
              </div>
            ))
          }
        </div>
       </div>  

      {/* send to kitchen button */}
      <button onClick={handleSendOrder}>Send to Kitchen</button>
            <div>
        <h2>Active Orders</h2>

        {tableOrder.length === 0 ? (
          <p>No active orders</p>
        ) : (
          tableOrder.map(order => (

            <div
              key={order._id}
              style={{
                border: '1px solid gray',
                padding: '10px',
                marginBottom: '10px'
              }}
            > 
              {order.overallStatus === "pending" && <button onClick={() => handleCloseOrder(order._id)}>X</button>}
              <p>
                Order Status: {order.overallStatus}
              </p>

              {order.items.map(item => (
                <div key={item._id}>
                  <p>
                    {item.menuItem?.name}
                    {' - '}
                    Qty: {item.quantity}
                    {' - '}
                    Status: {item.status}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

    </div>
  )
}