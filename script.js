// Define an object named 'weather' to store weather-related data and methods
const weather = {
  // API key for accessing the OpenWeatherMap API
  apiKey: "5c52164e53557f5608b4e45fbc3756f7",
  celsiusTemp: null,
  isCelsius: true,

  // Geolocation Weather Fetch
  fetchWeatherByCoords: function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`)
      .then(response => response.json())
      .then(data => this.displayWeather(data))
      .catch(error => console.error("Error:", error));
  },

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
        this.fetchForecast(data.coord.lat, data.coord.lon);
      })
      // Catch any errors that may occur during the fetch operation
      .catch(error => {
        console.error("Error fetching weather data:", error);
        this.displayError();
      });
  },
  fetchCWeather:function(city){
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
    .then(response => {
      if (!response.ok) {
         alert('Enter the city name correctly')
        throw new Error("City not found!");
        
      }
      return response.json();
    })
    .then(data => {
      this.displayCweather(data)
      this.fetchCForecast(data.coord.lat,data.coord.lon)
    })
    .catch(error => {
      
      console.error("Error CCfetching weather data:", error);
    
    });
  },

   fetchForecast: function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely&appid=5796abbde9106b7da4febfae8c44c232`)
      .then(response => response.json())
      .then(data =>{ 
        this.displayForecast(data);

      this.hourlyData = data.hourly.slice(0, 24).map((hour) => ({
          time: new Date(hour.dt * 1000).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          temp:hour.temp,
        }));

      this.weeklyData = data.daily.slice(0,7).map((day)=>({
        date: new Date(day.dt * 1000).toLocaleTimeString([], {weekday: 'short'}),
        temp:day.temp.day,
      }) )


      const today = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Use the current temperature as a base and create a simple annual temperature curve
      const currentTemp = data.current.temp;
      this.monthlyData = [];
      
      for (let i = 0; i < 12; i++) {
        const monthIndex = (today.getMonth() + i) % 12;
        // Create a simple sinusoidal temperature variation throughout the year
        // Northern hemisphere: warmest in July (6), coldest in January (0)
        // Southern hemisphere: reverse pattern
        const seasonalOffset = Math.sin(((monthIndex - 6) / 12) * 2 * Math.PI) * 10;
        
        this.monthlyData.push({
          time: monthNames[monthIndex],
          temp: currentTemp + seasonalOffset,
        });
      }

      console.log(this.weeklyData)
      console.log(this.hourlyData)
      console.log(this.monthlyData)
   })
      .catch(error => console.error("Error fetching forecast:", error));
  },
   fetchCForecast :function(lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,curremt&appid=5796abbde9106b7da4febfae8c44c232`)
    .then(response => response.json())
      .then(data => this.displayCForecast(data))
      .catch(error => console.error("Error fetching forecast:", error));
   },
  displayForecast: function(data) {
    const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    this.forecastData = data.daily.slice(1).map(day => {
      const date = new Date(day.dt * 1000);
      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayIndex: date.getDay(), // Store numeric day index for sorting
        icon: day.weather[0].icon,
        description: day.weather[0].description,
        tempC: day.temp.day, // Store Celsius temperature
        tempF: (day.temp.day * 9/5) + 32 // Store Fahrenheit temperature
      };
    });
  
    // Sort forecastData based on the correct order of weekdays
    this.forecastData.sort((a, b) => daysOrder.indexOf(a.date) - daysOrder.indexOf(b.date));
  
    this.displayForecastItems(); // Call function to render forecast items
  },
  displayCForecast: function(data) {
    const daysOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
   
    this.forecastData = data.daily.slice(1).map(day => {
      const date = new Date(day.dt * 1000);
      return {
        date: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayIndex: date.getDay(), // Store numeric day index for sorting
        icon: day.weather[0].icon,
        description: day.weather[0].description,
        tempC: day.temp.day, // Store Celsius temperature
        tempF: (day.temp.day * 9/5) + 32 // Store Fahrenheit temperature
      };
    });
  
    // Sort forecastData based on the correct order of weekdays
    this.forecastData.sort((a, b) => daysOrder.indexOf(a.date) - daysOrder.indexOf(b.date));
  
    this.displayCForecastItems(); // Call function to render forecast items
  },
  
  displayForecastItems: function() {
    const forecastContainer = document.querySelector(".forecast-container");
    forecastContainer.innerHTML = ""; // Clear the container before updating
  
    this.forecastData.forEach((day) => {
      const temp = this.isCelsius ? day.tempC : day.tempF; // Choose correct unit
  
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
  displayCForecastItems: function() {
    const forecastContainer = document.querySelector(".cforecast-container");
    forecastContainer.innerHTML = ""; // Clear the container before updating
  
    this.forecastData.forEach((day) => {
      const temp = this.isCelsius ? day.tempC : day.tempF; // Choose correct unit
  
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
  

  // Method to display weather information on the webpage
  displayWeather: function(data) {
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
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
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
  displayCweather: function(data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    this.updateCTempDisplay()
    // Update HTML elements with proper class selectors
    document.querySelector('.ccity').innerText = "Weather in " + name;
    document.querySelector('.ctemp').innerText = temp + "°C";
    document.querySelector('.cdescription').innerText = description;
    document.querySelector('.chumidity').innerText = "Humidity: " + humidity + "%";
    document.querySelector('.cwind').innerText = "Wind Speed: " + speed + "km/h";
    document.querySelector('.ctext').value = " "
    
    // Update icon
    const iconElement = document.querySelector('.cbox .icon');
    if (iconElement) {
        iconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    this.celsiusTemp = data.main.temp;
    this.updateCTempDisplay();
    document.querySelector(".cbox .ctoggle-checkbox").checked = !this.isCelsius;
},
  updateTempDisplay: function() {
    const temp = this.isCelsius ? 
      this.celsiusTemp : 
      (this.celsiusTemp * 9/5) + 32;
      document.querySelector(".temp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },
  updateCTempDisplay:function(){
    const temp = this.isCelsius ? 
    this.celsiusTemp : 
    (this.celsiusTemp * 9/5) + 32;
    document.querySelector(".ctemp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },
  toggleUnit: function() {
    this.isCelsius = !this.isCelsius;
    this.updateTempDisplay();
    this.displayForecastItems(); 
      /// Ensure forecast updates when switching units
  },
  toggleCUnit:function(){
    this.isCelsius = !this.isCelsius;
    this.updateCTempDisplay();  // Add this line to update compared city temperature
    this.displayCForecastItems();
  },
  updateTempDisplay: function() {
    const temp = this.isCelsius ? this.celsiusTemp : (this.celsiusTemp * 9/5) + 32;
    document.querySelector(".temp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },
  updateCTempDisplay:function(){
   const temp =this.isCelsius ? this.celsiusTemp : (this.celsiusTemp * 9/5) + 32;
   document.querySelector(".ctemp").textContent = `${Math.round(temp)}°${this.isCelsius ? 'C' : 'F'}`;
  },

  // Method to fetch a background image from Unsplash
  fetchBackgroundImage: async function (city) {
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
        document.querySelector(".section1").style.backgroundImage = `url(${data.photos[randomIndex].src.landscape})`;
      } else {
        this.setFallbackBackgroundImage();
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
      this.setFallbackBackgroundImage();
    }
  },

  setFallbackBackgroundImage: function () {
    document.querySelector(".section1").style.backgroundImage = "url('https://plus.unsplash.com/premium_photo-1675368244123-082a84cf3072?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  },

  // Method to initiate a weather search based on the entered value in the search bar
  search: function() {
    // Log a message when the search button is clicked
    console.log("Search button clicked");
    // Call the fetchWeather method with the value entered in the search bar
    this.fetchWeather(document.querySelector(".search-bar").value);
  },

  fetchWeatherByCoords: function(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
    )
      .then(response => response.json())
      .then(data => this.displayWeather(data))
      .catch(error => {
        console.error("Error fetching weather by coordinates:", error);
      });
    },


  displayError: function() {
    const errorContainer = document.querySelector(".error-container");
    const weatherContainer = document.querySelector('.box');
    weatherContainer.style.opacity = "0";
    
    errorContainer.style.display = "flex";

    setTimeout(() => {
      errorContainer.style.opacity = "1";
    }, 100);

    document.querySelector(".retry-button").addEventListener("click", function() {
        const retryValue = document.querySelector(".retry-search").value;
        document.querySelector(".search-bar").value = retryValue;
        weather.fetchWeather(retryValue);
    });
  }

};
// Add geolocation event listener
document.querySelector(".geolocation-btn").addEventListener("click", function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        weather.fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        alert("Unable to retrieve your location. Please search manually.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});
// Add loading state during geolocation detection
document.querySelector(".geolocation-btn").addEventListener("click", function() {
  this.classList.add('loading');
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.classList.remove('loading');
        weather.fetchWeatherByCoords(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        this.classList.remove('loading');
        alert("Location access denied. Please search manually.");
      }
    );
  }
});
// Add an event listener to the search button to trigger the weather search when clicked
document.querySelector(".search button").addEventListener("click", function() {
  weather.search();
  const city = document.querySelector(".search-bar").value;
  weather.fetchWeather(city);
});

// Add an event listener to the search bar to trigger the weather search when the Enter key is pressed
document.querySelector(".search-bar").addEventListener("keyup", function(event) {
  // Check if the pressed key is Enter, and if true, call the search method
  if (event.key === "Enter") {
    const city = document.querySelector(".search-bar").value;
    weather.search();
    weather.fetchWeather(city);
  }
});
document.querySelector(".unit-toggle").addEventListener("click", function() {
  weather.toggleUnit();
});
document.querySelector(".toggle-checkbox").addEventListener("change", function() {
  weather.toggleUnit();
});
document.querySelector(".cunit-toggle").addEventListener("click", function() {

weather.toggleCUnit()
});
document.querySelector(".ctoggle-checkbox").addEventListener("change", function() {

weather.toggleCUnit()
});

// Add event listeners for the compare functionality
document.querySelector(".cbutton").addEventListener("click", function() {
  const compareText = document.querySelector(".ctext").value;
  
  weather.fetchCWeather(compareText)
});

document.querySelector(".ctext").addEventListener("keyup", function(event) {
  if (event.key === "Enter") {
      console.log("City to comparedd:", this.value);
  }
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

document.querySelector(".hourly-btn").addEventListener("click", function () {
  weatherChart(weather.hourlyData , "hourly");
  console.log("Hourly data:", weatherChart(weather.hourlyData));
});

document.querySelector(".weekly-btn").addEventListener("click", function () {

   weatherChart(weather.weeklyData ,"weekly"); 
    console.log("Weekly data:", weatherChart(weather.weeklyData));
});

document.querySelector(".monthly-btn").addEventListener("click", function () {
  weatherChart(weather.monthlyData, "monthly");
})

let myChart;

function weatherChart(data ,type) {
  const ctx = document.getElementById("myChart").getContext("2d");
  // let labels , temperatures;
  console.log("Chart data:", data);
  if (type === "hourly") {
    labels = data.map((hour) => hour.time);
    temperatures = data.map((hour) => hour.temp);
  } else if (type === "weekly") {
    labels = data.map((day) => day.date);
    temperatures = data.map((day) => day.temp);
  } 
  else if (type === "monthly") {
    labels = data.map((month) => month.time);
    temperatures = data.map((month) => month.temp);
  }
  if (myChart) {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = temperatures;
    myChart.update();
  } else {
    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels ,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temperatures,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            tension: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {

          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
