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
        type: String,
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
        type: Number
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
           enum : [1,2,3,4,5,6,7],
           default : 1
                                       // 1 for pending ,
                                       // 2 for Interview Scheduled , 3 for assesment , 
                                       // 4 for Completed , 5 for Shortlisted
                                       // 6 for rejected , 7 for third round or HR discussion
    }

}, { timestamps: true });

const appliedjobModel = mongoose.model('appliedjob', appliedJobSchema);

module.exports = appliedjobModel;
