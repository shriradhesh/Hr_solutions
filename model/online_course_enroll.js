const mongoose = require('mongoose')
const online_courses_enq_schema = new mongoose.Schema({
        first_name : {
              type : String
        },
        last_name : {
              type : String
        },
        email : {
             type : String
        },
        phone_no : {
             type : Number
        },
        message : {
              type : String
        },
        status : {
              type : Number,
              enum : [ 1, 0],
              default : 1
        },
          courses : [{
            course_id : {
                  type : String
             },
             status : {
                   type : String,
                   enum : ['Pending' , 'Accepted'],
                   default : 'Pending'
             }
          }]
        
       
}, { timestamps : true })

const online_courses_enroll_model = mongoose.model('online_courses_enroll', online_courses_enq_schema)

module.exports = online_courses_enroll_model