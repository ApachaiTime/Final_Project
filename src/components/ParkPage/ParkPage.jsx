import "./ParkPage.css";
import backBtn from "../../assets/back_icon.svg";
import locationIcon from "../../assets/location_icon.svg";
import phoneIcon from "../../assets/phone_icon.svg";
import hoursIcon from "../../assets/hours_icon.svg";
import { useParams, useNavigate } from "react-router-dom";

export default function ParkPage({ parks }) {
  const { parkCode } = useParams();
  const park = parks.find((p) => p.parkCode === parkCode);
  const navigate = useNavigate();
  const parkActivities =
    park?.activities
      ?.slice(0, 5)
      .map((activity, index) => <p key={index}>{activity.name}</p>) || [];

  const today = new Date()
    .toLocaleString("default", {
      weekday: "long",
    })
    .toLocaleLowerCase();
  function parkOpenStatusAndHours() {
    const hoursForToday = park?.operatingHours?.[today];
    return `${hoursForToday}` ?? "No hours available";
  }

  function handleButtonClick() {
    if (park?.url) {
      window.open(park.url, "_blank", "noopener,noreferrer");
    }
  }
  return (
    <section className="park-page">
    
        <div className="park-page__info">
          <p className="park-page__distance">
            {Math.round(park?.distanceMiles)} Miles
          </p>
          <span className="park-page__span">
            <div className="park-page__indicator"></div>

            <h1 className="park-page__title">
              {park ? park?.fullName : "Data is loading..."}
            </h1>
          </span>

          <div className="park-page__address__block">
            <img
              src={locationIcon}
              alt="Location icon"
              className="park-page__loc__img"
            />
            <div className="park-page__address">
              {park?.address?.line1} {park?.address?.city},{" "}
              {park?.address?.stateCode}, {park?.address?.postalCode}
            </div>
          </div>
          <ul className="park-page__list">
            <li className="park-page__item">
              <img
                src={phoneIcon}
                alt="Phone Icon"
                className="park-page__item__img"
              />
              <p className="park-page__item__text">
                {park ? park?.contact : "Data is loading..."}
              </p>
            </li>

            <li className="park-page__item">
              <img
                src={hoursIcon}
                alt="Hours Icon"
                className="park-page__item__img"
              />
              <p className="park-page__item__text">
                {park ? parkOpenStatusAndHours() : "Data is loading..."}
              </p>
            </li>
          </ul>

          <p className="park-page__description">{park?.description}</p>

          <button className="park-page-btn" onClick={() => handleButtonClick()}>
            Plan your trip &#x2192;
          </button>
        </div>
        <div className="park-page__activities"> {parkActivities}</div>
        <img
          src={park?.images?.[0]?.url ?? null}
          alt={park?.fullName ?? "Park Image"}
          className="park-page__img"
        />
   
    </section>
  );
}
