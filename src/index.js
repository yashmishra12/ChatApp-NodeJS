const express  = require('express')
const http = require('http');
const path = require('path')
const socketio = require('socket.io')
const publicDirectoryPath = path.join(__dirname, '../public')
const Filter = require("bad-words")

const port = process.env.PORT || 3000

const app = express()
app.use(express.static(publicDirectoryPath))

const server = http.createServer(app)
const io = socketio(server)


let count=0

//io.on --> for connection
//socket.on ---> for disconnection
io.on('connection', (socket)=>{  
    console.log("New Web Socket connection");

    // socket.emit("countUpdated", count)

    // socket.on("increment", ()=>{
    //     count++
    //     /* socket.emit("countUpdated", count)  -----> this emits to one client*/
    //     io.emit("countUpdated", count)
    // })

    socket.emit("message", "Welcome")

    socket.broadcast.emit('message', "A new user has joined")

    socket.on("sendMessage", (message, callBack)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callBack("Profanity is not allowed")
        }
        io.emit('message', message)
        callBack()
    })  
 
    socket.on('disconnect',()=>{
        io.emit("message","A user has left")
    })

    socket.on('sendLocation', (coords, callback)=>{
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })

})








server.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})


