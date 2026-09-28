import "./SavedBadge.css";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";

export default function SavedBadge({ parkCode, className = "" }) {
  const { currentUser, toggleSavedPark } = useContext(CurrentUserContext);
  const isSaved = currentUser?.savedParks?.includes(parkCode) ?? false;

  function handleClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    toggleSavedPark(parkCode);
  }

  return (
    <button
      type="button"
      className={`saved-badge${isSaved ? " saved-badge_active" : ""}${
        className ? ` ${className}` : ""
      }`}
      onClick={handleClick}
      aria-label={isSaved ? "Remove from saved parks" : "Save this park"}
      aria-pressed={isSaved}
    >
      <svg
        viewBox="0 0 24 24"
        className="saved-badge__icon"
        aria-hidden="true"
      >
        <path
          d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"
          fill={isSaved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
