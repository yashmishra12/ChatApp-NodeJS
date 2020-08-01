const socket = io()

socket.on('countUpdated',(count)=>{
    console.log("The count has been updated",count);
})

document.querySelector('#incrementButton').addEventListener('click', ()=>{
    socket.emit("increment")
})