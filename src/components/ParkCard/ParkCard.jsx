import "./ParkCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LandscapeImageContext } from "../../contexts/LandscapeImageContext.js";
import SavedBadge from "../SavedBadge/SavedBadge.jsx";

function ParkCard({ park }) {
  const getLandscapeImage = useContext(LandscapeImageContext);

  const parkActivities = park.activities
    .slice(0, 3)
    .map((activity, index) => <p key={index}>{activity.name}</p>);
  return (
    <Link to={`/park/${park.parkCode}`}>
      <article className="park-card__container">
        <li className="park-card__item">
          <SavedBadge
            parkCode={park.parkCode}
            className="saved-badge_park-card"
          />
          <h2 className="park-card__title">{park.fullName}</h2>
          <p className="park-card__description">{park.description}</p>
          <div className="park-card__activities"> {parkActivities}</div>
          <p className="park-card__distance">
            {Math.round(park.distanceMiles)} Miles
          </p>
          <img
            className="park-card__img"
            src={getLandscapeImage(park)}
            alt={park.fullName}
          />

          <p className="park-card__text">Explore &#x2192; </p>
        </li>
      </article>
    </Link>
  );
}
export { ParkCard };
