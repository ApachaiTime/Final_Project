import "../Header/Header.css";
import { Link, useLocation } from "react-router-dom";
import mobileIcon from "../../assets/ham_icon.svg";
import logo from "../../assets/logo.svg";
import avatar from "../../assets/avatar_icon.svg";
import { ParkSearch } from "../ParkSearch/ParkSearch";
import { useContext, useEffect } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
// Add logged in users details if token is saved
export default function Header({
  handleOpenUserModal,
  parks,
  getLandscapeImage,
  setHeaderPic,
  headerPic,
  toggleMobileMenu,
}) {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  useEffect(() => {}, []);
  const location = useLocation();
  return currentUser?.name === null ? (
    <>
      <header className="header">
        <button className="header__logo">
          <img src={logo} alt="Logo" />
          <p className="header__logo__text"> National Park Explorer</p>
        </button>
      </header>
    </>
  ) : (
    <header className="header">
      <div className="header__left">
        <Link to="/">
          {location.pathname !== "/" ? (
            <button className="header__logo">
              <img src={logo} alt="Logo" />
              <p className="header__logo__text"> National Park Explorer</p>
            </button>
          ) : (
            <button className="header__logo header__logo-active">
              <img src={logo} alt="Logo" />
              <p className="header__logo__text"> National Park Explorer</p>
            </button>
          )}
        </Link>
      </div>

      <button onClick={() => toggleMobileMenu()} className="header__mobile-btn">
        <img
          className="header__mobile-img"
          src={mobileIcon}
          alt="Header button"
        />
      </button>
      <div className="header__right">
        <ParkSearch parks={parks} getLandscapeImage={getLandscapeImage} />

        <button
          className="header__profile"
          onClick={() => handleOpenUserModal("user")}
        >
          <img
            className="header__profile__avatar"
            src={headerPic || avatar}
            alt="Avatar"
          />
          <p className="header__profile__text">{currentUser?.name}</p>
        </button>
      </div>
    </header>
  );
}
