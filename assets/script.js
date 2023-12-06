// Helper function to format the date
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
}

// Function to create city buttons from local storage
function createCityButtons() {
    //retrieve cities from the local storage or initialize an empty array
    const cities = JSON.parse(localStorage.getItem("cities")) || [];
    //Selects the container to display buttons
    const buttonsContainer = document.querySelector(".buttons-container");
    //clears any existing buttons
    buttonsContainer.innerHTML = "";

    // Displays the last 8 cities in reverse order as the buttons
    cities.slice(-8).reverse().forEach(city => {
        const button = document.createElement("button");
        //sets button class name and attributes and sets the text for the button
        button.className = "btn btn-secondary btn-block mb-2 cityButton";
        button.setAttribute("data-city", city);
        button.textContent = city;
        //adds the button to the container
        buttonsContainer.appendChild(button);
    });
}

// Function to save a city to local storage
function saveCity(city) {
    //retrieve cities from the local storage or initialize an empty array
    const cities = JSON.parse(localStorage.getItem("cities")) || [];
    //if there are already 8 cities, it removes the oldest one to ensure that if the city is searched again, it will show up as a button when added to the array, instead of persisting in the array.
    if (cities.length === 8) {
        const removedCity = cities.shift();
        const removedButton = document.querySelector('[data-city ="${removedCity}"]')
        if (removedButton) {
            removedButton.remove()
        }
    }

    // If the city isn't on the list, it's added and updates the buttons
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        createCityButtons();
    }
}

// Function to fetch and display weather data for a city
function getWeatherData(city) {
    //api key for OpenWeatherMap
    const apiKey = '0342114cc7d6945eec750a7ba15b3f3d';
    //API Url for weather data, specifying the way the content will be expressed (imperial units)
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    //Fetch the weather data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            //clear existing weather and forecast info
            document.getElementById("currentWeather").innerHTML = "";
            document.getElementById("forecast").innerHTML = "";
            //display current weather and forecast
            currentWeather(data);
            weatherForecast(data);
        })
        //error handling
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

// Function to display current weather information
function currentWeather(data) {
    //extract current weather data from response
    const currentWeatherData = data.list[0];
    //select the element to display the weather info
    const cityNameElement = document.getElementById("currentWeather");

    //Display city name and current date
    cityNameElement.innerHTML = `<h2>${data.city.name} - ${formatDate(currentWeatherData.dt)}</h2>`;

    //create and display weather Icons
    const weatherIconElement = document.createElement("img");
    weatherIconElement.src = `https://openweathermap.org/img/wn/${currentWeatherData.weather[0].icon}.png`;
    weatherIconElement.alt = currentWeatherData.weather[0].description;
    cityNameElement.appendChild(weatherIconElement);

    //displays the temp, humidity, and wind speed
    cityNameElement.innerHTML += `<p>Temperature: ${currentWeatherData.main.temp} &#8457;</p>`;
    cityNameElement.innerHTML += `<p>Humidity: ${currentWeatherData.main.humidity}%</p>`;
    cityNameElement.innerHTML += `<p>Wind Speed: ${currentWeatherData.wind.speed} mph</p>`;

    // Save the searched city to local storage
    saveCity(data.city.name);
}

// Function to display 5-day forecast
function weatherForecast(data) {
    //extract forecast list
    const forecastList = data.list;
    //selects the element to display the forecast
    const forecastElement = document.getElementById("forecast");
    //clear any existing information displayed
    forecastElement.innerHTML = "";

    //display the tile for the 5-day Forecast
    const forecastTitleContainer = document.getElementById("forecastTitle")
    forecastTitleContainer.innerHTML = `<h3 class="forecast-title">5-Day Forecast:</h3>`

    //creates a container for the forecast days
    const forecastContainer = document.createElement("div");
    forecastContainer.classList.add("forecast-container");

    //display each forecast day in the container
    for (let i = 1; i < forecastList.length; i += 8) {
        const forecastData = forecastList[i];
        const dayContainer = document.createElement("div");
        dayContainer.classList.add("forecast-day");

        //displays the forecast date in the container
        dayContainer.innerHTML += `<p>${formatDate(forecastData.dt)}</p>`;

        // dispalys the weather icon based on the forecast
        const weatherIconElement = document.createElement("img");
        weatherIconElement.src = `https://openweathermap.org/img/wn/${forecastData.weather[0].icon}.png`;
        weatherIconElement.alt = forecastData.weather[0].description;
        dayContainer.appendChild(weatherIconElement);

        //displays each of the forecast days temp, humidity, and wind
        dayContainer.innerHTML += `<p>Temp: ${forecastData.main.temp} &#8457;</p>`;
        dayContainer.innerHTML += `<p>Humidity: ${forecastData.main.humidity}%</p>`;
        dayContainer.innerHTML += `<p>Wind: ${forecastData.wind.speed} mph</p>`;

        //Appends the containers to the forecast container
        forecastContainer.appendChild(dayContainer);

    }
    forecastElement.appendChild(forecastContainer);
}

document.addEventListener("DOMContentLoaded", function () {
    // Event listener for the search button when its clicked and then deletes the input value to be used again
    document.getElementById("searchButton").addEventListener("click", function () {
        const cityInput = document.getElementById("cityInput").value.trim();
        if (cityInput !== "") {
            getWeatherData(cityInput);
            document.getElementById("cityInput").value = ""
        }
    });

     // Event listener for Enter key press in the input box and then deletes the input value to be used again
     document.getElementById("cityInput").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            const cityInput = document.getElementById("cityInput").value.trim();
            if (cityInput !== "") {
                getWeatherData(cityInput);
                document.getElementById("cityInput").value = ""
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