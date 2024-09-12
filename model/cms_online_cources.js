const mongoose = require('mongoose')
const cms_online_cources_Schema = new mongoose.Schema({

      Heading : {
           type : String
      },

      Description : {
          type : String
      },
      Detailed_description : {
           type : String

      },
      price : {
           type : String
      },
      image : {
           type : String
      }


} , { timestamps : true })

const cms_online_courses_Model = mongoose.model('cms_online_courses', cms_online_cources_Schema)

module.exports = cms_online_courses_Model