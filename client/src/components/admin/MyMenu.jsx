import React from "react"
import axios from 'axios'

export default function MyMenu() {
    const [menuItems, setMenuItems] = React.useState([])
    const [error, setError] = React.useState('')
    const [success, setSuccess] = React.useState('')
    const [name, setName] = React.useState('')
    const [price, setPrice] = React.useState('')
    const [course, setCourse] = React.useState('Starter')
    const [ingredients, setIngredients] = React.useState('')
    const [allergens, setAllergens] = React.useState('')

    async function fetchMenu() {
        try {
            const token = localStorage.getItem('token')
            const menu = await axios.get('http://localhost:5000/api/menu', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMenuItems(menu.data.items)
        } catch { setError('Unable to fetch menu') }
    }

    React.useEffect(() => { fetchMenu() }, [])

    async function handleAddItem() {
        try {
            const token = localStorage.getItem('token')
            await axios.post('http://localhost:5000/api/menu',
                { name, price, course, ingredients, allergens },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setSuccess('Item added!')
            fetchMenu()
            setTimeout(() => setSuccess(''), 3000)
        } catch { setError('Unable to add item') }
    }

    async function handleDeleteItem(id) {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:5000/api/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchMenu()
        } catch { setError('Unable to delete item') }
    }

    const grouped = {
        Starter: menuItems.filter(i => i.course === 'Starter'),
        Main: menuItems.filter(i => i.course === 'Main'),
        Dessert: menuItems.filter(i => i.course === 'Dessert'),
    }

    return (
        <div className="flex flex-col gap-4">

            {error && <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-red-400 text-sm">{error}</p></div>}
            {success && <div className="bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 rounded-lg px-4 py-2"><p className="text-green-400 text-sm">{success}</p></div>}

            {/* Add Item Form */}
            <div className="bg-card border border-white border-opacity-10 rounded-xl p-5">
                <h2 className="text-white font-medium mb-4">Add New Item</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Item Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Paneer 65"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Price (Rs.)</label>
                        <input
                            type="number"
                            placeholder="e.g. 850"
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Course</label>
                        <select
                            onChange={(e) => setCourse(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm outline-none"
                        >
                            <option value="Starter">Starter</option>
                            <option value="Main">Main</option>
                            <option value="Dessert">Dessert</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Allergens</label>
                        <input
                            type="text"
                            placeholder="e.g. dairy, gluten"
                            onChange={(e) => setAllergens(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="text-white text-opacity-50 text-xs mb-1.5 block">Ingredients</label>
                        <input
                            type="text"
                            placeholder="e.g. paneer, spices, oil"
                            onChange={(e) => setIngredients(e.target.value)}
                            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-white placeholder-opacity-25 outline-none"
                        />
                    </div>
                </div>
                <button
                    onClick={handleAddItem}
                    className="mt-4 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"
                >
                    Add Item
                </button>
            </div>

            {/* Menu List */}
            {['Starter', 'Main', 'Dessert'].map(course => (
                <div key={course} className="bg-card border border-white border-opacity-10 rounded-xl p-5">
                    <h2 className="text-white font-medium mb-4">{course}s</h2>
                    {grouped[course].length === 0
                        ? <p className="text-white text-opacity-30 text-sm">No {course.toLowerCase()}s added</p>
                        : grouped[course].map(item => (
                            <div key={item._id} className="flex justify-between items-center py-3 border-b border-white border-opacity-5 last:border-0">
                                <div>
                                    <p className="text-white text-sm font-medium">{item.name}</p>
                                    <p className="text-white text-opacity-40 text-xs mt-0.5">Rs. {item.price} · {item.allergens}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteItem(item._id)}
                                    className="text-red-400 text-xs border border-red-400 border-opacity-30 px-3 py-1 rounded-lg hover:bg-red-400 hover:bg-opacity-10"
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    }
                </div>
            ))}
        </div>
    )
}