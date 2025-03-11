// Define an object named 'weather' to store weather-related data and methods
const weather = {
  apiKey: "5c52164e53557f5608b4e45fbc3756f7",
  celsiusTemp: null,
  isCelsius: true,

  fetchWeatherByCoords: function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => this.displayWeather(data))
      .catch(error => console.error("Error fetching weather by coordinates:", error));
  },

  fetchWeather: function(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("City not found!");
        }
        return response.json();
      })
      .then(data => this.displayWeather(data))
      .catch(error => {
        console.error("Error fetching weather data:", error);
        this.displayError();
      });
  },

  displayWeather: function(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    this.celsiusTemp = temp;
    this.updateTempDisplay();

    document.querySelector('.box').style.opacity = "1";
    document.querySelector(".error-container").style.display = "none";
    document.querySelector(".retry-search").value = "";
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = `${temp}°C`;
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind Speed: ${speed}km/h`;

    this.fetchBackgroundImage(name);
    document.querySelector(".toggle-checkbox").checked = !this.isCelsius;
  },

  updateTempDisplay: function() {
    const temp = this.isCelsius ? this.celsiusTemp : (this.celsiusTemp * 9 / 5) + 32;
    document.querySelector(".temp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },

  toggleUnit: function() {
    this.isCelsius = !this.isCelsius;
    this.updateTempDisplay();
  },

  fetchBackgroundImage: async function(city) {
    const numImages = 8;
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=${numImages}`;
    try {
      const response = await fetch(pexelsUrl, {
        headers: { Authorization: "Wd0z8xbKGAwsn0jOdOwXHaFd4jHy9KcT62KjpqhdgM9TSywYzsHoDQrs" }
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.photos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.photos.length);
        document.body.style.backgroundImage = `url(${data.photos[randomIndex].src.landscape})`;
      } else {
        this.setFallbackBackgroundImage();
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
      this.setFallbackBackgroundImage();
    }
  },

  setFallbackBackgroundImage: function() {
    document.body.style.backgroundImage = "url('https://plus.unsplash.com/premium_photo-1675368244123-082a84cf3072?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  },

  search: function() {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  displayError: function() {
    document.querySelector(".box").style.opacity = "0";
    const errorContainer = document.querySelector(".error-container");
    errorContainer.style.display = "flex";
    setTimeout(() => errorContainer.style.opacity = "1", 100);
    document.querySelector(".retry-button").addEventListener("click", function() {
      const retryValue = document.querySelector(".retry-search").value;
      document.querySelector(".search-bar").value = retryValue;
      weather.fetchWeather(retryValue);
    });
  }
};

// Event Listeners
document.querySelector(".search button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (event) => {
  if (event.key === "Enter") weather.search();
});
document.querySelector(".unit-toggle").addEventListener("click", () => weather.toggleUnit());
document.querySelector(".toggle-checkbox").addEventListener("change", () => weather.toggleUnit());
document.querySelector(".geolocation-btn").addEventListener("click", function() {
  if (navigator.geolocation) {
    this.classList.add('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.classList.remove('loading');
        weather.fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      () => {
        this.classList.remove('loading');
        alert("Location access denied. Please search manually.");
      }
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
});

// Initially fetch weather for Kolkata
weather.fetchWeather("Kolkata");
