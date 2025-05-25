import WeatherCard from "../WeatherCard/WeatherCard";
import ItemCard from "../ItemCard/ItemCard";
import "./Main.css";
import { useContext } from "react";
import CurrentTemperatureUnitContext from "../../contexts/CurrentTemperatureUnitContext";
import { defaultClothingItems } from "../../utils/constants";
function Main({
  weatherData,
  handleCardClick,
  isMobileMenuOpened,
  isSmallScreen,
  clothingItems,
}) {
  const { currentTemperatureUnit } = useContext(CurrentTemperatureUnitContext);

  return (
    <main>
      <div
        className={`weather-card ${
          isMobileMenuOpened && isSmallScreen ? "hidden" : ""
        }`}
      >
        <WeatherCard weatherData={weatherData} />
      </div>
      <section className="cards">
        <p className="cards__text">
          Today is {weatherData.temp[currentTemperatureUnit]}°
          {[currentTemperatureUnit]}/ You may want to wear:{" "}
        </p>
        <ul className="cards__list">
          {defaultClothingItems
            .filter(
              (item) =>
                item.weather.toLowerCase() === weatherData.type.toLowerCase()
            )
            .map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onCardClick={handleCardClick}
              />
            ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
