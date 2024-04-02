const mongoose = require ('mongoose')

mongoose.connect('mongodb+srv://mobappssolutions181:root123@cluster0.ro8e4sn.mongodb.net/hr_solutions',{
        // useNewUrlparser : true ,
        // useUnifiedTopology : true 
})

const db = mongoose.connection

db.on('error', ()=>{
     console.log('error while connecting to momgodb');
})
db.once('open', ()=>{
     console.log('connected to mongodb');
})