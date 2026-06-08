import React from "react"
import axios from 'axios'


export default function MyMenu() {
    const [menuItems, setMenuItems] = React.useState([])
    const [error, setError] = React.useState('')
    const [starters, setStarters] = React.useState([])
    const [main, setMain] = React.useState([])
    const [dessert, setDessert] = React.useState([])

    const [name, setName] = React.useState('')
    const [price, setPrice] = React.useState('')
    const [course, setCourse] = React.useState('Starter')
    const [ingredients, setIngredients] = React.useState('')
    const [allergens, setAllergens] = React.useState('')

    async function fetchMenu() {
        try {

            const token = localStorage.getItem('token')
            const menu = await axios.get('http://localhost:5000/api/menu', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setMenuItems(menu.data.items)

        } catch {
            setError("unable to fetch menu")
        }

    }

    function getStarters() {
        const starters = menuItems.filter(item => item.course === "Starter")
        setStarters(starters)
    }
    function getMains() {
        const main = menuItems.filter(item => item.course === "Main")
        setMain(main)
    }
    function getDesserts() {
        const D = menuItems.filter(item => item.course === "Dessert")
        setDessert(D)
    }

    React.useEffect(() => {
        fetchMenu()
    }, [])

    React.useEffect(() => {
        getStarters()
        getMains()
        getDesserts()
    }, [menuItems])

    async function handleAddItem() {
        try {

            const token = localStorage.getItem('token')
            const menu = await axios.post('http://localhost:5000/api/menu',
                {
                    name, price, course, ingredients, allergens

                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            )
            fetchMenu()


        } catch {
            setError("unable to fetch menu")
        }

    }

    async function handleDeleteItem(id) {
        try {
            const token = localStorage.getItem('token')
            await axios.delete(`http://localhost:5000/api/menu/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchMenu()
        } catch {
            setError("Unable to delete item")
        }
    }
    async function handleUpdateItem(id) {
        try {
            const token = localStorage.getItem('token')
            await axios.put(`http://localhost:5000/api/menu/${id}`,
                { name, price, course, ingredients, allergens },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchMenu()
        } catch {
            setError("Unable to update item")
        }
    }


    return (
        <div>
            <form>
                <label>
                    Name:
                    <input type="String" onChange={(e) => setName(e.target.value)} />
                </label>
                <label>
                    Price:
                    <input type="Number" onChange={(e) => setPrice(e.target.value)} />
                </label>
                <select onChange={(e) => setCourse(e.target.value)}>
                    <option value="Starter">Starter</option>
                    <option value="Main">Main</option>
                    <option value="Dessert">Dessert</option>
                </select>
                <label>
                    Allergens:
                    <input type="String" onChange={(e) => setAllergens(e.target.value)} />
                </label>
                <label>
                    Ingridents:
                    <input type="String" onChange={(e) => setIngredients(e.target.value)} />
                </label>
                <button onClick={handleAddItem}>Add Item</button>
            </form >
            <h1>MyMenu</h1>
            <h2>Starters</h2>
            {
                starters.map(item => (
                    <div key={item._id}>
                        <p>Name : {item.name}</p>
                        <p>Price : {item.price}</p>
                        <p>Course : {item.course}</p>
                        <button onClick={() => { handleDeleteItem(item._id) }}>Delete</button>
                    </div>
                ))
            }
            <h2>Mains</h2>
            {
                main.map(item => (
                    <div key={item._id}>
                        <p>Name : {item.name}</p>
                        <p>Price : {item.price}</p>
                        <p>Course : {item.course}</p>
                        <button onClick={() => { handleDeleteItem(item._id) }}>Delete</button>
                    </div>
                ))
            }
            <h2>Desserts</h2>
            {
                dessert.map(item => (
                    <div key={item._id}>
                        <p>Name : {item.name}</p>
                        <p>Price : {item.price}</p>
                        <p>Course : {item.course}</p>
                        <button onClick={() => { handleDeleteItem(item._id) }}>Delete</button>
                    </div>
                ))
            }
        </div>
    )
}