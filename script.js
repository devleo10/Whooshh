// Define an object named 'weather' to store weather-related data and methods
const weather = {
  // API key for accessing the OpenWeatherMap API
  apiKey: "5c52164e53557f5608b4e45fbc3756f7",

  // Method to fetch weather data for a given city
  fetchWeather: function(city) {
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
  displayWeather: function(data) {
    // Destructure relevant data from the response object
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    // Update HTML elements with the extracted weather information
    document.querySelector(".city").innerText = "Weather in " + name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + "km/h";

    // Fetch a background image from Unsplash based on the city
    this.fetchBackgroundImage(name);
  },

  // Method to fetch a background image from Unsplash
  fetchBackgroundImage: function(city) {
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=YOUR_ACCESS_KEY`;

    fetch(unsplashUrl)
      .then(response => response.json())
      .then(data => {
        const imageUrl = data[0]?.urls?.regular; // Get the image URL
        if (imageUrl) {
          document.body.style.backgroundImage = `url(${imageUrl})`; // Set the background image
        } else {
          this.setFallbackBackgroundImage(); // Set fallback if no image is returned
        }
      })
      .catch(error => {
        console.error("Error fetching background image:", error);
        this.setFallbackBackgroundImage(); // Set fallback in case of error
      });
  },

  // Method to set a fallback background image
  setFallbackBackgroundImage: function() {
    document.body.style.backgroundImage = "url('https://source.unsplash.com/random/1600x900/?city,landscape')";
  },

  // Method to initiate a weather search based on the entered value in the search bar
  search: function() {
    // Log a message when the search button is clicked
    console.log("Search button clicked");
    // Call the fetchWeather method with the value entered in the search bar
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  displayError: function() {
    document.querySelector(".city").innerText = "City not found!";
    document.querySelector(".temp").innerText = "";
    document.querySelector(".icon").style.display = "none";
    document.querySelector(".description").innerText = "Please enter a valid city.";
    document.querySelector(".humidity").innerText = "";
    document.querySelector(".wind").innerText = "";
  }
};

// Add an event listener to the search button to trigger the weather search when clicked
document.querySelector(".search button").addEventListener("click", function() {
  weather.search();
});

// Add an event listener to the search bar to trigger the weather search when the Enter key is pressed
document.querySelector(".search-bar").addEventListener("keyup", function(event) {
  // Check if the pressed key is Enter, and if true, call the search method
  if (event.key === "Enter") {
    weather.search();
  }
});

// Initially fetch weather data for the city "Kolkata" when the script is loaded
weather.fetchWeather("Kolkata");
