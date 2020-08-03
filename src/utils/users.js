const users = []

//addUser

const addUser = ({id, username, roomname})=>{

    //Clean the data
    username = username.trim().toLowerCase()
    roomname = roomname.trim().toLowerCase()


    //Validate Data
    if(!username || !roomname){
        return {
            error: "Username and Room are required"
        }
    }

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.roomname ===roomname && user.username === username
    })

    //Validate UserName

    if(existingUser){
        return{
            error: "Username is taken"
        }
    }

    // Store user 

    const user = {id, username, roomname}
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id
    })

    if(index!== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) =>{
    return users.find((user)=>user.id === id )
}

const getUsersInRoom = (roomname)=>{
    roomname = roomname.trim().toLowerCase()
    return users.filter((user)=>{
        return user.roomname === roomname
    })
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

// addUser({
//     id: 22,
//     username: "Ronaldo",
//     roomname: "Gotham"
// })

// addUser({
//     id: 23,
//     username: "Messi",
//     roomname: "Gotham"
// })

// addUser({
//     id: 24,
//     username: "Kaka",
//     roomname: "Gotham"
// })


// console.log(getUsersInRoom('Gotham City'))

// // console.log(users);

// // const removedUser = removeUser(22)


// // console.log(users);

// //removeUser


// //getUser


// //getUsersInRoom