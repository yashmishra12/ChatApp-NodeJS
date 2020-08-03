const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages') //grabs the div below the chat app title


//Templates

const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const{username, roomname}=Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = ()=>{
    //New Message Element
    const $newMessage = $messages.lastElementChild

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height

    const visibleHeight = $messages.offsetHeight

    //Height of messages container 
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled
    const scrolledOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrolledOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on('message', message=>{
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData', ({roomname,users})=>{
    const html = Mustache.render(sidebarTemplate, {
        roomname,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
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
        username: message.username,
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


socket.emit('join', {username, roomname}, (error)=>{
    if(error){
        alert(error)
        location.href = '/'
    }
})

