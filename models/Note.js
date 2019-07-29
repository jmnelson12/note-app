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
    lastEditedDate: {
        type: Date,
        default: Date.now()
    },
    noteContent: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Note", NoteSchema);
