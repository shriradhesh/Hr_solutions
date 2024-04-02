const mongoose = require('mongoose');

const appliedJobSchema = mongoose.Schema({
    first_Name: {
        type: String
    },
    last_Name: {
        type: String
    },
    user_Email: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    phone_no: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others']
    },
    job_Heading: {
        type: String
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'jobModel'
    },
    Salary: {
        type: String,
        required: true
    },
    uploadResume: {
        type: String
    },
    job_expired_Date: {
        type: Date 
    },
    job_status: {
        type: Number,
        enum: [0, 1],       
    },
    Highest_Education: {
        type: String,
        enum: ['secondary', 'Higher Secondary', 'Diploma', 'Bachelors', 'Masters', 'Doctorate'] // Corrected 'Bechlore' to 'Bachelors'
    },
    job_experience: {
        type: Number
    },
    Total_experience: {
        type: String
    },
    time_range_for_interview: {
        type: String
    },
    // New fields
    applied_date: {
        type: Date,
        default: Date.now 
    },
    jobSeeker_status : {
           type : Number,
           enum : [1,2,3,4,5],
           default : 1
                                       // 1 for pending ,
                                       // 2 for Interview Scheduled , 3 for Interview Completed , 
                                       // 4 for Shortlisted , 5 for rejected
    }

}, { timestamps: true });

const appliedjobModel = mongoose.model('appliedjob', appliedJobSchema);

module.exports = appliedjobModel;
