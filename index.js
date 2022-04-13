const express = require('express')
const app = express()
const dotenv = require('dotenv')
const morgan = require('morgan')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const AuthRoutes = require('./Routes/auth')
const errorHandler = require('./middlewares/error')


dotenv.config({ path: "./config/.env" });
mongoose.connect(process.env.MONGO_URL, () => {
    console.log("CONNECTED TO DATABASE")
})

console.log(process.env.NODE_ENV)
console.log(process.env.PORT)
console.log(process.env.MONGO_URL)
console.log(process.env.JWT_SECRET)
console.log(process.env.JWT_EXPIRE)
console.log(process.env.JWT_COOKIE_EXPIRE)
console.log(process.env.SMTP_HOST)
console.log(process.env.SMTP_PORT)
console.log(process.env.SMTP_EMAIL)
console.log(process.env.SMTP_PASSWORD)
console.log(process.env.FROM_EMAIL)
console.log(process.env.FROM_NAME)
const PostRoutes = require('./Routes/posts')

app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cookieParser())


app.use("/api/posts", PostRoutes)
app.use('/api/auth/', AuthRoutes)


app.use(errorHandler)
app.listen(process.env.PORT || 8000, () => {
    console.log("Server is Running on Port 8000")
})