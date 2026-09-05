import "./Signin.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext";
import { handleLogin } from "../../utils/auth";
import { useFormWithValidation } from "../../hooks/formValidation";
import { setToken } from "../../utils/token";
import { useState } from "react";
import { checkResponse } from "../../utils/npsApi";
export default function Signin() {
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { setCurrentUser, currentUser } = useContext(CurrentUserContext);
  const {
    values,
    errors,
    isValid,
    handleChange,
    resetForm,
    validateForm,
    setServerError,
  } = useFormWithValidation({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSignin = (evt) => {
    evt.preventDefault();
    validateForm(evt.target);

    if (!evt.target.checkValidity()) {
      return;
    }
    setSubmitted(true);
    handleLogin(values)
      .then((data) => {
        resetForm();
        console.log(data);
        setSuccessMessage("Logging in...");
        setCurrentUser(data);
        console.log(currentUser);
      })
      .then(() => {
        navigate("/");
        setSuccessMessage("");
        console.log("user", currentUser);
      })
      .catch((err) => {
        console.log("err", err.message);
        if (err.status === 401) {
          return setServerError("password", err.message);
        }
      });
  };

  return (
    <div className="signin">
      <div className="signin__container">
        <form
          onSubmit={handleSignin}
          noValidate
          action="submit"
          className="signin__form"
        >
          <label className="signin__label" htmlFor="email">
            Email*
          </label>
          <input
            className="signin__input"
            value={values.email || ""}
            onChange={handleChange}
            required
            type="email"
            name="email"
          />
          <span className="error">{errors.email}</span>
          <label className="signin__label" htmlFor="password">
            Password*
          </label>
          <input
            className="signin__input"
            value={values.password || ""}
            onChange={handleChange}
            required
            type="password"
            name="password"
          />
          <span className="error">{errors.password}</span>
          <button type="submit" className="signin-btn">
            Log in
          </button>
          <Link to={"/signup"}>
            <button className="signin-btn__signup">Sign up</button>
          </Link>
        </form>
        <span>{successMessage}</span>
      </div>
    </div>
  );
}
