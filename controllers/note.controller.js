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
        console.log(err, note);
        const responseData = err
            ? {
                  message:
                      "Server error. Couldn't create note. Please refresh the page and try again."
              }
            : {
                  success: true,
                  message: "Success"
              };

        return responseToSend(res, responseData);
    });
}
async function get(req, res) {
    const noteId = req.params.id;

    try {
        const note = await Note.findById(noteId);

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
            userId
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
                const responseData = err
                    ? {
                          message:
                              "Server Error. Error editing note. Please refresh the page and try again."
                      }
                    : {
                          success: true,
                          message: "Successfully edited note",
                          payload: {
                              noteId: noteId
                          }
                      };

                return responseToSend(res, responseData);
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
                const responseData = err
                    ? {
                          message:
                              "Server Error. Error deleting note. Please refresh the page and try again."
                      }
                    : {
                          success: true,
                          message: "Successfully deleted note"
                      };

                return responseToSend(res, responseData);
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
