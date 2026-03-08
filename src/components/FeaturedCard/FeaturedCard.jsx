import "./FeaturedCard.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LandscapeImageContext } from "../../contexts/LandScapeImageContext.js";
import locationIcon from "../../assets/location_icon.svg";
function FeaturedCard({ park }) {
  const getLandscapeImage = useContext(LandscapeImageContext);
  return (
    <Link to={`/park/${park.parkCode}`}>
      <li className=" feature-park__item">
        <h3 className="feature-park__title">{park.fullName}</h3>
        <div className="feature-park__overlay"> </div>

        <img
          src={getLandscapeImage(park)}
          alt={park.fullName}
          className="feature-park__img"
        />
        <p className="feature-park__location">{park.state}</p>
        <img
          src={locationIcon}
          alt="Location icon"
          className="feature-park__location__img"
        />
      </li>
    </Link>
  );
}
export { FeaturedCard };
