const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    job_title: {
        type: String
    },
    company_name: {
        type: String
    },
    emp_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employeeModel'
    },
    Number_of_emp_needed: {
        type: Number
    },
    job_type: {
        type: String,
        // enum: ['Full-Time', 'Part-Time', 'Temporary', 'Contract', 'Internship', 'Commission', 'Fresher', 'Volunteer', 'Walk-In']
    },
    job_schedule: {
        type: String,
        // enum: ['Day Shift', 'Morning Shift', 'Rotational Shift', 'Night Shift', 'Monday to Friday', 'Evening Shift', 'US Shift', 'UK Shift', 'Others']
    },
    salary_pay: [{
        Minimum_pay: {
            type: String
        },
        Maximum_pay: {
            type: String
        },
        Rate: {
            type: String,
            // enum: ['per Month', 'per Year', 'per Week', 'per Day', 'per Hour']
        }
    }],
    job_Description: {
        type: String
    },
    company_address: {
        type: String
    },
    employee_email: {
        type: String
    },
    requirement_timeline: {
        type: String,
        // enum: ['1 to 3 Days', '3 to 7 Days', '1 to 3 Week', 'more than Month']
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    phone_no: {
        type: Number
    },
    key_qualification: [{
        skill: {
            type: String
        }
    }],
    Experience: {
        type: String
    },
    template_type : {
        type : Number,
        enum : [1,2,3,4,5],
        default : 1
    },
    company_Industry : {
        type : String
    },
    job_photo : {
        type : String
    },
    status : {
        type : Number,
        enum : [1 , 0],
        default : 1
    },
    
});

const jobModel = mongoose.model('Job', jobSchema)

module.exports = jobModel
