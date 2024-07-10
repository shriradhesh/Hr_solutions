const mongoose = require('mongoose')
const fixit_finder_Schema = new mongoose.Schema({
       
      FullName : {
        type : String
      },
      phone_no : {
         type : String
      },
      Gender : {
         type : String,
         enum : ['Male','Female', 'Others', 'male', 'female','others']
      },
      nationality_or_voter_id : {
        type : String
      },
      attach_your_certificate : {
        type : String
      },
      workscope_address : {
        type : String
      },
      Business_name : {
        type : String
      },
      Home_address : {
        type : String
      },
      location : {
        type : String
      },
      skills : {
        type : String
      },
      year_of_experience : {
        type : String
      },
      timeStamp : {
        type : String
      }
})


const fixit_finder_model = mongoose.model('fixit_finder_model', fixit_finder_Schema)

module.exports = fixit_finder_model