const weather = {
  apiKey: "5c52164e53557f5608b4e45fbc3756f7",

  fetchWeather: function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`)
      .then(response => {
        if (!response.ok) throw new Error("City not found!");
        return response.json();
      })
      .then(data => {
        this.displayWeather(data);
        this.fetchAirQuality(data.coord.lat, data.coord.lon);
        this.setBackgroundImage(city); // Set city-based background
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        this.displayError();
      });
},


  fetchAirQuality: function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => {
        this.displayAirQuality(data);
        this.fetchExtraData(lat, lon);
      })
      .catch(error => console.error("Error fetching AQI data:", error));
  },

  fetchExtraData: function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => this.displayExtraData(data))
      .catch(error => console.error("Error fetching extra weather data:", error));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { temp, humidity, pressure } = data.main;
    const { speed } = data.wind;
    const { visibility } = data;
    const { description } = data.weather[0];

    document.querySelector(".city").innerText = `Weather in ${name}`;
    document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind Speed: ${speed} km/h`;
    document.querySelector(".visibility").innerText = `Visibility: ${visibility / 1000} km`;
    document.querySelector(".pressure").innerText = `Pressure: ${pressure} hPa`;
    document.querySelector(".description").innerText = description.charAt(0).toUpperCase() + description.slice(1);

    // Update weather icon
    this.updateWeatherIcon(description);
  },

  updateWeatherIcon: function (description) {
    const weatherIcons = {
      "clear sky": "fa-sun",
      "few clouds": "fa-cloud-sun",
      "scattered clouds": "fa-cloud",
      "broken clouds": "fa-cloud",
      "shower rain": "fa-cloud-showers-heavy",
      "rain": "fa-cloud-rain",
      "thunderstorm": "fa-bolt",
      "snow": "fa-snowflake",
      "mist": "fa-smog"
    };

    const iconClass = weatherIcons[description.toLowerCase()] || "fa-cloud";
    document.querySelector(".weather-icon").className = `weather-icon fas ${iconClass}`;
  },

  displayAirQuality: function (data) {
    const aqi = data.list[0].main.aqi;
    let aqiStatus = ["Good", "Fair", "Moderate", "Poor", "Very Poor"][aqi - 1] || "Unknown";
    document.querySelector(".air").innerText = `Air Quality: ${aqiStatus}`;
  },

  displayExtraData: function (data) {
    const { uvi, dew_point } = data.current;
    document.querySelector(".uv").innerText = `UV Index: ${uvi}`;
    document.querySelector(".dew").innerText = `Dew Point: ${dew_point}°C`;
  },

  setBackgroundImage: function (city) {
    const query = city.split(" ").join("+"); // Format city name for search

    // Use Google Image Search Randomizer (via Unsplash source)
    const googleImageSearchUrl = `https://source.unsplash.com/1600x900/?${query}`;

    // Set the background image
    document.body.style.backgroundImage = `url(${googleImageSearchUrl})`;

    console.log("Background Image URL:", googleImageSearchUrl); // ✅ Debugging
},


  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  fetchWeatherByCoords: function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => {
        this.displayWeather(data);
        this.fetchAirQuality(lat, lon);
        this.setBackgroundImage(data.weather[0].description);
      })
      .catch(error => console.error("Error fetching weather by coordinates:", error));
  },

  displayError: function () {
    document.querySelector(".error-container").style.display = "flex";
  }
};

// Event Listeners
document.querySelector(".search-button").addEventListener("click", function () {
  weather.search();
});
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    weather.search();
  }
});
document.querySelector(".geolocation-btn").addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => weather.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude),
      () => alert("Unable to retrieve location. Please search manually.")
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Initial Fetch
weather.fetchWeather("Kolkata");
