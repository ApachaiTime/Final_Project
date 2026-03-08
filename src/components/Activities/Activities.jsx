import "../Activities/Activities.css";
import { getPopularActivities } from "../../utils/npsApi";
import hikingIcon from "../../assets/hiking_icon.svg";
import tourIcon from "../../assets/tour_icon.svg";
import shopIcon from "../../assets/shop_icon.svg";
import museumIcon from "../../assets/museums_icon.svg";
import parkStoreIcon from "../../assets/park_store_icon.svg";
import juniorRangerIcon from "../../assets/junior_tag.svg";

import { useEffect, useState } from "react";

function Activities({ parks }) {
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    const popularActivities = getPopularActivities(parks);
    setActivities(popularActivities);
  }, [parks]);

  function getActivityImg(activityName) {
    const activityIcons = {
      Hiking: hikingIcon,
      Shopping: shopIcon,
      "Guided Tours": tourIcon,
      "Museum Exhibits": museumIcon,
      "Bookstore and Park Store": parkStoreIcon,
      "Junior Ranger Program": juniorRangerIcon,
    };
    return activityIcons[activityName];
  }
  return (
    <ul className="activities__list">
      {activities.map((activity) => (
        <li key={activity} className="activities__item">
          <p className="activity">
            <img
              className="activity__img"
              src={getActivityImg(activity)}
              alt=""
            />
            {activity}
          </p>
        </li>
      ))}
    </ul>
  );
}
export { Activities };
