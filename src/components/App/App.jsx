
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import "./App.css";
import { coordinates, APIkey } from "../../utils/constants";
import Header from "../Header/Header";
import Main from "../Main/Main";
import Footer from "../Footer/Footer";
import ItemModal from "../ItemModal/ItemModal";
import { getWeather, filterWeatherData } from "../../utils/weatherAPI";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import Profile from "../Profile/Profile";
import DeleteConfirmationModal from "../DeleteConfirmationModal/DeleteConfirmationModal";
import { deleteItem, getItems, addItem } from "../../utils/api";

function App() {
  const [weatherData, setWeatherData] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
    condition: "",
    isDay: false,
  });

  const [activeModal, setActiveModal] = useState("");

  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const [clothingItems, setClothingItems] = useState([]);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [cardToDelete, setCardToDelete] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const openConfirmationModal = (card) => {
    setIsConfirmModalOpen(true);
    setCardToDelete(card);
  };

  const handleCardDelete = () => {
    if (!cardToDelete) return;

    deleteItem(cardToDelete._id)
      .then(() => {
        setClothingItems((prevItems) =>
          prevItems.filter((item) => item._id !== cardToDelete._id)
        );
        setIsConfirmModalOpen(false);
        setCardToDelete(null);
        closeActiveModal();
      })
      .catch(console.error);
  };

  const handleToggleSwitchChange = () => {
    setCurrentTemperatureUnit(currentTemperatureUnit === "F" ? "C" : "F");
  };

  const useWindowWidth = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowWidth;
  };
  const windowWidth = useWindowWidth();
  const isSmallScreen = windowWidth < 768;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpened((prevState) => !prevState);
  };

  useEffect(() => {
    if (windowWidth >= 768 && isMobileMenuOpened) {
      setIsMobileMenuOpened(false);
    }
  }, [windowWidth, isMobileMenuOpened]);

  const closeActiveModal = (event) => {
    if (
      !event ||
      event.key === "Escape" ||
      event.target === event.currentTarget ||
      event.type === "click"
    ) {
      setActiveModal("");
    }
  };

  useEffect(() => {
    if (!activeModal) return;
    document.addEventListener("keydown", closeActiveModal);
    return () => document.removeEventListener("keydown", closeActiveModal);
  }, [activeModal]);

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
  };

  const handleAddClick = () => {
    setActiveModal("add-garment");
  };

  const handleAddItemModalSubmit = ({ name, imageUrl, weather }) => {
    addItem({ name, imageUrl, weather })
      .then((item) => {
        setClothingItems((prevItems) => [item, ...prevItems]);
        closeActiveModal();
      })
      .catch(console.error);
  };

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeatherData(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data);
      })
      .catch(console.error);
  }, []);

  return (
    <CurrentTemperatureUnitContext.Provider
      value={{ currentTemperatureUnit, handleToggleSwitchChange }}
    >
      <div className={`page ${darkMode ? "page__dark-mode" : ""}`}>
        {darkMode && (
          <div className="stars">
            <span
              className="star"
              style={{ top: "5%", left: "10%", animationDelay: "0s" }}
            ></span>
            <span
              className="star"
              style={{ top: "15%", left: "70%", animationDelay: "0.5s" }}
            ></span>
            <span
              className="star"
              style={{ top: "25%", left: "40%", animationDelay: "1s" }}
            ></span>
            <span
              className="star"
              style={{ top: "35%", left: "85%", animationDelay: "0.2s" }}
            ></span>
            <span
              className="star"
              style={{ top: "45%", left: "15%", animationDelay: "1.5s" }}
            ></span>
            <span
              className="star"
              style={{ top: "55%", left: "60%", animationDelay: "0.8s" }}
            ></span>
            <span
              className="star"
              style={{ top: "65%", left: "30%", animationDelay: "2s" }}
            ></span>
            <span
              className="star"
              style={{ top: "75%", left: "90%", animationDelay: "1.2s" }}
            ></span>
            <span
              className="star"
              style={{ top: "85%", left: "50%", animationDelay: "0.3s" }}
            ></span>
            <span
              className="star"
              style={{ top: "95%", left: "20%", animationDelay: "1s" }}
            ></span>
            <span
              className="star"
              style={{ top: "10%", left: "80%", animationDelay: "0.7s" }}
            ></span>
            <span
              className="star"
              style={{ top: "50%", left: "5%", animationDelay: "1.8s" }}
            ></span>
          </div>
        )}
        <div className="page__content page__content_type_profile">
          <Header
            handleAddClick={handleAddClick}
            weatherData={weatherData}
            toggleMobileMenu={toggleMobileMenu}
            isMobileMenuOpened={isMobileMenuOpened}
            isSmallScreen={isSmallScreen}
            onDarkMode={handleDarkMode}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Main
                  weatherData={weatherData}
                  handleCardClick={handleCardClick}
                  isMobileMenuOpened={isMobileMenuOpened}
                  isSmallScreen={isSmallScreen}
                  clothingItems={clothingItems}
                />
              }
            />
            <Route
              path="/profile"
              element={
                <Profile
                  onCardClick={handleCardClick}
                  clothingItems={clothingItems}
                  onCardDelete={openConfirmationModal}
                  onAddItem={handleAddItemModalSubmit}
                  isMobileMenuOpened={isMobileMenuOpened}
                  toggleMobileMenu={toggleMobileMenu}
                  handleAddClick={handleAddClick}
                />
              }
            />
          </Routes>

          <Footer />
        </div>
        <AddItemModal
          onClose={closeActiveModal}
          isOpen={activeModal === "add-garment"}
          onAddItemModalSubmit={handleAddItemModalSubmit}
          closeActiveModal={closeActiveModal}
        />
        <ItemModal
          activeModal={activeModal}
          card={selectedCard}
          onClose={closeActiveModal}
          onDeleteClick={() => openConfirmationModal(selectedCard)}
        />
        <DeleteConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleCardDelete}
        />
      </div>
    </CurrentTemperatureUnitContext.Provider>
  );
}

export default App;
