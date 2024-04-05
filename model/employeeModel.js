const mongoose = require('mongoose')
const employeeSchema = new mongoose.Schema({
       
         name  : {
            type : String
         },
         email : {
            type : String
         },
         password : {
            type : String
         },
         phone_no :{
            type : Number
         },
         status : {
            type : Number,
            enum : [1, 0],
            default : 0
         },
         profileImage : {
            type : String
         },
         company_name : {
            type : String
         },
         Number_of_emp : {
            type : Number
         },
         company_industry : {
            type : String,
            enum : ['Aerospace & Defense', 'Agriculture' , 'Information Technology' ,'Non-profit & NGO' , 'Real Estate' ,'Resturant & Food Services' , 'Marketing' , 'Finance' , 'others']
         }
}, {timestamps : true })

const employeeModel = mongoose.model('employee', employeeSchema)
module.exports = employeeModel