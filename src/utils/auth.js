import { checkResponse } from "./npsApi";
import { getToken, setToken } from "./token.js";
import { baseUrl } from "./api.js";
function endPointCall(endpoint, method, body = null, requiresAuth = false) {
  const jwt = getToken();
  const isFormData = body instanceof FormData;
  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type": "application/json",
        }),
    ...(requiresAuth ? { authorization: `Bearer ${jwt}` } : {}),
  };

  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = body;
  }
  return fetch(`${baseUrl}${endpoint}`, options).then(checkResponse);
}

const handleRegistration = (formValues) => {
  return endPointCall("/signup", "POST", JSON.stringify(formValues))
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("err", err.message);
      const customErr = new Error("Email already in use");
      customErr.status = 409;
      throw customErr;
    });
};
const handleLogin = ({ email, password }) => {
  if (!email || !password) {
    return console.error("Email and password are required for login");
  }
  return endPointCall("/signin", "POST", JSON.stringify({ email, password }))
    .then((data) => {
      if (data !== undefined) {
        return setToken(data.token);
      }
    })
    .then(() => {
      return endPointCall("/users/me", "GET", null, true);
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      const customErr = new Error("Invalid email or password");
      customErr.status = 401;
      throw customErr;
    });
};

const getCurrentUser = () => {
  return endPointCall("/users/me", "GET", null, true)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      const cutsomErr = new Error("Unable to fetch current user");
      cutsomErr.status = 404;
      throw cutsomErr;
    });
};

const updateUser = (formValues) => {
  return endPointCall("/users/me", "POST", formValues, true)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      const customErr = new Error("Unable to update user");
      customErr.status = 400;
      throw customErr;
    });
};
export {
  handleLogin,
  handleRegistration,
  endPointCall,
  getCurrentUser,
  updateUser,
};
