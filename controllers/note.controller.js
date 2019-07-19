const Note = require("../models/Note");

function create(req, res) {
    return res.json({
        success: true,
        payload: "Called from create note"
    });
}
function get(req, res) {}
function getAll(req, res) {}
function edit(req, res) {}
function deleteNote(req, res) {}

module.exports = {
    create,
    get,
    getAll,
    edit,
    deleteNote
};
