const express = require('express')
require('dotenv').config()
const app = express()
const Port = process.env.PORT || 4100
const cors = require('cors')
const bodyParser = require('body-parser')
const adminRouter = require('./router/adminRouter')
const userRouter = require('./router/userRouter')

// database configuration
const db = require('./config/db')

// Middleware configuration
 
app.use(express.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())
app.use(express.static('uploads'))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
    });


// Router configuration

app.use('/api', adminRouter)
app.use('/api', userRouter)

app.post('/', (req ,res)=>{
        res.send('Hello from HR Solutions Server')
})

app.listen(Port , ()=>{
       console.log(`Server is Running on PORT : ${Port}`);
})
