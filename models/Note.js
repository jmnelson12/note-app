const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: ""
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    noteContent: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Note", NoteSchema);
