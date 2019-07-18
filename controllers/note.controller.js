const Note = require("../models/Note");

function create(req, res) {}
function get(req, res) {}
function edit(req, res) {}
function deleteNote(req, res) {}

module.exports = {
    create,
    get,
    edit,
    delete: deleteNote
};
