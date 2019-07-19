const { verifyUserSession } = require("../controllers/user.controller");

async function isAuthenticated(req, res, next) {
    const token = req.body.token || req.params.token || req.query.token || null;

    if (!token) {
        return res.json({
            success: false,
            message: "Not Authorized. Please login or create an account."
        });
    }

    try {
        await verifyUserSession(token).then(_res => {
            if (_res.success) {
                next();
            } else {
                return res.json({
                    success: false,
                    message:
                        "Not Authorized. Please login or create an account."
                });
            }
        });
    } catch (e) {
        return res.json({
            success: false,
            message: "Error authenticating user"
        });
    }
}

module.exports = isAuthenticated;
