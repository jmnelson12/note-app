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
            return res.json({
                success: false,
                message: "Server error. Please refresh the page and try again."
            });
        } else if (prevUser.length > 0) {
            return res.json({
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
            return res.json({
                success: false,
                message:
                    "Server error. Couldn't create user. Please refresh the page and try again."
            });
        }
        res.json({
            success: true,
            message: "Success"
        });
    });
}
function login(req, res) {
    const { password } = req.body;
    let { email } = req.body;

    if (!password && !email) {
        return res.json({
            success: false,
            message: "Please enter your email and password"
        });
    }

    if (!password || password.length < 6) {
        return res.json({
            success: false,
            message:
                "Please enter your password. There must be at lease 6 characters."
        });
    }

    // Email validation
    if (!email) {
        return res.json({
            success: false,
            message: "Please enter your email"
        });
    }
    email = email.toLowerCase();

    // Check user
    getUserByEmail(email).then(_res => {
        try {
            if (_res.success) {
                const user = _res.payload;

                if (!user) {
                    return res.json({
                        success: false,
                        message:
                            "User doesn't exist. Please create account and try again."
                    });
                }

                // Verify Password
                if (!user.validPassword(password)) {
                    return res.json({
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
                        return res.json({
                            success: false,
                            message:
                                "Error creating session. Please refresh the page and try again."
                        });
                    }

                    const { email, type } = user;

                    return res.json({
                        success: true,
                        message: "Valid Login",
                        token: doc._id,
                        userData: {
                            email,
                            type
                        }
                    });
                });
            }
        } catch (e) {
            return res.json({
                success: false,
                message:
                    "Server Error. Couln't login user. Please reload and try again."
            });
        }
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
    try {
        const token = req.body.token || req.query.token || req.params.token;

        if (!token) {
            return res.json({
                success: false,
                payload: "Error logging out. No user token provided."
            });
        }

        deleteSession(token).then(_res => {
            return res.json(_res);
        });
    } catch (e) {
        return res.json({
            success: false,
            payload: "Server Error. Please refresh the page and try again."
        });
    }
}
function deleteUser(req, res) {
    const token = req.query.token || req.body.token;

    if (!token) {
        return res.json({
            success: false,
            payload: "Error logging out. No user token provided."
        });
    }

    verifyUserSession(token).then(_res => {
        if (_res.success) {
            const session = _res.payload;
            const { userId } = session;

            deleteSession(session._id).then(_r => {
                if (_r.success) {
                    deleteUser(userId).then(u => {
                        return res.json(u);
                    });
                } else {
                    return res.json({
                        success: false,
                        message:
                            "Server error. Error deleteing user. Please refresh the page and try again."
                    });
                }
            });
        } else {
            return res.json({
                success: false,
                message: "Must be logged in to delete user."
            });
        }
    });

    if (!token) {
        return res.json({
            success: false,
            message: "No token provided"
        });
    }
}

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
            if (!session) throw "No session";
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
async function getUserByEmail(email) {
    try {
        return await User.findOne({ email: email }).then(user => {
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
            message:
                "Server Error. Couldn't Login user. Please refresh the page and try again."
        };
    }
}
async function deleteSession(id) {
    try {
        return await UserSession.findOneAndDelete({ _id: id }).then(
            (err, session) => {
                if (err) {
                    return {
                        success: false,
                        payload: "Server Error. Error deleting session."
                    };
                }
                return {
                    success: true,
                    message: "Session Deleted"
                };
            }
        );
    } catch (e) {
        return {
            success: false,
            message: "Server Error. Error deleting session."
        };
    }
}
async function deleteUser(id) {
    try {
        return await User.findByIdAndDelete(id).then((err, doc) => {
            if (err) {
                return {
                    success: false,
                    message: "Error deleting user"
                };
            }

            if (!doc || doc.length === 0) {
                return {
                    success: false,
                    message: "Invalid token"
                };
            }

            return {
                success: true,
                message: "User Deleted"
            };
        });
    } catch (e) {
        return {
            success: false,
            message: "Server Error. Error deleting user."
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
