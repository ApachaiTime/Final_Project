import { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { LandscapeImageContext } from "../../contexts/LandScapeImageContext.js";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";
import { getToken, removeToken } from "../../utils/token.js";
import { getCurrentUser, updateUser } from "../../utils/auth.js";
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
import MobileModal from "../MobileModal/MobileModal.jsx";
import Signin from "../Signin/Signin.jsx";
import Signup from "../Signup/Signup.jsx";
import getLatLongFromZip from "../../utils/geocode.js";

function App() {
  const [parks, setParks] = useState([]);
  const [closest, setClosest] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [activeModal, setActiveModal] = useState("");
  const [currentUser, setCurrentUser] = useState({
    name: null,
    zipCode: null,
    avatar: null,
  });
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [headerPic, setHeaderPic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpened, setisMobileMenuOpened] = useState(false);
  const [getError, setError] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    if (getToken() === null) {
      navigate("/signin");
    } else {
      navigate("/");
      getCurrentUser()
        .then((data) => {
          setCurrentUser(data);
          setHeaderPic(data.avatar);
          setProfilePicUrl(data.avatar);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    // If user has BOTH values, fetch for their location
    if (currentUser?.zipCode !== null) {
      const userCoords = getLatLongFromZip(currentUser.zipCode);
      userCoords
        .then((coords) => {
          if (!coords) {
            setError("Couldn't find coordinates for that ZIP");
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
        .catch((error) => {
          setError("Something went wrong loading parks.");
          console.error(error);
          setLoading(false);
        });
    }
    // If no ZIP, show default parks
    else {
      getParkData()
        .then((allParks) => {
          setParks(allParks);
          setClosest(getNearbyParks(allParks));
          setFeatured(getFeaturedParks(allParks));
        })
        .catch((error) => {
          setError("Something went wrong loading parks.");
          console.error(error);
          setLoading(false);
        });
    }
  }, [currentUser?.zipCode]);
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
    setProfilePicUrl(headerPic);
  }

  function handleSignOut() {
    removeToken();
    setCurrentUser({ name: null, zipCode: null });
    handleCloseModal();
    navigate("/signin");
  }

  const toggleMobileMenu = () => {
    setisMobileMenuOpened(!isMobileMenuOpened);
  };

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

    const cleanedZip = values.zipCode?.trim();
    if (!/^\d{5}(-\d{4})?$/.test(cleanedZip)) {
      setError("Enter a valid US ZIP code");
      return;
    }
    const userCoords = getLatLongFromZip(cleanedZip);
    return userCoords
      .then((coords) => {
        return coords;
      })
      .then((coords) => {
        if (!coords) {
          setError("Cloudn't find coordinates for that ZIP");
          return;
        }
        setLoading(true);

        const userUpdate = selectedFile
          ? (() => {
              const formData = new FormData();
              formData.append("avatar", selectedFile);
              formData.append("name", values.name);
              formData.append("zipCode", cleanedZip);
              return updateUser(formData);
            })()
          : updateUser(
              JSON.stringify({ name: values.name, zipCode: cleanedZip }),
            );

        return userUpdate
          .then((data) => {
            setCurrentUser(data);
            setHeaderPic(data.avatar);
            getLatLongFromZip(cleanedZip);
            return getParkData(coords);
          })

          .then((allParks) => {
            setLoading(false);
            handleCloseModal();
            setParks(allParks);
            setClosest(getNearbyParks(allParks));
            setFeatured(getFeaturedParks(allParks));
          })
          .catch((err) => {
            setError("Something went wrong updating your profile.");
            console.error(err);
            setLoading(false);
          });
      });
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <LandscapeImageContext.Provider value={getLandscapeImage}>
        <div className="app">
          <Header
            toggleMobileMenu={toggleMobileMenu}
            handleOpenUserModal={handleOpenUserModal}
            parks={parks}
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
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/signin" element={<Signin />}></Route>
          </Routes>
        </div>
        <UserModal
          onClose={handleCloseModal}
          isOpened={activeModal === "user"}
          name="user"
          handleSubmit={handleSubmit}
          buttonText={loading ? "Updating..." : "Update Profile"}
          profilePicUrl={profilePicUrl}
          setProfilePicUrl={setProfilePicUrl}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setHeaderPic={setHeaderPic}
          handleSignOut={handleSignOut}
        />
        <MobileModal
          isMobileModalOpened={isMobileMenuOpened}
          handleOpenUserModal={handleOpenUserModal}
          onClose={toggleMobileMenu}
          parks={parks}
          getLandscapeImage={getLandscapeImage}
          headerPic={headerPic}
          currentUser={currentUser}
        />
      </LandscapeImageContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
