// Define an object named 'weather' to store weather-related data and methods
const weather = {
  // API key for accessing the OpenWeatherMap API
  apiKey: "5c52164e53557f5608b4e45fbc3756f7",
  celsiusTemp: null,
  isCelsius: true,

  // Geolocation Weather Fetch
  fetchWeatherByCoords: function (lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => this.displayWeather(data))
      .catch(error => console.error("Error:", error));
  },

  // Method to fetch weather data for a given city
  fetchWeather: function (city) {
    // Fetch weather data from OpenWeatherMap API using the provided city and API key
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
      // Handle the response by converting it to JSON
      .then(response => {
        if (!response.ok) {
          throw new Error("City not found!");
        }
        return response.json();
      })
      // Call the displayWeather method with the fetched data
      .then(data => {
        this.displayWeather(data);
      })
      // Catch any errors that may occur during the fetch operation
      .catch(error => {
        console.error("Error fetching weather data:", error);
        this.displayError();
      });
  },

  // Method to display weather information on the webpage
  displayWeather: function (data) {
    // Destructure relevant data from the response object
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    this.celsiusTemp = data.main.temp;
    this.updateTempDisplay();

    // Update HTML elements with the extracted weather information
    document.querySelector('.box').style.opacity = "1";
    document.querySelector(".error-container").style.display = "none";
    document.querySelector(".retry-search").value = "";
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + "km/h";

    // Fetch a background image from Unsplash based on the city
    this.fetchBackgroundImage(name);
    this.celsiusTemp = data.main.temp;
    this.updateTempDisplay();
    document.querySelector(".toggle-checkbox").checked = !this.isCelsius;
  },
  updateTempDisplay: function () {
    const temp = this.isCelsius ?
      this.celsiusTemp :
      (this.celsiusTemp * 9 / 5) + 32;
    document.querySelector(".temp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },

  toggleUnit: function () {
    this.isCelsius = !this.isCelsius;
    this.updateTempDisplay();
  },
  updateTempDisplay: function () {
    const temp = this.isCelsius ? this.celsiusTemp : (this.celsiusTemp * 9 / 5) + 32;
    document.querySelector(".temp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },

  // Method to fetch a background image from Unsplash

  // let: imageCache = {},
  fetchBackgroundImage:async function (city) {
    const numImages = 8;
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=${numImages}`;

    try {
      const response = await fetch(pexelsUrl, {
        headers: {
          Authorization: "Wd0z8xbKGAwsn0jOdOwXHaFd4jHy9KcT62KjpqhdgM9TSywYzsHoDQrs"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.photos.length); // Random index
        const imageUrl = data.photos[randomIndex].src.landscape;
        // imageCache[city] = imageUrl;
        document.body.style.backgroundImage = `url(${imageUrl})`;
      } else {
        console.warn("No images found, using fallback.");
        setFallbackBackgroundImage();
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
      setFallbackBackgroundImage();
    }
  },

  // Method to set a fallback background image
  setFallbackBackgroundImage: function () {
    document.body.style.backgroundImage = "url('https://plus.unsplash.com/premium_photo-1675368244123-082a84cf3072?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  },


  // Method to initiate a weather search based on the entered value in the search bar
  search: function () {
    // Log a message when the search button is clicked
    console.log("Search button clicked");
    // Call the fetchWeather method with the value entered in the search bar
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  displayError: function () {
    const errorContainer = document.querySelector(".error-container");
    const weatherContainer = document.querySelector('.box');
    weatherContainer.style.opacity = "0";

    errorContainer.style.display = "flex";

    setTimeout(() => {
      errorContainer.style.opacity = "1";
    }, 100);

    document.querySelector(".retry-button").addEventListener("click", function () {
      const retryValue = document.querySelector(".retry-search").value;
      document.querySelector(".search-bar").value = retryValue;
      weather.fetchWeather(retryValue);
    });
  }
};

// Add an event listener to the search button to trigger the weather search when clicked
document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

// Add an event listener to the search bar to trigger the weather search when the Enter key is pressed
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
  // Check if the pressed key is Enter, and if true, call the search method
  if (event.key === "Enter") {
    weather.search();
  }
});
document.querySelector(".unit-toggle").addEventListener("click", function () {
  weather.toggleUnit();
});
document.querySelector(".toggle-checkbox").addEventListener("change", function () {
  weather.toggleUnit();
});
document.querySelector(".geolocation-btn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        weather.fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => alert("Location access denied. Please search manually.")
    );
  } else {
    alert("Geolocation not supported by your browser.");
  }
});
// Initially fetch weather data for the city "Kolkata" when the script is loaded
weather.fetchWeather("Kolkata");
