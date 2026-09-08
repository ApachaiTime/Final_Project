import "./UserModal.css";
import { useForm } from "../../hooks/useForm";
import avatarIcon from "../../assets/avatar_icon.svg";
import greenBackIcon from "../../assets/green_back_icon.svg";

import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
export default function UserModal({
  onClose,
  isOpened,
  name,
  handleSubmit,
  buttonText,
  profilePicUrl,
  setProfilePicUrl,
  selectedFile,
  setSelectedFile,
  setHeaderPic,
  handleSignOut,
}) {
  const { setCurrentUser, currentUser } = useContext(CurrentUserContext);
  const { values, handleChange, setValues } = useForm({
    name: currentUser?.name || "",
    zipCode: currentUser?.zipCode || "",
    avatar: currentUser?.avatar || "",
  });

  useEffect(() => {
    if (currentUser) {
      console.log("currentUser", currentUser);
      setValues({
        name: currentUser?.name || "",
        zipCode: currentUser?.zipCode || "",
        avatar: currentUser?.avatar || "",
      });
    }
  }, [currentUser, setValues]);
  // work on full functionality of updating avatar and user info

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(values);
  };
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setProfilePicUrl(url);
    }
  }
  return (
    <div
      className={`modal modal_type_${name} ${isOpened ? "modal__opened" : ""}`}
    >
      <div className="modal__container">
        <div className="modal__content">
          <button className="modal__close-btn" onClick={onClose}>
            <img src={greenBackIcon} alt="Close button" />
          </button>
          <h2 className="modal__title">User Profile</h2>
          <img
            src={profilePicUrl || avatarIcon}
            alt="User Avatar"
            className="modal__profile__img"
          />
          <input
            className="modal__profile__input"
            type="file"
            accept="image/*"
            id="profile-pic"
            onChange={handleFileChange}
          />
          <p className="modal__text">
            This is a placeholder for the user profile information.
          </p>
          <form className="modal__form" onSubmit={onFormSubmit}>
            <label htmlFor="name" className="modal__label">
              User name:
            </label>
            <input
              required
              minLength={3}
              type="text"
              id="name"
              name="name"
              className="modal__input"
              placeholder="Name"
              onChange={handleChange}
              value={values.name}
            />

            <label htmlFor="zipCode" className="modal__label">
              ZIP Code:
            </label>
            <input
              required
              title="Enter a valid zip code"
              pattern="\d{5}"
              minLength={5}
              maxLength={5}
              type="text"
              id="zipCode"
              name="zipCode"
              className="modal__input"
              placeholder="Zip code"
              onChange={handleChange}
              value={values.zipCode}
            />
            <button type="submit" className="modal__submit-btn">
              {buttonText}
            </button>
          </form>
          <button
            type="button"
            className="modal__signout-btn"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
