const User = require("../models/User");
const UserSession = require("../models/UserSession");
const { responseToSend } = require("../utils/api");

// api methods
async function register(req, res) {
    const { password = "" } = req.body;
    let { email = "" } = req.body;
    email = email.toLowerCase();

    const areInputsValid = verifyValidEmailAndPassword({ email, password });
    if (!areInputsValid.success) {
        return responseToSend(res, areInputsValid);
    }

    const userExists = await getUserData({ email });
    if (userExists.success) {
        return responseToSend(res, {
            message: "Account already exists"
        });
    }
    if (userExists.isServerError) {
        return responseToSend(res, {
            message: userExists.message
        });
    }

    // Create User
    const newUser = new User({ email });

    // hash password and email
    newUser.password = newUser.generatePasswordHash(password);

    // Save User
    newUser.save((err, user) => {
        const responseData = err
            ? {
                  message:
                      "Server error. Couldn't create user. Please refresh the page and try again."
              }
            : {
                  success: true,
                  message: "Success"
              };

        return responseToSend(res, responseData);
    });
}
async function login(req, res) {
    const { password = "" } = req.body;
    let { email = "" } = req.body;
    email = email.toLowerCase();

    const areInputsValid = verifyValidEmailAndPassword({ email, password });
    if (!areInputsValid.success) {
        return responseToSend(res, areInputsValid);
    }

    const userCall = await getUserData({ email });
    if (userCall.success) {
        const { payload: user } = userCall;
        let errorMessage = "";

        // verify user exists and password
        if (!user) {
            errorMessage =
                "User doesn't exist. Please create account and try again.";
        }
        if (!user.validPassword(password)) {
            errorMessage = "Invalid password";
        }
        if (errorMessage) {
            return responseToSend(res, {
                message: errorMessage
            });
        }

        // Create new user session
        const userSession = new UserSession({
            userId: user._id
        });
        const { email, type } = user;

        // Save user session
        userSession.save((err, doc) => {
            const responseData = err
                ? {
                      message:
                          "Error creating session. Please refresh the page and try again."
                  }
                : {
                      success: true,
                      message: "Valid Login",
                      payload: {
                          token: doc._id,
                          userData: {
                              email,
                              type
                          }
                      }
                  };

            return responseToSend(res, responseData);
        });
    } else {
        // Error
        return responseToSend(res, userCall);
    }
}
async function verify(req, res) {
    const { token } = req.query;
    const validSession = await verifyUserSession(token);

    if (validSession.success) {
        const {
            success = false,
            message = "",
            payload: user
        } = await getUserData({ id: validSession.payload.userId });
        const responseData = success
            ? {
                  success,
                  payload: {
                      email: user.email,
                      type: user.type
                  }
              }
            : {
                  message
              };

        return responseToSend(res, responseData);
    } else {
        // Error
        return responseToSend(res, validSession);
    }
}

// Don't need to verify logout and deleteUser tokens as our middleware does it
async function logout(req, res) {
    const token = req.body.token || req.query.token;
    const sessionDelete = await deleteSession(token);
    const responseData = sessionDelete.success
        ? {
              success: true,
              message: "Logged Out"
          }
        : sessionDelete;

    return responseToSend(res, responseData);
}
async function deleteUser(req, res) {
    const token = req.body.token || req.query.token;
    const userId = await getUserIdFromToken(token);
    const allSessionDelete = await deleteAllSessions(userId);

    if (allSessionDelete.success) {
        // delete notes here as well
        return responseToSend(res, await deleteUserFromDb(userId));
    } else {
        return responseToSend(res, {
            message:
                "Server Error. Error deleting user. Please refresh the page and try again."
        });
    }
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
                    success: false,
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
            success: false,
            isServerError: true,
            message:
                "Server Error. Couldn't find user. Please refresh the page and try again."
        };
    }
}
async function getUserIdFromToken(token) {
    try {
        const { userId } = await UserSession.findById(token);
        return userId;
    } catch (e) {
        return null;
    }
}
async function deleteSession(id) {
    try {
        return await UserSession.findOneAndDelete({
            _id: id
        }).then(session => {
            if (!session) throw "Error";
            return {
                success: true,
                message: "Session Deleted",
                userId: session.userId
            };
        });
    } catch (e) {
        return {
            success: false,
            message: "Server Error. Error deleting session."
        };
    }
}
async function deleteAllSessions(userId) {
    try {
        return {
            success: true,
            payload: await UserSession.deleteMany({ userId: userId })
        };
    } catch (e) {
        return {
            success: false,
            message: "Server Error. Error deleting sessions."
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

function verifyValidEmailAndPassword({ email = "", password = "" }) {
    const emailRegex = /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/;

    if (!password && !email) {
        return {
            success: false,
            message: "Please enter your email and password"
        };
    }
    if (!email || !emailRegex.test(email)) {
        return {
            success: false,
            message: "Email is invalid."
        };
    }
    if (!password || password.length < 6) {
        return {
            success: false,
            message: "Password must be at least 6 characters."
        };
    }

    return {
        success: true
    };
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
