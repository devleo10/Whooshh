// Define an object named 'weather' to store weather-related data and methods
const weather = {
	// API key for accessing the OpenWeatherMap API
	apiKey: "5c52164e53557f5608b4e45fbc3756f7",
	
	// Method to fetch weather data for a given city
	fetchWeather: function(city) {
	  // Fetch weather data from OpenWeatherMap API using the provided city and API key
	  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
		// Handle the response by converting it to JSON
		.then((response) => response.json())
		// Call the displayWeather method with the fetched data
		.then((data) => {
		  this.displayWeather(data);
		})
		// Catch any errors that may occur during the fetch operation
		.catch((error) => {
		  console.error("Error fetching weather data:", error);
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
	  document.body.style.backgroundImage="url('https://source.unsplash.com/random/1600x900/?"+ name + '")"

	},
	
   

	

  
	// Method to initiate a weather search based on the entered value in the search bar
	search: function() {
	  // Log a message when the search button is clicked
	  console.log("Search button clicked");
	  // Call the fetchWeather method with the value entered in the search bar
	  this.fetchWeather(document.querySelector(".search-bar").value);
	}
  };
  
  
  // Add an event listener to the search button to trigger the weather search when clicked
  document.querySelector(".search button").addEventListener("click", function() {
	weather.search();
  });
  
  // Add an event listener to the search bar to trigger the weather search when the Enter key is pressed
  document
	.querySelector(".search-bar")
	.addEventListener("keyup", function (event) {
	  // Check if the pressed key is Enter, and if true, call the search method
	  if (event.key == "Enter") {
		weather.search();
	  }
	});
  
  // Initially fetch weather data for the city "Kolkata" when the script is loaded
 weather.fetchWeather("Kolkata");
	
