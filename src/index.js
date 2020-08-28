const express  = require('express');
const http = require('http');
const path = require('path')
const socketio = require('socket.io')
const publicDirectoryPath = path.join(__dirname, '../public');
const Filter = require("bad-words")
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {  addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const port = process.env.PORT || 3000

const app = express()
app.use(express.static(publicDirectoryPath))

const server = http.createServer(app)
const io = socketio(server)

//io.on --> for connection
//socket.on ---> for disconnection

/*
socket.emit ------> server to specific client
io.emit ------> server to all the clients
socket.broadcast.emit ------> server to all the clients except one 

io.to.emit ------> server to all the clients in the room
socket.broadcast.to.emit ------> server to all the clients except one in the same room
*/

io.on('connection', (socket)=>{  
    console.log("New Web Socket connection");

    
    socket.on('join', ({username, roomname}, callback)=>{
        const {error, user} = addUser({id: socket.id , username, roomname})

        if(error){
            return callback(error)
        }
        socket.join(user.roomname)
        
        socket.emit("message", generateMessage("Admin", "Welcome"))
        socket.broadcast.to(user.roomname).emit('message', generateMessage("Admin",`${user.username} has joined`))

        io.to(user.roomname).emit('roomData', {
            roomname: user.roomname,
            users: getUsersInRoom(user.roomname)
        })

        callback()

    })

    socket.on("sendMessage", (message, callBack)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callBack("Profanity is not allowed")
        }
        io.to(user.roomname).emit('message', generateMessage(user.username,message))
        callBack()
    })  
 
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.roomname).emit("message",generateMessage("Admin",`${user.username} has left`))
            io.to(user.roomname).emit("roomData", {
                roomname: user.roomname,
                users: getUsersInRoom(user.roomname)
            })
        }
    })

    socket.on('sendLocation', (coords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.roomname).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

})



server.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})


