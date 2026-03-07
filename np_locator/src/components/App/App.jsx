import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { LandscapeImageContext } from "../../contexts/LandScapeImageContext.js";
import { getAvatar, getUserName, getUserZip } from "../../utils/userData.js";
import {
  getParkData,
  getNearbyParks,
  getFeaturedParks,
} from "../../utils/npsApi.js";
import "../App/App.css";
import Main from "../Main/Main.jsx";
import Header from "../Header/Header.jsx";
import ParkPage from "../ParkPage/ParkPage.jsx";
import UserModal from "../UserModal/UserModal.jsx";
import getLatLongFromZip from "../../utils/geocode.js";
function App() {
  const [parks, setParks] = useState([]);
  const [closest, setClosest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [headerPic, setHeaderPic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (getUserName() !== null && getUserZip() !== null) {
      setCurrentUser(getUserName());
      const userCoords = getLatLongFromZip(getUserZip());
      userCoords
        .then((coords) => {
          if (!coords) {
            setError("Cloudn't find coordinates for that ZIP");
            return;
          }
          setLoading(true);

          return getParkData(coords);
        })
        .then((allParks) => {
          setParks(allParks);
          setClosest(getNearbyParks(allParks));
          setFeatured(getFeaturedParks(allParks));
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Something went wrong loading parks.");
          setLoading(false);
        });
    }
    if (getUserName() == null && getUserZip() == null) {
      getParkData()
        .then((allParks) => {
          setParks(allParks);
          setClosest(getNearbyParks(allParks));
          setFeatured(getFeaturedParks(allParks));
        })
        .catch((err) => {
          console.error(err);
          setError("Something went wrong loading parks.");
          setLoading(false);
        });
    }
  }, []);
  function getLandscapeImage(park) {
    const imgs = park?.images;
    if (!Array.isArray(imgs) || imgs.length === 0) return null;
    const outdoorKeywords = [
      "landscape",
      "scenic",
      "view",
      "overlook",
      "vista",
      "mountain",
      "canyon",
      "river",
      "lake",
      "waterfall",
      "coast",
      "beach",
      "forest",
      "desert",
      "valley",
      "trail",
      "sunrise",
      "sunset",
      "wildflower",
      "bluebonnet",
      "flowers",
      "prairie",
      "dunes",
      "sky",
      "cliff",
    ];

    const avoidKeywords = [
      "interior",
      "museum",
      "visitor center",
      "exhibit",
      "painting",
      "mural",
      "portrait",
      "president",
      "signs",
      "order",
      "executive order",
      "historic photo",
    ];
    const scored = imgs
      .filter((img) => img?.url)
      .map((img) => {
        const text =
          `${img.altText ?? ""} ${img.title ?? ""} ${img.caption ?? ""}`.toLowerCase();
        let score = 0;
        for (const w of outdoorKeywords) if (text.includes(w)) score += 2;
        for (const w of avoidKeywords) if (text.includes(w)) score -= 3;
        return { imgs, score };
      })
      .sort((a, b) => b.score - a.score);
    return scored[0]?.imgs.url ?? imgs.find((i) => i.url)?.url ?? null;
  }

  function handleOpenUserModal(modalName) {
    setActiveModal(modalName);
  }

  function handleCloseModal() {
    setActiveModal("");
    setProfilePicUrl(getAvatar());
  }

  useEffect(() => {
    if (!activeModal) return;
    const handleEscClose = (e) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscClose);
    return () => {
      document.removeEventListener("keydown", handleEscClose);
    };
  }, [activeModal]);

  function handleSubmit(values) {
    setError("");

    const cleanedZip = values.zip.trim();
    if (!/^\d{5}(-\d{4})?$/.test(cleanedZip)) {
      setError("Enter a valid US ZIP code");
      return;
    }
    const userCoords = getLatLongFromZip(cleanedZip);
    return userCoords
      .then((coords) => {
        localStorage.setItem("UserName", values.username);
        localStorage.setItem("UserZip", cleanedZip);
        return coords;
      })
      .then((coords) => {
        if (!coords) {
          setError("Cloudn't find coordinates for that ZIP");
          return;
        }
        setLoading(true);

        return getParkData(coords);
      })
      .then((allParks) => {
        setParks(allParks);
        setClosest(getNearbyParks(allParks));
        setFeatured(getFeaturedParks(allParks));
        setLoading(false);
        handleCloseModal();
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong loading parks.");
        setLoading(false);
      });
  }

  return (
    <LandscapeImageContext.Provider value={getLandscapeImage}>
      <div className="app">
        <Header
          handleOpenUserModal={handleOpenUserModal}
          parks={parks}
          currentUser={currentUser}
          getLandscapeImage={getLandscapeImage}
          setHeaderPic={setHeaderPic}
          headerPic={headerPic}
        />
        <Routes>
          <Route
            path="/"
            element={
              <div className="app__content">
                <Main featured={featured} closest={closest} parks={parks} />
              </div>
            }
          />
          <Route
            path="/park/:parkCode"
            element={<ParkPage parks={parks} />}
          ></Route>
        </Routes>
      </div>
      <UserModal
        onClose={handleCloseModal}
        isOpened={activeModal === "user"}
        name="user"
        handleSubmit={handleSubmit}
        setCurrentUser={setCurrentUser}
        buttonText={loading ? "Updating..." : "Update Profile"}
        profilePicUrl={profilePicUrl}
        setProfilePicUrl={setProfilePicUrl}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setHeaderPic={setHeaderPic}
      />
    </LandscapeImageContext.Provider>
  );
}

export default App;
