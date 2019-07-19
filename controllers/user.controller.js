const User = require("../models/User");
const UserSession = require("../models/UserSession");

// api methods
function register(req, res) {
    const emailRegex = /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
    const { password } = req.body;
    let { email } = req.body;

    // Email validation
    if (!email) {
        return res.json({
            success: false,
            message: "Email field cannot be empty."
        });
    }
    if (!emailRegex.test(email)) {
        return res.json({
            success: false,
            message: "Email is invalid."
        });
    }
    email = email.toLowerCase();

    if (!password || password.length < 6) {
        return res.json({
            success: false,
            message: "Password must be at least 6 characters."
        });
    }

    // check if user exists
    User.find({ email: email }, (err, prevUser) => {
        // Check if user exists or there is an error
        if (err) {
            return res.send({
                success: false,
                message: "Server error"
            });
        } else if (prevUser.length > 0) {
            return res.send({
                success: false,
                message: "Account already exists"
            });
        }
    });

    // Create User
    const newUser = new User({
        email
    });

    // hash password and email
    newUser.password = newUser.generatePasswordHash(password);

    // Save User
    newUser.save((err, user) => {
        if (err) {
            return res.send({
                success: false,
                message:
                    "Server error. Couldn't create user. Please refresh the page and try again."
            });
        }
        res.send({
            success: true,
            message: "Success"
        });
    });
}
function login(req, res) {
    const { password } = req.body;
    let { email } = req.body;

    if (!password && !email) {
        return res.send({
            success: false,
            message: "Please enter your email and password"
        });
    }

    if (!password || password.length < 6) {
        return res.send({
            success: false,
            message:
                "Please enter your password. There must be at lease 6 characters."
        });
    }

    // Email validation
    if (!email) {
        return res.send({
            success: false,
            message: "Please enter your email"
        });
    }
    email = email.toLowerCase();

    // Check user
    User.find({ email: email }, (err, users) => {
        // Check for error
        if (err) {
            return res.send({
                success: false,
                message:
                    "Server Error. Couldn't Login user. Please refresh the page and try again."
            });
        }

        if (users.length != 1) {
            return res.send({
                success: false,
                message: "User not found"
            });
        }

        // grab user
        const user = users[0];

        // Verify Password
        if (!user.validPassword(password)) {
            return res.send({
                success: false,
                message: "Invalid password"
            });
        }

        // Create new user session
        const userSession = new UserSession();
        userSession.userId = user._id;

        // Save user session
        userSession.save((err, doc) => {
            if (err) {
                return res.send({
                    success: false,
                    message:
                        "Error creating session. Please refresh the page and try again."
                });
            }

            const { email, type } = user;

            return res.send({
                success: true,
                message: "Valid Login",
                token: doc._id,
                userData: {
                    email,
                    type
                }
            });
        });
    });
}
function verify(req, res) {
    const { token } = req.query;
    verifyUserSession(token).then(_res => {
        try {
            if (_res.success) {
                // get user
                getUserById(_res.payload.userId).then(user => {
                    const { email, type } = user.payload;
                    return res.json({
                        success: true,
                        payload: {
                            email,
                            type
                        }
                    });
                });
            } else {
                return res.json(_res);
            }
        } catch (e) {
            res.json({
                success: false,
                message: "Error verifying user"
            });
        }
    });
}
function logout(req, res) {
    return res.json({
        success: true,
        payload: "Called from logout"
    });
}
function deleteUser(req, res) {}

// general functions
async function verifyUserSession(token) {
    if (!token) {
        return {
            success: false,
            message: "No token provided."
        };
    }

    try {
        return await UserSession.findById(token).then(session => {
            return {
                success: true,
                payload: session
            };
        });
    } catch (e) {
        return {
            success: false,
            message: "No session found"
        };
    }
}
async function getUserById(id) {
    if (!id) {
        return {
            success: false,
            message: "No id provided."
        };
    }
    try {
        return await User.findById(id).then(user => {
            if (user && user.isDeleted) {
                return {
                    success: false,
                    message: "User has been deleted."
                };
            }
            return {
                success: true,
                payload: user
            };
        });
    } catch (e) {
        return {
            success: false,
            message: "No user found"
        };
    }
}

module.exports = {
    register,
    login,
    logout,
    verify,
    verifyUserSession,
    deleteUser,
    getUserById
};
