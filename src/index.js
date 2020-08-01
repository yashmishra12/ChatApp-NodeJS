const express  = require('express')
const http = require('http');
const path = require('path')
const socketio = require('socket.io')
const publicDirectoryPath = path.join(__dirname, '../public')

const port = process.env.PORT || 3000

const app = express()
app.use(express.static(publicDirectoryPath))

const server = http.createServer(app)
const io = socketio(server)


let count=0

io.on('connection', (socket)=>{
    console.log("New Web Socket connection");

    socket.emit("countUpdated", count)

    socket.on("increment", ()=>{
        count++
        // socket.emit("countUpdated", count)  -----> this emits to one client
        io.emit("countUpdated", count)
    })

})








server.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})


