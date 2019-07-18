function isAuthenticated(req, res, next) {
    console.log("authenticating");
    next();
}

module.exports = isAuthenticated;
