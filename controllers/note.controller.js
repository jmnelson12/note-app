const Note = require("../models/Note");
const { getUserIdFromToken } = require("./user.controller");
const { responseToSend } = require("../utils/api");

async function create(req, res) {
    const { noteContent, token } = req.body;

    const userId = await getUserIdFromToken(token);
    const newNote = new Note({
        userId,
        noteContent
    });

    newNote.save((err, note) => {
        if (err) {
            return responseToSend(res, {
                message:
                    "Server error. Couldn't create note. Please refresh the page and try again."
            });
        }

        return responseToSend(res, {
            success: true,
            message: "Success"
        });
    });
}

async function get(req, res) {
    const noteId = req.params.id;

    try {
        const note = await Note.findById(noteId);
        // const userDeleted = await isUserDeleted(note.userId);

        if (note.isDeleted) {
            return responseToSend(res, {
                message: "Note was deleted."
            });
        }

        // if (userDeleted) {
        // return responseToSend(res, {
        // message: "User no longer exists."
        // })
        // }

        // only return noteContent and createdDate
        return responseToSend(res, {
            success: true,
            payload: {
                noteId: note._id,
                noteContent: note.noteContent,
                createdDate: note.createdDate
            }
        });
    } catch (e) {
        return responseToSend(res, {
            message:
                "Server Error. Error getting note. Please refresh the page and try again."
        });
    }
}

async function getAll(req, res) {
    const token = req.query.token || req.body.token;

    try {
        const userId = await getUserIdFromToken(token);
        const allNotes = await Note.find({
            userId,
            isDeleted: false
        });

        /*
         * .select("noteContent createdDate _id")
         * .exec((err, user) => {})
         */
        console.log(allNotes);

        return responseToSend(res, {
            success: true,
            payload: {
                allNotes: []
            }
        });
    } catch (e) {
        return responseToSend(res, {
            message:
                "Server Error. Error getting all notes. Please refresh the page and try again."
        });
    }
    // only return noteContent and createdDate
}

async function edit(req, res) {
    const noteId = req.params.id;
    const { noteContent } = req.body;

    try {
        Note.findByIdAndUpdate(
            noteId,
            {
                noteContent
            },
            (err, model) => {
                if (err) {
                    return responseToSend(res, {
                        message:
                            "Server Error. Error editing note. Please refresh the page and try again."
                    });
                }

                return responseToSend(res, {
                    noteId: noteId,
                    success: true,
                    message: "Successfully edited note"
                });
            }
        );
    } catch (e) {
        return responseToSend(res, {
            message:
                "Server Error. Error editing note. Please refresh the page and try again."
        });
    }
}

function deleteNote(req, res) {
    const noteId = req.params.id;

    try {
        Note.findByIdAndUpdate(
            noteId,
            {
                isDeleted: true
            },
            (err, model) => {
                if (err) {
                    return responseToSend(res, {
                        message:
                            "Server Error. Error deleting note. Please refresh the page and try again."
                    });
                }

                return responseToSend(res, {
                    success: true,
                    message: "Successfully deleted note"
                });
            }
        );
    } catch (e) {
        return responseToSend(res, {
            message:
                "Server Error. Error deleting note. Please refresh the page and try again."
        });
    }
}

module.exports = {
    create,
    get,
    getAll,
    edit,
    deleteNote
};
