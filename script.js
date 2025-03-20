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
        this.setBackgroundImage(city);
        this.fetchForecast(data.coord.lat, data.coord.lon);
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

  fetchForecast: function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,current&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => this.displayForecast(data))
      .catch(error => console.error("Error fetching forecast:", error));
  },

  displayWeather: function (data) {
    const { name } = data;
    const { temp, humidity, pressure } = data.main;
    const { speed } = data.wind;
    const { visibility } = data;
    const { description, icon } = data.weather[0];

    document.querySelector(".city").innerText = `Weather in ${name}`;
    document.querySelector(".temp").innerText = `${Math.round(temp)}°C`;
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind Speed: ${speed} km/h`;
    document.querySelector(".visibility").innerText = `Visibility: ${visibility / 1000} km`;
    document.querySelector(".pressure").innerText = `Pressure: ${pressure} hPa`;
    document.querySelector(".description").innerText = description.charAt(0).toUpperCase() + description.slice(1);
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    this.updateWeatherIcon(description);
    this.celsiusTemp = temp;
    this.updateTempDisplay();
    document.querySelector(".box").style.opacity = "1";
    document.querySelector(".error-container").style.display = "none";
  },

  displayForecast: function (data) {
    const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    this.forecastData = data.daily.slice(1).map(day => {
      const date = new Date(day.dt * 1000);
      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayIndex: date.getDay(),
        icon: day.weather[0].icon,
        description: day.weather[0].description,
        tempC: day.temp.day,
        tempF: (day.temp.day * 9/5) + 32
      };
    });

    this.forecastData.sort((a, b) => daysOrder.indexOf(a.date) - daysOrder.indexOf(b.date));
    this.displayForecastItems();
  },

  displayForecastItems: function () {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = "";

    this.forecastData.forEach(day => {
      const temp = this.isCelsius ? day.tempC : day.tempF;

      const forecastItem = document.createElement("div");
      forecastItem.classList.add("forecast-item");
      forecastItem.innerHTML = `
        <p>${day.date}</p>
        <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.description}">
        <p>${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}</p>
      `;

      forecastContainer.appendChild(forecastItem);
    });
  },

  toggleUnit: function () {
    this.isCelsius = !this.isCelsius;
    this.updateTempDisplay();
    this.displayForecastItems();
  },

  updateTempDisplay: function () {
    const temp = this.isCelsius ? this.celsiusTemp : (this.celsiusTemp * 9/5) + 32;
    document.querySelector(".temp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },

  setBackgroundImage: function (city) {
    const query = city.split(" ").join("+");
    const googleImageSearchUrl = `https://source.unsplash.com/1600x900/?${query}`;
    document.body.style.backgroundImage = `url(${googleImageSearchUrl})`;
  },

  displayError: function () {
    document.querySelector(".error-container").style.display = "flex";
  }
};

// Event Listeners
document.querySelector(".search-button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", event => {
  if (event.key === "Enter") weather.search();
});
document.querySelector(".geolocation-btn").addEventListener("click", () => {
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
