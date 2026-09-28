import "../Main/Main.css";
import "./SavedParks.css";
import { useContext } from "react";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
import { ParkCard } from "../ParkCard/ParkCard.jsx";

export default function SavedParks({ parks }) {
  const { currentUser } = useContext(CurrentUserContext);
  const savedParks = (parks ?? []).filter((park) =>
    currentUser?.savedParks?.includes(park.parkCode),
  );

  return (
    <section className="main__content">
      <span className="main__span">
        <div className="main__text__indicator"></div>
        <h2 className="main__text">Saved Parks</h2>
      </span>

      {savedParks.length === 0 ? (
        <p className="saved-parks__empty">No parks saved yet.</p>
      ) : (
        <ul className="park-card__list">
          {savedParks.map((park) => (
            <ParkCard park={park} key={park.id} />
          ))}
        </ul>
      )}
    </section>
  );
}
