const User = require("../models/User");
const UserSession = require("../models/UserSession");
const { responseToSend } = require("../utils/api");

// api methods
function register(req, res) {
    const emailRegex = /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;
    const { password } = req.body;
    let { email } = req.body;

    // Email validation
    if (!email) {
        return responseToSend(res, {
            message: "Email field cannot be empty."
        });
    }
    if (!emailRegex.test(email)) {
        return responseToSend(res, {
            message: "Email is invalid."
        });
    }
    email = email.toLowerCase();

    if (!password || password.length < 6) {
        return responseToSend(res, {
            message: "Password must be at least 6 characters."
        });
    }

    // check if user exists
    User.findOne({ email: email }, (err, prevUser) => {
        // Check if user exists or there is an error
        if (err) {
            return responseToSend(res, {
                message: "Server error. Please refresh the page and try again."
            });
        } else if (prevUser) {
            return responseToSend(res, {
                message: "Account already exists"
            });
        }

        // Create User
        const newUser = new User({
            email
        });

        // hash password and email
        newUser.password = newUser.generatePasswordHash(password);

        // Save User
        newUser.save((err, user) => {
            if (err) {
                return responseToSend(res, {
                    message:
                        "Server error. Couldn't create user. Please refresh the page and try again."
                });
            }
            return responseToSend(res, {
                success: true,
                message: "Success"
            });
        });
    });
}
function login(req, res) {
    const { password } = req.body;
    let { email } = req.body;

    if (!password && !email) {
        return responseToSend(res, {
            message: "Please enter your email and password"
        });
    }

    if (!password || password.length < 6) {
        return responseToSend(res, {
            message:
                "Please enter your password. There must be at lease 6 characters."
        });
    }

    // Email validation
    if (!email) {
        return responseToSend(res, {
            message: "Please enter your email"
        });
    }
    email = email.toLowerCase();

    // Check user
    getUserData({ email }).then(_res => {
        try {
            if (_res.success) {
                const user = _res.payload;

                if (!user) {
                    return responseToSend(res, {
                        message:
                            "User doesn't exist. Please create account and try again."
                    });
                }

                // Verify Password
                if (!user.validPassword(password)) {
                    return responseToSend(res, {
                        message: "Invalid password"
                    });
                }
                // Create new user session
                const userSession = new UserSession();
                userSession.userId = user._id;

                // Save user session
                userSession.save((err, doc) => {
                    if (err) {
                        return responseToSend(res, {
                            message:
                                "Error creating session. Please refresh the page and try again."
                        });
                    }

                    const { email, type } = user;

                    return responseToSend(res, {
                        success: true,
                        message: "Valid Login",
                        payload: {
                            token: doc._id,
                            userData: {
                                email,
                                type
                            }
                        }
                    });
                });
            } else {
                return responseToSend(res, _res);
            }
        } catch (e) {
            return responseToSend(res, {
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
                getUserData({ id: _res.payload.userId }).then(user => {
                    const { email, type } = user.payload;
                    return responseToSend(res, {
                        success: true,
                        payload: {
                            email,
                            type
                        }
                    });
                });
            } else {
                return responseToSend(res, _res);
            }
        } catch (e) {
            responseToSend(res, {
                message: "Error verifying user"
            });
        }
    });
}
function logout(req, res) {
    try {
        const token = req.body.token || req.query.token || req.params.token;

        if (!token) {
            return responseToSend(res, {
                message: "Error logging out. No user token provided."
            });
        }

        deleteSession(token).then(_res => {
            if (_res.success) {
                return responseToSend(res, {
                    success: true,
                    message: "Logged Out"
                });
            }
            return responseToSend(res, _res);
        });
    } catch (e) {
        return responseToSend(res, {
            message: "Server Error. Please refresh the page and try again."
        });
    }
}
async function deleteUser(req, res) {
    const token = req.query.token || req.body.token;

    if (!token) {
        return responseToSend(res, {
            message: "Error logging out. No user token provided."
        });
    }

    const session = await UserSession.findByIdAndDelete(token);
    if (session) {
        // delete notes here as well
        return responseToSend(res, await deleteUserFromDb(session.userId));
    }

    return responseToSend(res, {
        message:
            "Server Error. Error deleting user. Please refresh the page and try again."
    });
}

// general functions
async function verifyUserSession(token) {
    if (!token) {
        return {
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
            message: "No session found"
        };
    }
}
async function getUserData({ email = "", id = "" }) {
    try {
        const findBy = email.length !== 0 ? { email } : { _id: id };
        return await User.findOne(findBy).then(user => {
            if (!user) {
                return {
                    message: "User doesn't exist."
                };
            }
            return {
                success: true,
                payload: user
            };
        });
    } catch (e) {
        return {
            message:
                "Server Error. Couldn't Login user. Please refresh the page and try again."
        };
    }
}
async function deleteSession(id) {
    try {
        return await UserSession.findOneAndDelete({ _id: id }).then(session => {
            if (!session) throw "Error";
            return {
                success: true,
                message: "Session Deleted"
            };
        });
    } catch (e) {
        return {
            message: "Server Error. Error deleting session."
        };
    }
}
async function deleteUserFromDb(id) {
    try {
        return await User.findByIdAndDelete(id).then(user => {
            if (!user) throw "Error";
            return {
                success: true,
                message: "User Deleted"
            };
        });
    } catch (e) {
        return {
            message: "Server Error. Error deleting user."
        };
    }
}
async function getUserIdFromToken(token) {
    try {
        const session = await UserSession.findById(token);
        console.log(session);
        // const { userId } = await UserSession.findById(token);
        return session.userId;
    } catch (e) {
        return null;
    }
}

module.exports = {
    register,
    login,
    logout,
    verify,
    verifyUserSession,
    deleteUser,
    getUserData,
    getUserIdFromToken
};
