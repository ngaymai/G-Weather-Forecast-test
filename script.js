const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const API_KEY = "http://api.weatherapi.com/v1/forecast.json?key=707399a17b5b41fbbb120652242407&q=London&days=4&aqi=no&alerts=no";
const createWeatherCard = (cityName, weatherItem, index) => {
    console.log('hello', index);
    if(index === 0) { // HTML for the main weather card
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.last_updated.split(" ")[0]})</h2>
                    <h6>Temperature: ${(weatherItem.temp_c).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.wind_mph} M/S</h6>
                    <h6>Humidity: ${weatherItem.humidity}%</h6>
                </div>
                <div class="icon">
                    <img src="${weatherItem.condition.icon}" alt="weather-icon">
                    <h6>${weatherItem.condition.text}</h6>
                </div>`;
    } else { // HTML for the other five day forecast card
        return `<li class="card">
                    <h3>(${weatherItem.date})</h3>
                    <img src="${weatherItem.day.condition.icon}" alt="weather-icon">
                    <h6>Temp: ${(weatherItem.day.avgtemp_c).toFixed(2)}°C</h6>
                    <h6>Wind: ${weatherItem.day.maxwind_mph} M/S</h6>
                    <h6>Humidity: ${weatherItem.day.avghumidity}%</h6>
                </li>`;
    }
    
}

const getWeatherDetails = (cityName, latitude, longitude) => {
    //const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
    const WEATHER_API_URL = `http://api.weatherapi.com/v1/forecast.json?key=707399a17b5b41fbbb120652242407&q=${cityName}&days=4&aqi=no&alerts=no`;
    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
               
        fiveDaysForecast = data.forecast.forecastday;
        console.log(fiveDaysForecast)        
        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        const html1 = createWeatherCard(cityName, data.current, 0);
        currentWeatherDiv.insertAdjacentHTML("beforeend", html1);
        // Creating weather cards and adding them to the DOM
        fiveDaysForecast.forEach((weatherItem, index) => {
            console.log(weatherItem);
            const html2 = createWeatherCard(cityName, weatherItem, 1);
            weatherCardsDiv.insertAdjacentHTML("beforeend", html2);
           
        });        
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;   
    
    const API_URL = `http://api.weatherapi.com/v1/current.json?key=707399a17b5b41fbbb120652242407&q=${cityName}&aqi=no`;
    console.log(API_URL);
    // Get entered city coordinates (latitude, longitude, and name) from the API response
    fetch(API_URL).then(response => response.json()).then(data => 
        {   
        if (!Object.keys(data).length) return alert(`No coordinates found for ${cityName}`);
        
        const { lat, lon, name } = data.location;
        getWeatherDetails(name, lat, lon);
        
        }
    ).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords; // Get coordinates of user location
            // Get city name from coordinates using reverse geocoding API
            const API_URL = `http://api.weatherapi.com/v1/current.json?key=707399a17b5b41fbbb120652242407&q=${latitude},${longitude}&aqi=no`;
            fetch(API_URL).then(response => response.json()).then(data => {
                console.log(data);
                const { name } = data.location;
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the city name!");
            });
        },
        error => { // Show alert if user denied the location permission
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());