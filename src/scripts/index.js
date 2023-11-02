///I'm absolutely thankfull for this, but I couldn't finish, I really did my best and I hope you like it, it's a mess, I don't know how to use somethings (a lot actually) very well and the graph FUCKED ME UP,
// I did A LOT of researchs,videos, documentations, the despair even made me look up tiktok, but I wasn't able to do those charts in javascrip (sad face sad face cry cry cry)and I wanted to kms during the whole process, but thank you soooo sooooo muchhhh <3
//ALSO, you´re gay. gay. gay.
//I hope you liked the silly rainbow in the page name, I'm pretty proud of it, it's gay.

// API key for OpenWeatherMap
// ** This should not be directly on code, it's sensitive info
const key = "1be494fe196f5cb8dc69b3f8eb416139";

// URL for weather icons
const iconsUrl = "https://openweathermap.org/img/wn/10d@2x.png";

// URL for OpenWeatherMap API
const apiUrl = "https://api.openweathermap.org/data/2.5";

// HTML elements for displaying weather information
const cityName = document.getElementById("cityName");
const description = document.getElementById("description");
const temp = document.getElementById("temp");
const date = document.getElementById("date");
const weatherIcon = document.getElementById("weatherIcon");
const searchBar = document.getElementById("searchBar");
const results = document.getElementById("results");

// Array to store unique days in the forecast
const fiveDays = [];

// Arrays for month and day names
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Check if geolocation is available in the browser
if ("geolocation" in navigator) {
  // Get the user's current position
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Construct the API URL with latitude and longitude
      const url = `${apiUrl}/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${key}`;
      getData(url);
    },
    (error) => {
      console.error(error.message);
    }
  );
} else {
  alert("Geolocation is not supported in this browser");
}

function filterForecast(forecastArray, currentDate) {
  const today = new Date(currentDate);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const filteredForecast = forecastArray.filter((element) => {
    const elementDate = new Date(element.dt * 1000);
    return elementDate >= today && elementDate < tomorrow;
  });
  return filteredForecast;
}

let newChart

async function initChart(forecastArray, currentDate) {
  const filteredForecast = filterForecast(forecastArray, currentDate);

  const labels = filteredForecast.map((element) => {
    const elementDate = new Date(element.dt * 1000);
    return `${elementDate.getHours()}:00`;
  });

  const datapoints = filteredForecast.map((element) => {
    return element.main.temp;
  });
  const data = {
    labels: labels,
    datasets: [
      {
        label: "24-hour forecast",
        data: datapoints,
        borderColor: "#FFC355",
        fill: false,
        cubicInterpolationMode: "monotone",
      },
    ],
  };

  const chartCanvas = document.getElementById("chart")
  newChart = new Chart(chartCanvas, {
    type: "line",
    data,
    options: {
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: false,
          title: {
            display: true,
          },
        },
        y: {
          display: false,
          suggestedMin: -20,
          suggestedMax: 40,
        },
      },
    },
  });
}

