import "./UserModal.css";
import { getUserName, getUserZip, getAvatar } from "../../utils/userData.js";
import { useForm } from "../../hooks/useForm";
import avatarIcon from "../../assets/avatar_icon.png";
import greenBackIcon from "../../assets/green_back_icon.png";
import { useEffect } from "react";
export default function UserModal({
  onClose,
  isOpened,
  name,
  handleSubmit,
  setCurrentUser,
  buttonText,
  profilePicUrl,
  setProfilePicUrl,
  selectedFile,
  setSelectedFile,
  setHeaderPic,
}) {
  const { values, handleChange, setValues } = useForm({
    username: "",
    zip: "",
  });
  useEffect(() => {
    if (getAvatar() !== null) {
      setProfilePicUrl(getAvatar());
    }
    if (getUserName() == null && getUserZip() == null) {
      setCurrentUser("John Doe");
      setValues({
        username: "John Doe",
        zip: "75287",
      });
    }
    if (getUserName() !== null && getUserZip() !== null) {
      setValues({
        username: getUserName(),
        zip: getUserZip(),
      });
    }
  }, []);
  const onFormSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      const savedUrl = URL.createObjectURL(selectedFile);
      localStorage.setItem("UserProfileAvatar", savedUrl);
      setHeaderPic(savedUrl);
    }
    setCurrentUser(values.username);
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
          <button className="modal__close__btn" onClick={onClose}>
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
          <form action="submit" className="modal__form" onSubmit={onFormSubmit}>
            <label htmlFor="username" className="modal__label">
              Username:
            </label>
            <input
              required
              minLength={3}
              type="text"
              id="username"
              name="username"
              className="modal__input"
              onChange={handleChange}
              value={values.username}
            />
            <label htmlFor="zip" className="modal__label">
              ZIP Code:
            </label>
            <input
              required
              title="Enter a valid zip code"
              pattern="\d{5}"
              minLength={5}
              maxLength={5}
              type="text"
              id="zip"
              name="zip"
              className="modal__input"
              onChange={handleChange}
              value={values.zip}
            />
            <p className="modal__input__note"></p>
            <button type="submit" className="modal__submit__btn">
              {buttonText}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
