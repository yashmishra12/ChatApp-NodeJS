const express  = require('express')
const app = express()
const path = require('path')
const publicDirectoryPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000

app.use(express.static(publicDirectoryPath))

app.listen(port, ()=>{
    console.log(`Listening on port: ${port}`);
})


