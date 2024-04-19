
const mongoose = require('mongoose');

const PsychometricSchema = new mongoose.Schema({
    job_title : {
        type : String
    },
    

    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswerIndex: {
            type: Number,
            required: true
        }
    }]
}, {timestamps : true });

const PsychometricModel = mongoose.model('Psychometric', PsychometricSchema);

module.exports = PsychometricModel