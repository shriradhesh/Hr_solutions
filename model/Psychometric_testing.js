const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
    
    },
    options: [{
        type: String,
    
    }],
    correctAnswerIndex: {
        type: Number,
        
    }
}, { timestamps: true });

const PsychometricModel = mongoose.model('Psychometric', QuestionSchema);

module.exports = PsychometricModel;
