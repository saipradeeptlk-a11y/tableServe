const axios = require('axios')
const MenuItem = require('../models/MenuItem')

const askAI = async (req, res) => {
    try {
        const { question } = req.body

        if (!question) {
            return res.status(400).json({ message: "Please provide a question" })
        }

        // ✅ Step 1 — fetch menu from DB to give AI context
        const menuItems = await MenuItem.find()
        const menuContext = menuItems.map(item =>
            `${item.name} (${item.course}) - Rs.${item.price} - Allergens: ${item.allergens}`
        ).join('\n')

        // ✅ Step 2 — call Groq API
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful restaurant assistant for TableServe. 
            Here is our current menu:
            ${menuContext}
            Help waiters answer customer questions about the menu, ingredients, allergens, and recommendations.
            Keep answers short and helpful.`
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        )

        // ✅ Step 3 — extract answer and send back
        const answer = response.data.choices[0].message.content
        return res.status(200).json({ answer })

    } catch (error) {
        console.log("AI error status:", error.response?.status)
        console.log("AI error status:", error.response?.status)
        console.log("AI error data:", JSON.stringify(error.response?.data))
        return res.status(500).json({ message: "AI request failed" })
    }
}

module.exports = { askAI }