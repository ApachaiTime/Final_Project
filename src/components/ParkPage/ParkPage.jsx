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
      ?.slice(0, 10)
      .map((activity, index) => <p key={index}>{activity.name}</p>) || [];
  const today = new Date()
    .toLocaleString("default", {
      weekday: "long",
    })
    .toLocaleLowerCase();
  function parkOpenStatusAndHours() {
    const hoursForToday = park?.operatingHours?.[today];
    return `${hoursForToday}`;
  }

  function handleButtonClick() {
    if (park?.url) {
      window.open(park.url, "_blank", "noopener,noreferrer");
    }
  }
  return (
    <div className="park-page">
      <button className="park-page__back__btn" onClick={() => navigate(-1)}>
        <img src={backBtn} alt="Back button" />
      </button>
      <img
        src={park?.images?.[0]?.url ?? ""}
        alt={park?.fullName ?? "Park Image"}
        className="park-page__img"
      />

      <div className="park-page__info">
        <p className="park-page__distance">
          {Math.round(park?.distanceMiles)} Miles
        </p>
        <span className="park-page__span">
          <div className="park-page__indicator"></div>

          <h1 className="park-page__title">{park?.fullName}</h1>
        </span>
        <span className="park-page__address__block">
          <img
            src={locationIcon}
            alt="Location icon"
            className="park-page__loc__img"
          />
          <div className="park-page__address">
            {park?.address?.line1} {park?.address?.city},{" "}
            {park?.address?.stateCode}, {park?.address?.postalCode}
          </div>
        </span>
        <div className="park-page__activities"> {parkActivities}</div>
        <p className="park-page__description">{park?.description}</p>
        <span className="park-page__span">
          <div className="park-page__indicator"></div>
          <h2 className="park-page__title">Contact & Hours</h2>
        </span>

        <ul className="park-page__list">
          <li className="park-page__item">
            <img
              src={phoneIcon}
              alt="Phone Icon"
              className="park-page__item__img"
            />
            <p className="park-page__item__text">{park?.contact}</p>
          </li>

          <li className="park-page__item">
            <img
              src={hoursIcon}
              alt="Hours Icon"
              className="park-page__item__img"
            />
            {parkOpenStatusAndHours()}
          </li>
        </ul>
        <button className="park-page__btn" onClick={() => handleButtonClick()}>
          Plan your trip &#x2192;
        </button>
      </div>
    </div>
  );
}
