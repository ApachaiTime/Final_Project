import "../Header/Header.css";
import { Link, useLocation } from "react-router-dom";
import { getAvatar } from "../../utils/userData";
import logo from "../../assets/logo.png";
import avatar from "../../assets/avatar_icon.png";
import { ParkSearch } from "../ParkSearch/ParkSearch";
import { useEffect } from "react";
export default function Header({
  handleOpenUserModal,
  currentUser,
  parks,
  park,
  getLandscapeImage,
  setHeaderPic,
  headerPic,
}) {
  useEffect(() => {
    if (getAvatar() !== null) {
      setHeaderPic(getAvatar());
    }
  }, []);
  const location = useLocation();
  return (
    <header className="header">
      <span className="header__left">
        <Link to="/">
          {location.pathname !== "/" ? (
            <button className="header__logo">
              <img src={logo} alt="Logo" />
              National Park Explorer
            </button>
          ) : (
            <button className="header__logo header__logo-active">
              <img src={logo} alt="Logo" />
              National Park Explorer
            </button>
          )}
        </Link>
      </span>
      <span className="header__right">
        <ParkSearch
          parks={parks}
          park={park}
          getLandscapeImage={getLandscapeImage}
        />

        <button
          className="header__profile"
          onClick={() => handleOpenUserModal("user")}
        >
          <img
            className="header__profile__avatar"
            src={headerPic || avatar}
            alt="Avatar"
          />
          <p className="header__profile__text">{currentUser}</p>
        </button>
      </span>
    </header>
  );
}
