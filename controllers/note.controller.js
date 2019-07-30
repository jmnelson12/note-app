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
                createdDate: note.createdDate,
                lastEditedDate: note.lastEditedDate
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
        })
            .select("noteContent createdDate lastEditedDate _id")
            .exec();

        return responseToSend(res, {
            success: true,
            payload: {
                allNotes
            }
        });
    } catch (e) {
        return responseToSend(res, {
            message:
                "Server Error. Error getting all notes. Please refresh the page and try again."
        });
    }
}
function edit(req, res) {
    const noteId = req.params.id;
    const { noteContent } = req.body;

    try {
        const lastEditedDate = Date.now();
        Note.findByIdAndUpdate(
            noteId,
            {
                noteContent,
                lastEditedDate
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
                              noteId,
                              lastEditedDate
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
        Note.findByIdAndDelete(noteId, (err, model) => {
            console.log(err, model);
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
        });
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
