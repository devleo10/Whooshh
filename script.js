// Define an object named 'weather' to store weather-related data and methods
let soundEnabled = true;
let audio = document.getElementById("weatherSound");
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
        }else{
          return response.json();
        }

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
         const boxs = document.querySelector(".cbox");
         boxs.style.display ="none";

        throw new Error("City not found!");
        
      }else{
        const boxs = document.querySelector(".cbox");
        boxs.style.display ="block";

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
        temp: day.temp.day,
        humidity: day.humidity,
        pressure: day.pressure,
      }) )
      const today = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      // Use the current temperature as a base and create a simple annual temperature curve
      const currentTemp = data.current.temp;
      this.monthlyData = [];
      
      for (let i = 0; i < 12; i++) {
        const monthIndex = (today.getMonth() + i) % 12;
        const seasonalOffset = Math.sin(((monthIndex - 6) / 12) * 2 * Math.PI) * 10;
        
      this.monthlyData.push({
          time: monthNames[monthIndex],
          temp: currentTemp + seasonalOffset,
        });
      }
      // weatherChart(this.hourlyData, "hourly");
      HumidityPressureChart();
      console.log(this.weeklyData)
      console.log(this.hourlyData)
      console.log(this.monthlyData)
   })
      .catch(error => console.error("Error fetching forecast:", error));
  },
   fetchCForecast :function(lat,lon){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,current&appid=5796abbde9106b7da4febfae8c44c232`)
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
  
  stopsound:function(){
    if (audio && !audio.paused) {
      audio.pause();
      //audio.currentTime = 0;
  }
  
  soundEnabled = false; // Disable sound globally
 

  },
  continuesound:function(){
    audio.play()
    soundEnabled=true
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
    const descriptionz = data.weather[0].description.toLowerCase()
    soundEnabled = true
    let backgroundImage =""
          if (!soundEnabled) {
             
              return; // Don't play sound if user disabled it
          }
      
         
          
          // Check if audio element exists
          if (!audio) {
              audio = new Audio();
              audio.id = "weatherSound";
              document.body.appendChild(audio);
          }
      
          // Stop previous sound if playing
          if (!audio.paused) {
              audio.pause();
              audio.currentTime = 0;
          }
      
          // Set correct audio source based on weather condition
          if (
            descriptionz.includes("clear sky") ||
            descriptionz.includes("few clouds") ||
            descriptionz.includes("scattered clouds") ||
            descriptionz.includes("broken clouds") ||
            descriptionz.includes("overcast clouds")
        ) {
            audio.src = "./sounds/clearsky.mp3";
            const sunnyImages = ["./images/sunny1.jpg", "./images/sunny2.jpg", "./images/sunny3.jpg"];
            backgroundImage = sunnyImages[Math.floor(Math.random() * sunnyImages.length)];
        } else if (
            descriptionz.includes("light rain") ||
            descriptionz.includes("moderate rain") ||
            descriptionz.includes("heavy rain") ||
            descriptionz.includes("shower rain") ||
            descriptionz.includes("drizzle")
        ) {
          const rainyImages = ["./images/rain1.jpg", "./images/rain2.jpg", "./images/rain3.jpg"];
            backgroundImage = rainyImages[Math.floor(Math.random() * sunnyImages.length)];
            audio.src = "./sounds/rain-sound.mp3";
        } else if (
            descriptionz.includes("thunderstorm") ||
            descriptionz.includes("thunderstorm with rain") ||
            descriptionz.includes("thunderstorm with heavy rain")
        ) {
          const thunderImages = ["./images/thunder1.jpg", "./images/thunder2.jpg"];
            backgroundImage = thunderImages[Math.floor(Math.random() * sunnyImages.length)];
            audio.src = "./sounds/rnt.mp3";
        } else if (
            descriptionz.includes("haze") ||
            descriptionz.includes("mist") ||
            descriptionz.includes("fog") ||
            descriptionz.includes("smoke") ||
            descriptionz.includes("dust")
        ) {
          const fogImages = ["./images/fog1.jpg", "./images/fog2.jpg"];
            backgroundImage = fogImages[Math.floor(Math.random() * sunnyImages.length)];
         
            audio.src = "./sounds/wind.mp3";
        } else {
          backgroundImage=" "
            audio.src = "default.mp3"; // Default sound
        }
        
      
          // Play the audio
          audio.load();
          audio.oncanplaythrough = () => {
              audio.play().catch(error => console.error("Error playing audio:", error));
          };
          document.body.style.backgroundImage = `url('${backgroundImage}')`;
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
   // this.fetchBackgroundImage(name);
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
  // fetchBackgroundImage: async function (city) {
  //   const numImages = 8;
  //   const pexelsUrl = `https://api.pexels.com/v1/search?query=${city}&per_page=${numImages}`;

  //   try {
  //     const response = await fetch(pexelsUrl, {
  //       headers: { Authorization: "Wd0z8xbKGAwsn0jOdOwXHaFd4jHy9KcT62KjpqhdgM9TSywYzsHoDQrs" }
  //     });

  //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

  //     const data = await response.json();
  //     if (data.photos.length > 0) {
  //       const randomIndex = Math.floor(Math.random() * data.photos.length);
  //       document.body.style.backgroundImage = `url(${data.photos[randomIndex].src.landscape})`;
  //     } else {
  //       this.setFallbackBackgroundImage();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching background image:", error);
  //     this.setFallbackBackgroundImage();
  //   }
  // },

  // setFallbackBackgroundImage: function () {
  //   document.body.style.backgroundImage = "url('https://plus.unsplash.com/premium_photo-1675368244123-082a84cf3072?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')";
  // },

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

  
  getalldata: async function() {
    try {
        const [resp1, resp2, resp3, resp4] = await Promise.all([
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=Bangalore&units=metric&appid=${this.apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&units=metric&appid=${this.apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&appid=${this.apiKey}`),
            fetch(`https://api.openweathermap.org/data/2.5/weather?q=Delhi&units=metric&appid=${this.apiKey}`)
        ]);

        const data1 = await resp1.json();
        const data2 = await resp2.json();
        const data3 = await resp3.json();
        const data4 = await resp4.json();
// console.log(data1)
 //console.log(data2)
 //console.log(data3)
 //console.log(data4)
        // Helper function to update weather display
        const updateWeatherDisplay = (data, prefix) => {
            const { weather: [{ icon, description }] } = data;
            const { main: { temp, humidity } } = data;
            const { wind: { speed } } = data;

            document.getElementById(`${prefix}temp`).innerText = `${temp}°C`;
            document.getElementById(`${prefix}des`).innerText = description;
            document.getElementById(`${prefix}hum`).innerText = `Humidity: ${humidity}%`;
            document.getElementById(`${prefix}wind`).innerText = `Wind Speed: ${speed}km/h`;
            
            const iconElement = document.getElementById(`${prefix}icon`);
            if (iconElement) {
              console.log(`https://openweathermap.org/img/wn/${icon}@2x.png`)
                iconElement.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            }
        };

        
        updateWeatherDisplay(data1, 'b'); 
        updateWeatherDisplay(data2, 'h'); 
        updateWeatherDisplay(data3,'m')
        updateWeatherDisplay(data4,'d')

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
},

saveinfo: async function() {
  try {
      const fullText = document.getElementById("maincity").innerText;
      const city = fullText.replace("Weather in ", "").trim();
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      const weatherCard = document.createElement('div');
      weatherCard.className = 'bgcard';
      weatherCard.innerHTML = `
          <div>
              <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
          </div>
          <div>
              <h1>${city}</h1>
              <h2>${data.main.temp}°C</h2>
              <div>${data.weather[0].description}</div>
              <div>Humidity: ${data.main.humidity}%</div>
              <div>Wind speed: ${data.wind.speed} km/h</div>
          </div>
          <button class="remove-card" style="background:#1b1a1ae5; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              ✕
          </button>
      `;

      // Add click event listener to remove button
      const removeButton = weatherCard.querySelector('.remove-card');
      removeButton.addEventListener('click', () => {
          weatherCard.remove();
      });

      // Append the new card to savcards div
      document.querySelector('.savcards').appendChild(weatherCard);

      return data;
      
  } catch (error) {
      console.error("Error saving weather info:", error);
  }
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

// Cross button event listener
document.querySelector(".cross").addEventListener("click",function(){
        const boxs = document.querySelector(".cbox");
        boxs.style.display ="none";
})

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
document.getElementById("savbutton").addEventListener("click",function(){
  weather.saveinfo()
})
// Add an event listener to the search button to trigger the weather search when clicked
document.querySelector(".search button").addEventListener("click", function() {
  weather.search();
});
document.getElementById("Stopbutton").addEventListener("click", function(){
weather.stopsound()
});
document.getElementById("Continuebutton").addEventListener("click", function(){
  weather.continuesound()
  });
  const volumeSlider = document.getElementById("volumeSlider");

  // Function to update audio volume
  volumeSlider.addEventListener("input", function () {
      const audio = document.getElementById("weatherSound");
      if (audio) {
       
          audio.volume = volumeSlider.value / 100; // Convert range (0-100) to (0-1)
      }
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
weather.getalldata();


document.querySelector(".hourly-btn").addEventListener("click", function () {
  // const city = document.querySelector(".search-bar").value || "Kolkata";
  weatherChart(weather.hourlyData , "hourly" );

});

document.querySelector(".weekly-btn").addEventListener("click", function () {

   weatherChart(weather.weeklyData ,"weekly"); 

});

document.querySelector(".monthly-btn").addEventListener("click", function () {
  weatherChart(weather.monthlyData, "monthly");
})

let myChart;
let labels;
let temperatures;
// Function to create a weather chart using Chart.js
function weatherChart(data ,type) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.log("No data available for chart yet");
    return;
  }

  const ctx = document.getElementById("myChart").getContext("2d");
  const city = document.querySelector(".search-bar").value || "Kolkata";
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

  const maxTemp = Math.max(...temperatures);
  const maxTempIndex = temperatures.indexOf(maxTemp);

  const pointBackgroundColors = temperatures.map((temp, index) => 
    index === maxTempIndex ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
  );
  
  const pointRadius = temperatures.map((temp, index) => 
    index === maxTempIndex ? 6 : 3
  );

  if (myChart) {
    myChart.data.labels = labels;
    myChart.data.datasets[0].data = temperatures;
    myChart.data.datasets[0].pointBackgroundColor = pointBackgroundColors;
    myChart.data.datasets[0].pointRadius = pointRadius;
    myChart.data.datasets[0].label = `Temperature (°C) of ${city}`;
    myChart.update();
  } else {
    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels ,
        datasets: [
          {
            label: `Temperature (°C) of ${city}`,
            data: temperatures ,
            backgroundColor:"rgba(16, 167, 255, 0.2)",
            borderColor: "rgb(107, 255, 171)",
            pointBackgroundColor: pointBackgroundColors,
            pointBorderColor: pointBackgroundColors,
            pointRadius: pointRadius,
            borderWidth: 1,
            tension: 0,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += context.parsed.y;
                
                // Add special marker for max temperature
                if (context.dataIndex === maxTempIndex) {
                  label += ' (Highest)';
                }
                
                return label;
              }
            }
          }
        },
        scales: {

          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}

let myChart1;
function HumidityPressureChart() {
  const ctx = document.getElementById("myChart1").getContext("2d");

  const labels = weather.weeklyData.map((day) => day.date);
  const humidityData = weather.weeklyData.map((day) => day.humidity);
  const pressureData = weather.weeklyData.map((day) => day.pressure);

  if (myChart1 && typeof myChart1.destroy === "function") {
    myChart1.destroy();
  }

  myChart1 = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Humidity (%) ",
          data: humidityData,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          pointStyle: 'circle',
          borderWidth: 1,
          tension: 0,
          yAxisID: 'y',
        },
        {
          label: "Pressure (hPa)",
          data: pressureData,
          backgroundColor: "rgba(117, 48, 255, 0.62)",
          borderColor: "rgb(174, 255, 0)",
          pointStyle: 'circle',
          pointBackgroundColor: "rgb(119, 35, 255)",
          borderWidth: 1,
          tension: 0,
          pointBorderColor: 'rgb(211, 211, 211)',
          yAxisID: 'y1',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      animations: {
        radius: {
          duration: 400,
          easing: 'linear',
          loop: (context) => context.active
        }},
      stacked: false,
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",

          // grid line settings
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
        },
      },
    },
  });
}



