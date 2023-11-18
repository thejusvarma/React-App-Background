const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title : {
        type: String,
        required: true
    },
    content : {
        type: String,
        required: true
    },
    tag : {
        type: String,
        default: "general"
    },
    timestamp : {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('notes',NotesSchema);