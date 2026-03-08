import "../Main/Main.css";

import { Activities } from "../Activities/Activities";
import { FeaturedCard } from "../FeaturedCard/FeaturedCard";
import { ParkCard } from "../ParkCard/ParkCard";
export default function Main({ featured, closest, parks }) {
  return (
    <div className="main__content">
      <span className="main__span">
        <div className="main__text__indicator"></div>
        <h2 className="main__text">Most Popular Activities</h2>
      </span>

      <Activities parks={parks} />
      <span className="main__span">
        <div className="main__text__indicator"></div>
        <h2 className="main__text">Featured Parks</h2>
      </span>
      <ul className="feature-park__list">
        {featured.map((park) => {
          return (
            park && (
              <FeaturedCard featured={featured} park={park} key={park.id} />
            )
          );
        })}
      </ul>
      <span className="main__span">
        <div className="main__text__indicator"></div>
        <h2 className="main__text">Nearby Parks</h2>
      </span>
      <ul className="park-card__list">
        {closest.map((park) => {
          return (
            park && <ParkCard closest={closest} park={park} key={park.id} />
          );
        })}
      </ul>
    </div>
  );
}
