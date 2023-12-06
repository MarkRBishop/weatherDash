function getWeatherData(city) {
    // Use the OpenWeatherMap API to fetch weather data for the given city
    const apiKey = '0342114cc7d6945eec750a7ba15b3f3d';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            currentWeather(data);
            weatherForecast(data);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function currentWeather(data) {
}

function weatherForecast(data) {
}

document.addEventListener("DOMContentLoaded", function () {
    // Event listener for the search button
    document.getElementById("searchButton").addEventListener("click", function () {
        const cityInput = document.getElementById("cityInput").value.trim();
        if (cityInput !== "") {
            // Call a function to fetch and display weather data for the entered city
            getWeatherData(cityInput);
        }
    });

    // Event listener for the predefined city buttons
    document.querySelectorAll(".cityButton").forEach(function (button) {
        button.addEventListener("click", function () {
            const city = this.getAttribute("data-city");
            // Call a function to fetch and display weather data for the predefined city
            getWeatherData(city);
        });
    });
});