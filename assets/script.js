// Helper function to format the date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
}

// Function to create city buttons from local storage
function createCityButtons() {
    const cities = JSON.parse(localStorage.getItem("cities")) || [];
    const buttonsContainer = document.querySelector(".buttons-container");
    buttonsContainer.innerHTML = "";

    cities.slice(0, 8).forEach(city => {
        const button = document.createElement("button");
        button.className = "btn btn-secondary btn-block mb-2 cityButton";
        button.setAttribute("data-city", city);
        button.textContent = city;
        buttonsContainer.appendChild(button);
    });
}

// Function to save a city to local storage
function saveCity(city) {
    const cities = JSON.parse(localStorage.getItem("cities")) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        createCityButtons();
    }
}

// Function to fetch and display weather data for a city
function getWeatherData(city) {
    const apiKey = '0342114cc7d6945eec750a7ba15b3f3d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById("currentWeather").innerHTML = "";
            document.getElementById("forecast").innerHTML = "";
            currentWeather(data);
            weatherForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Function to display current weather information
function currentWeather(data) {
    const currentWeatherData = data.list[0];
    const cityNameElement = document.getElementById("currentWeather");

    cityNameElement.innerHTML = `<h2>${data.city.name} - ${formatDate(currentWeatherData.dt)}</h2>`;

    const weatherIconElement = document.createElement("img");
    weatherIconElement.src = `https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png`;
    weatherIconElement.alt = currentWeatherData.weather[0].description;
    cityNameElement.appendChild(weatherIconElement);

    cityNameElement.innerHTML += `<p>Temperature: ${currentWeatherData.main.temp} &#8457;</p>`;
    cityNameElement.innerHTML += `<p>Humidity: ${currentWeatherData.main.humidity}%</p>`;
    cityNameElement.innerHTML += `<p>Wind Speed: ${currentWeatherData.wind.speed} mph</p>`;

    // Save the searched city to local storage
    saveCity(data.city.name);
}

// Function to display 5-day forecast
function weatherForecast(data) {
    const forecastList = data.list;
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = "";

    const forecastTitleContainer = document.getElementById("forecastTitle")
    forecastTitleContainer.innerHTML = `<h3 class="forecast-title">5-Day Forecast:</h3>`

    const forecastContainer = document.createElement("div");
    forecastContainer.classList.add("forecast-container");

    for (let i = 1; i < forecastList.length; i += 8) {
        const forecastData = forecastList[i];
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("forecast-day");

        dayContainer.innerHTML += `<p>${formatDate(forecastData.dt)}</p>`;

        const weatherIconElement = document.createElement("img");
        weatherIconElement.src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
        weatherIconElement.alt = forecastData.weather[0].description;
        dayContainer.appendChild(weatherIconElement);

        dayContainer.innerHTML += `<p>Temp: ${forecastData.main.temp} &#8457;</p>`;
        dayContainer.innerHTML += `<p>Humidity: ${forecastData.main.humidity}%</p>`;
        dayContainer.innerHTML += `<p>Wind: ${forecastData.wind.speed} mph</p>`;

        forecastContainer.appendChild(dayContainer);

    }
    forecastElement.appendChild(forecastContainer);
}

document.addEventListener("DOMContentLoaded", function () {
    // Event listener for the search button
    document.getElementById("searchButton").addEventListener("click", function () {
        const cityInput = document.getElementById("cityInput").value.trim();
        if (cityInput !== "") {
            getWeatherData(cityInput);
        }
    });

     // Event listener for Enter key press in the input box
     document.getElementById("cityInput").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            const cityInput = document.getElementById("cityInput").value.trim();
            if (cityInput !== "") {
                getWeatherData(cityInput);
            }
        }
    });

    // Event listener for clicking on the created buttons from previous searches
    document.querySelector(".buttons-container").addEventListener("click", function (event) {
        if (event.target.classList.contains("cityButton")) {
            const city = event.target.getAttribute("data-city");
            getWeatherData(city);
        }
    })

    // Call the function to create city buttons when the page loads
    createCityButtons();
    document.getElementById("cityInput").value = "";
});