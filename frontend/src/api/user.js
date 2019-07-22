import axios from "axios";
const defaultErrorEnding = "Please refresh the page and try again.";

async function register({ email, password }) {
  if (!email && !password) {
    return {
      success: false,
      message: "Please fill in your email and password"
    };
  }

  if (!email) {
    return {
      success: false,
      message: "Please enter your email"
    };
  }

  if (!password) {
    return {
      success: false,
      message: "Please enter your password"
    };
  }

  try {
    return await axios.post("/user/register", {
      email,
      password
    });
  } catch (e) {
    return {
      success: false,
      message: "Error calling register endpoint"
    };
  }
}
async function login({ email, password }) {
  if (!email && !password) {
    return {
      success: false,
      message: "Please fill in your email and password"
    };
  }

  if (!email) {
    return {
      success: false,
      message: "Please enter your email"
    };
  }

  if (!password) {
    return {
      success: false,
      message: "Please enter your password"
    };
  }

  try {
    return await axios.post("/user/login", {
      email,
      password
    });
  } catch (e) {
    return {
      success: false,
      message: "Error calling login endpoint"
    };
  }
}
async function logout(token) {
  if (!token) {
    return {
      success: false,
      message: `User token not found. ${defaultErrorEnding}`
    };
  }

  try {
    return await axios.get("/user/logout?token=" + token);
  } catch (e) {
    return {
      success: false,
      message: "Error calling logout endpoint"
    };
  }
}
async function verify(token) {
  if (!token) {
    return {
      success: false,
      message: `User verification token not given. ${defaultErrorEnding}`
    };
  }

  try {
    return await axios.get("/user/verify?token=" + token);
  } catch (e) {
    return {
      success: false,
      message: "Error calling verify endpoint"
    };
  }
}
async function deleteUser(token) {
  if (!token) {
    return {
      success: false,
      message: `User token not provided. ${defaultErrorEnding}`
    };
  }

  try {
    return await axios.delete("/user/deleteUser?token=" + token);
  } catch (e) {
    return {
      success: false,
      message: "Error calling deleteUser endpoint"
    };
  }
}

export { register, login, logout, verify, deleteUser };
