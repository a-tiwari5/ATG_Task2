const express = require('express')
const app = express()
const dotenv = require('dotenv')

dotenv.config({ path: "./config/config.env" });




app.listen(process.env.PORT || 8000, () => {
    console.log("Server is Running on Port 8000")
})