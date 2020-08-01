const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')


socket.on('message', message=>{
    console.log(message);
})

$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled') //disabling send button after submitting the message

    // const message = document.querySelector('input').value
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error)=>{

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=""
        $messageFormInput.focus()

        if(error){
           return console.log(error);
        }
    console.log("Message Delivered");}  )
} )
 
$sendLocationButton.addEventListener('click', (e)=>{
    e.preventDefault()
    if(!navigator.geolocation){
        return alert("GeoLocation is not supported by your browser")
    }

    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position);
        socket.emit('sendLocation', {
            latitude:position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{                                                    //this is the acknowledgement part
            $sendLocationButton.removeAttribute('disabled')
            console.log("Location Shared");
        })
    })
})
