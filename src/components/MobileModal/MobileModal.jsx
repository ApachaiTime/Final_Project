import "./MobileModal.css";
import { ParkSearch } from "../ParkSearch/ParkSearch";
import greenBackIcon from "../../assets/green_back_icon.svg";
import avatar from "../../assets/avatar_icon.svg";

export default function MobileModal({
  isMobileModalOpened,
  handleOpenUserModal,
  onClose,
  parks,
  park,
  getLandscapeImage,
  headerPic,
  currentUser,
}) {
  return (
    <div
      className={`mobile__modal ${isMobileModalOpened ? "mobile__modal-opened" : ""} `}
    >
      <div className="mobile__content">
        <button className="mobile__back-btn" onClick={onClose}>
          <img className="mobile__back-img" src={greenBackIcon} alt="Back button" />
        </button>
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
          <p className="header__profile__text">{currentUser?.name}</p>
        </button>
      </div>
    </div>
  );
}
