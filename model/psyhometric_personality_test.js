const mongoose = require('mongoose')
const psychometric_personality_test_Schema = new mongoose.Schema({
        
    question: {
        type: String,
        
    },
    options: {
        type: [{
            type: String,
            enum: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"],
            
        }],
        validate: [arrayLimit, '{PATH} must contain exactly 5 options'] 
    },
    correctAnswerIndex: {
        type: Number,
       
        min: 0,
        max: 4 
    }
}, { timestamps: true });

function arrayLimit(val) {
    return val.length === 5;
}

const Psychometric_Personality_test_Model = mongoose.model('Psychometric_personality_test', psychometric_personality_test_Schema);

module.exports = Psychometric_Personality_test_Model;