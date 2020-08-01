const socket = io()

socket.on('message', message=>{
    console.log(message);
})

document.querySelector('#message-form').addEventListener('submit', (e)=>{
    e.preventDefault()

    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error)=>{
        if(error){
           return console.log(error);
        }
    console.log("Message Delivered");}  )
} )
 
document.querySelector('#send-location').addEventListener('click', (e)=>{
    e.preventDefault()
    if(!navigator.geolocation){
        return alert("GeoLocation is not supported by your browser")
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position);
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            console.log("Location Shared");
        })
    })
})

// socket.on('countUpdated',(count)=>{
//     console.log("The count has been updated",count);
// })

// document.querySelector('#incrementButton').addEventListener('click', ()=>{
//     socket.emit("increment")
// })