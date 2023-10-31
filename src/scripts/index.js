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

function filterForecast(forecastArray) {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  console.log("tomorrow", tomorrow)
  const filteredForecast = forecastArray.filter((element) => {
    const elementDate = new Date(element.dt * 1000);
    return elementDate >= today && elementDate < tomorrow;
  });
  return filteredForecast;
}

async function initChart(forecastArray) {
  const filteredForecast = filterForecast(forecastArray);

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

  new Chart(document.getElementById("chart"), {
    type: "line",
    data,
    options: {
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
          },
        },
        y: {
          display: true,
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
      // console.log(data);

      // Check if the city was not found
      if (data.cod == 404) {
        alert("City not found");
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
                    <div id="forecastDays" class="forecast5days"></div>
                </div>
            `;

      // Display weather details for each day
      forecastDays.innerHTML = `
                <div>
                    <h1 style="font-size: 20px; margin-top: 10px;">${
                      days[dates.getDay()]
                    }</h1>
                    <div style="margin-top: 30px; margin-left: -70px;">
                        <h1 style="font-size: 15px;">Air conditions</h1>
                        <div style="display: flex; margin-top: 20px;">
                            <img src="./src/assets/temp.svg">
                            <p>Real Feel</p>
                        </div>
                        <p style="margin-left: 30px;">${parseInt(
                          data.list[0].main.feels_like
                        )}°C</p>
                        <div style="margin-top: 20px; display: flex;">
                            <img src="./src/assets/air.svg">
                            <p>Wind</p>
                        </div>
                        <p style="margin-left: 30px;">${
                          data.list[0].wind.speed
                        } km/h</p>
                        <div style="margin-top: 10px; display: flex;">
                            <img src="./src/assets/humidity.svg">
                            <p>Humidity</p>
                        </div>
                        <p style="margin-left: 30px;">${
                          data.list[0].main.humidity
                        }%</p>
                    </div>
                </div>
            `;

      await initChart(data.list);
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
