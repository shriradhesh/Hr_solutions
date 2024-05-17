const mongoose = require('mongoose')
const job_DescriptionSchema = new mongoose.Schema({
jobTitle : {
    type : String,
    required : true
}  ,
job_Description : {
    type : String
},
Responsibilities : {
    type : String
}
},
{timestamps: true}
)

const jobDescription_model = mongoose.model('job_Description', job_DescriptionSchema);

module.exports = jobDescription_model;