const timeInfoContainer = document.getElementById("time-info");
    const timeTextDiv = document.getElementById("time-text");
    const timeSlider = document.getElementById("time-slider");
    const playPauseButton = document.getElementById("play-pause-bt");
    const pointerDataDiv = document.getElementById("pointer-data");
    let pointerLngLat = null;

    maptilersdk.config.apiKey = '7FGppJPzXOMC5e3hQHV5';

    const map = new maptilersdk.Map({
      container: document.getElementById('map'),
      hash: true,
      zoom: 2,
      center: [0, 40],
      style: maptilersdk.MapStyle.BACKDROP,
      projectionControl: true
    });

    const layer = new maptilerweather.WindLayer();

    map.on('load', function () {
      // Darkening the water layer to make the land stand out
      map.setPaintProperty("Water", 'fill-color', "rgba(0, 0, 0, 0.4)");
      map.addLayer(layer, 'Water');
    });

    timeSlider.addEventListener("input", (evt) => {
      layer.setAnimationTime(parseInt(timeSlider.value / 1000))
    })

    // Event called when all the datasource for the next days are added and ready.
    // From now on, the layer nows the start and end dates.
    layer.on("sourceReady", event => {
      const startDate = layer.getAnimationStartDate();
      const endDate = layer.getAnimationEndDate();
      const currentDate = layer.getAnimationTimeDate();
      refreshTime()

      timeSlider.min = +startDate;
      timeSlider.max = +endDate;
      timeSlider.value = +currentDate;
    })

    // Called when the animation is progressing
    layer.on("tick", event => {
      refreshTime();
      updatePointerValue(pointerLngLat);
    })

    // Called when the time is manually set
    layer.on("animationTimeSet", event => {
      refreshTime()
    })

    // When clicking on the play/pause
    let isPlaying = false;
    playPauseButton.addEventListener("click", () => {
      if (isPlaying) {
        layer.animateByFactor(0);
        playPauseButton.innerText = "Play 3600x";
      } else {
        layer.animateByFactor(3600);
        playPauseButton.innerText = "Pause";
      }

      isPlaying = !isPlaying;
    })

    // Update the date time display
    function refreshTime() {
      const d = layer.getAnimationTimeDate();
      timeTextDiv.innerText = d.toString();
      timeSlider.value = +d;
    }

    function updatePointerValue(lngLat) {
      if (!lngLat) return;
      pointerLngLat = lngLat;
      const value = layer.pickAt(lngLat.lng, lngLat.lat);
      if (!value) {
        pointerDataDiv.innerText = "";
        return;
      }
      pointerDataDiv.innerHTML = `<div id="arrow" style="transform: rotate(${value.directionAngle}deg);">↑</div>
      ${value.compassDirection} ${value.speedKilometersPerHour.toFixed(1)} km/h`;
    }

    timeInfoContainer.addEventListener("mouseenter", () => {
      pointerDataDiv.innerText = "";
    })

    map.on('mousemove', (e) => {
      updatePointerValue(e.lngLat);
    });

const mapContainer = document.getElementById('map');
mapContainer.style.width = '50%'; // Set a fixed width
mapContainer.style.height = '350px'; // Set a fixed height