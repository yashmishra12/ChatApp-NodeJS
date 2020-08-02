const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages') //grabs the div below the chat app title


//Templates

const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML


socket.on('message', message=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        messageInside: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)

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

socket.on('locationMessage', (message)=>{
    console.log(message);
    const html = Mustache.render(locationMessageTemplate, {
        url:message.url, 
        createdAt: moment(message.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend',html)
})
 
$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')  
        })
    })
})
