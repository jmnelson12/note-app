const User = require("../models/User");
const UserSession = require("../models/UserSession");

function register(req, res) {}
function login(req, res) {}
function logout(req, res) {}
function verify(req, res) {}
function deleteUser(req, res) {}

module.exports = {
    register,
    login,
    logout,
    verify,
    delete: deleteUser
};
