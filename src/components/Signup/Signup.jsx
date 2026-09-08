import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { handleRegistration } from "../../utils/auth";
import { useFormWithValidation } from "../../hooks/formValidation.js";
import { useState } from "react";
export default function Signup() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    values,
    errors,
    isValid,
    handleChange,
    resetForm,
    validateForm,
    setServerError,
  } = useFormWithValidation({
    name: "",
    email: "",
    password: "",
    confirmPass: "",
    zipCode: "",
  });
  const handleSignUp = (evt) => {
    evt.preventDefault();
    validateForm(evt.target);

    if (!evt.target.checkValidity()) {
      return;
    }
    console.log("Submitting:", values);
    setSubmitted(true);
    handleRegistration(values)
      .then(() => {
        resetForm();
        setSuccessMessage("Regestration successful!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/signin");
        }, 2000);
      })
      .catch((err) => {
        if (err.status === 409) {
          return setServerError("email", err.message);
        }
      });
  };
  return (
    <div className="signup">
      <div className="signup__container">
        <form
          noValidate
          onSubmit={handleSignUp}
          action="submit"
          className="signup__form"
        >
          <label htmlFor="name">Name*</label>
          <input className="signup__input"
            onChange={(e) => {
              {
                handleChange(e);
              }
            }}
            value={values.name || ""}
            required
            minLength={2}
            maxLength={22}
            type="text"
            name="name"
          />
          <span className="error">{errors.name}</span>
          <label htmlFor="email">Email*</label>
          <input className="signup__input"
            onChange={(e) => {
              {
                handleChange(e);
              }
            }}
            value={values.email || ""}
            required
            minLength={5}
            maxLength={50}
            type="email"
            name="email"
          />
          <span className="error">{errors.email}</span>
          <label htmlFor="password">Password</label>
          <input className="signup__input"
            onChange={(e) => {
              {
                handleChange(e);
              }
            }}
            value={values.password || ""}
            required
            minLength={8}
            maxLength={30}
            type="password"
            name="password"
          />{" "}
          <span className="error">{errors.password}</span>
          <label htmlFor="confirmPass">Confirm password*</label>
          <input className="signup__input"
            onChange={(e) => {
              {
                handleChange(e);
              }
            }}
            value={values.confirmPass || ""}
            required
            minLength={8}
            maxLength={30}
            type="password"
            name="confirmPass"
          />
          <span className="error">{errors.confirmPass}</span>
          <label htmlFor="zipCode">Zip code*</label>
          <input className="signup__input"
            onChange={(e) => {
              {
                handleChange(e);
              }
            }}
            value={values.zipCode || ""}
            required
            minLength={5}
            maxLength={5}
            type="text"
            name="zipCode"
          />
          <span className="error">{errors.zipCode}</span>
          <button type="submit" className="signup-btn">
            Continue
          </button>
          <Link to={"/signin"}>
            <button type="button" className="signin-btn__login">
              Log in
            </button>
          </Link>
        </form>
        <span>{successMessage}</span>
      </div>
    </div>
  );
}
