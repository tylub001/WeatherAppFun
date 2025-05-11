export const getWeather = ({ latitude, longitude }, APIkey) => {
  return fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${APIkey}`
  ).then((res) => {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Error: ${res.status}`);
    }
  });
};

export const filterWeatherData = (data) => {
  const result = {};
  result.city = data.name;
  result.temp = { F: data.main.temp };
  result.type = getWeatherType(result.temp.F);
  result.condition = data.weather[0].main.toLowerCase();
result.isDay = isDay(data.sys, Date.now());
result.coordinates = data.coord;
result.feelsLike = data.main.feels_like;
result.windSpeed = getWindType(data.wind.speed);
result.description = data.weather[0].description;
  return result;
};

const isDay = ({ sunrise, sunset }, now) => {
  
return sunrise * 1000 < now && now < sunset * 1000;
};


const getWeatherType = (temperature) => {
if (temperature > 86) {
    return 'hot';
  } else if (temperature >= 66 && temperature < 86) {
    return 'warm';
  } else {
    return 'cold';
  }
};

const getWindType = (windSpeed) => {
  if (windSpeed > 75) {
    return "hurricane force";
  } else if (windSpeed >= 55 && windSpeed < 75) {
    return "strong gale";
  } else if (windSpeed >= 25 && windSpeed < 55) {
    return "moderate breeze"
  } else if (windSpeed >= 9 && windSpeed < 25) {
    return "light breeze";
  } else {
    return "calm";
  }
  };