// Function to fetch weather data from the API
async function getData(url) {
  // Clear weather icon content
  weatherIcon.innerHTML = "";

  // Fetch data from the API
  await fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      // Check if the city was not found
      if (data.cod == 404) {
        return alert("City not found");
      }

      // Clear the results content
      results.innerHTML = "";

      // Parse the date and display current weather information
      const dates = new Date(data.list[0].dt * 1000);
      const currentDay = days[dates.getDay()];
      const currentMonth = months[dates.getMonth()];
      const currentDate = dates.getDate();
      const currentYear = dates.getFullYear();

      // Update HTML elements with weather information
      cityName.innerText = data.city.name;
      description.innerText = data.list[0].weather[0].description;
      temp.innerText = `${parseInt(data.list[0].main.temp)}°C`;
      date.innerText = `${currentDay} | ${currentDate} ${currentMonth} ${currentYear}`;
      weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png">`;

      // Create HTML structure for displaying additional weather details
      results.innerHTML = `
                <div class="otherResults">
                    <div class="graph">
                        <canvas id="chart"></canvas>
                    </div>
                    <div id="forecastDays" class="forecast5days">
                      <div style="display: flex;">
                        <button id="back" class="forecastButton"><img id="backIcon" src="./src/assets/Vector.svg"></button>
                        <div id="weekDays">
                        </div>
                        <button id="next" class="forecastButton"><img id="nextIcon" src="./src/assets/Vector.svg"></button>
                      </div>
                      <div id="conditionContainer">
                      </div>
                    </div>
                </div>
            `;

      // Display weather details for each day
      var day = new Date()
      var dayData = 0

      const forecastDays = data.list.filter(element => {
        const currentDate = new Date(element.dt_txt).getDate();
        if (!fiveDays.includes(currentDate)) {
            return fiveDays.push(currentDate);
        }
    });

    console.log(forecastDays)

      weekDays.innerHTML = `<p>${days[day.getDay()]}</p>`
      conditionContainer.innerHTML = `
            <div>
              <h1 id="conditionText">Air Conditions</h1>
            </div>
            <div class="conditions">
            <img src="./src/assets/temp.svg">
              <p>Real feel</p>
            </div>
            <p class="valuesText">${parseInt(forecastDays[dayData].main.feels_like)}°C</p>
            <div class="conditions">
            <img src="./src/assets/air.svg">
              <p>Wind</p>
            </div>
            <p class="valuesText">${forecastDays[dayData].wind.speed}km/h</p>
            <div class="conditions">
            <img src="./src/assets/humidity.svg">
              <p>Humidity</p>
            </div>
            <p class="valuesText">${forecastDays[dayData].main.humidity}%</p>
          `

      back.addEventListener("click", async() => {
        if(dayData > 0){
          day.setDate(day.getDate() - 1);
          dayData--
          if(day == -1){
            day = days.length - 1
          }
          if(newChart){
            newChart.destroy()
          }
          await initChart(data.list, forecastDays[dayData].dt_txt)
          temp.innerText = `${parseInt(forecastDays[dayData].main.temp)}°C`;
          date.innerText = `${days[day.getDay()]} | ${day.getDate()} ${months[day.getMonth()]} ${day.getFullYear()}`;
          weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastDays[dayData].weather[0].icon}@2x.png">`;    
          description.innerText = forecastDays[dayData].weather[0].description;
          weekDays.innerHTML = `${days[day.getDay()]}`
          conditionContainer.innerHTML = `
            <div>
              <h1 id="conditionText">Air Conditions</h1>
            </div>
            <div class="conditions">
            <img src="./src/assets/temp.svg">
              <p>Real feel</p>
            </div>
            <p class="valuesText">${parseInt(forecastDays[dayData].main.feels_like)}°C</p>
            <div class="conditions">
            <img src="./src/assets/air.svg">
              <p>Wind</p>
            </div>
            <p class="valuesText">${forecastDays[dayData].wind.speed}km/h</p>
            <div class="conditions">
            <img src="./src/assets/humidity.svg">
              <p>Humidity</p>
            </div>
            <p class="valuesText">${forecastDays[dayData].main.humidity}%</p>
          `
        }
      })

      next.addEventListener("click", async() => {
        if(dayData < forecastDays.length - 1){
          day.setDate(day.getDate() + 1);
          dayData++
          if(day == days.length){
            day = 0
          }

          if(newChart){
            newChart.destroy()
          }
          await initChart(data.list, forecastDays[dayData].dt_txt)
          temp.innerText = `${parseInt(forecastDays[dayData].main.temp)}°C`;
          date.innerText = `${days[day.getDay()]} | ${day.getDate()} ${months[day.getMonth()]} ${day.getFullYear()}`;
          weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${forecastDays[dayData].weather[0].icon}@2x.png">`;    
          description.innerText = forecastDays[dayData].weather[0].description;
          weekDays.innerHTML = `${days[day.getDay()]}`
          conditionContainer.innerHTML = `
            <div>
              <h1 id="conditionText">Air Conditions</h1>
            </div>
            <div class="conditions">
            <img src="./src/assets/temp.svg">
              <p>Real feel</p>
            </div>
            <p class="valuesText">${parseInt(forecastDays[dayData].main.feels_like)}°C</p>
            <div class="conditions">
            <img src="./src/assets/air.svg">
              <p>Wind</p>
            </div>
            <p class="valuesText">${forecastDays[dayData].wind.speed}km/h</p>
            <div class="conditions">
            <img src="./src/assets/humidity.svg">
              <p>Humidity</p>
            </div>
            <p class="valuesText">${forecastDays[dayData].main.humidity}%</p>
          `
        }
      })


      await initChart(data.list, dates);
    });
}

// Function to handle user input for city search
function searchInput(event) {
  // Construct the API URL with the city name from the input field
  const url = `${apiUrl}/forecast?q=${searchBar.value}&units=metric&appid=${key}`;
  if (event.key === "Enter") {
    getData(url);
  }
}