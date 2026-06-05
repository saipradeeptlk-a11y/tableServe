import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
  transports: ['websocket']  // ✅ add this
})

socket.on('connect', () => {
  console.log('Socket connected:', socket.id)
})


export default socket