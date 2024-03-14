//get page elements
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const weatherInfo = document.getElementById('weather-info');
const currentForcast = document.getElementById('current-forcast');
const threeDayForcast = document.getElementById('three-day-forcast');
const tempBtn = document.getElementById('tempBtn');
const tempToggle = document.querySelectorAll('.ToggleTemp');

// searchInput.value = '';
// weatherInfo.innerHTML = '<p>Please enter a location.</p>';

// load function for default city
getWeatherData();

//event listener for search
searchButton.addEventListener('click', () => {
    //get search input and remove whitespace on ends
    const location = searchInput.value.trim();
    console.log(location)
    if (location) {
        getWeatherData(location);
    } else {
        weatherInfo.innerHTML = '<p>Please enter a location.</p>';
        currentForcast.innerHTML = '';
    }
});

//set default value for temperature
let tempUnit = 'f';

//event listener for toggle c/f
tempBtn.addEventListener('click', toggleTemperature);
function toggleTemperature() {
    tempToggle.forEach(toggle => {
        toggle.classList.toggle('active');
    });
    let activeTempUnit;
    tempToggle.forEach(toggle => {
        if (toggle.classList.contains('active')) {
            activeTempUnit = toggle.getAttribute('value');
            tempUnit = activeTempUnit;
            console.log(tempUnit[0]); 
            //call function to toggle temp
            const location = searchInput.value.trim();
            if(location) {getWeatherData(location);
            } else {
                weatherInfo.innerHTML = '<p>Please enter a location.</p>';
                currentForcast.innerHTML = '';
            }
        }
    });
}
console.log(tempUnit); 

function getWeatherData(location='new york') {
    // const locationInput = document.getElementById('searchInput').value.trim();
    //api key
    const apiKey = 'd9e8ad87d5d642e4a0d13230241403';
    //current weather
    const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${(location)}`;
    console.log(currentUrl);

    //address must replace 'current' with 'forecast' and concat for 3 day forcast
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${(location)}&days=3`;
    console.log(forecastUrl);

    fetch(currentUrl)
        .then(response => response.json())
        .then(currentData => {
            //get weather condtions and assign to variables
            const currentWeather = currentData.current;
            const location = currentData.location.name;
            if(tempUnit === 'f') {
                temperature = currentWeather.temp_f+"°F";
                fealsLike = currentWeather.feelslike_f+"°F";
            } else {
                temperature = currentWeather.temp_c+"°C";
                fealsLike = currentWeather.feelslike_c+"°C";
            }
            console.log(temperature)
            const condition = currentWeather.condition.text;
            const weatherImg = `<img src=${currentWeather.condition.icon}>`;
            const humidity = currentWeather.humidity;
            //clear inneHTML before getting current weather
            currentForcast.innerHTML = '';
            const today = document.createElement('div'); //create new div for each period
            today.classList.add('day-forecast');
            weatherInfo.innerHTML = `
                        <h2>Current conditions in <br>${location}:</h2>
                        <div class=bigTemp>${temperature}${weatherImg}</div>
                        <p>Feals Like: ${fealsLike}</p>
                        <p>Skys: ${condition}</p>
                        <p>Humidity: ${humidity}%</p>
                    `;
            // currentForcast.appendChild(today); //append to weatherinfo div
            fetch(forecastUrl)
                .then(response => response.json())
                .then(forecastData => {
                    const forecast = forecastData.forecast.forecastday;
                    //clear innerHTML before looping through forcast
                    threeDayForcast.innerHTML = '';
                    const h3 = document.createElement('h3'); //create new div for each period
                    h3.innerHTML = '3 Day Forcast:'
                    currentForcast.appendChild(h3); 
                    forecast.forEach(day => {
                        const date = new Date(day.date);
                        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                        //check if tempUnit is 'f' or 'c'
                        if(tempUnit === 'f') {
                            maxTemp = day.day.maxtemp_f+"°F";
                            minTemp = day.day.mintemp_f+"°F";
                        } else {
                            maxTemp = day.day.maxtemp_c+"°C";
                            minTemp = day.day.mintemp_c+"°C";
                        };
                        const dayImg = `<div class=dayImg><img src=${day.day.condition.icon}></div>`
                        const condition = day.day.condition.text;
                        const dayForecast = document.createElement('div'); //create new div for each period
                        dayForecast.classList.add('day-forecast');
                        //weather info and dayImg go in speparate dives in order to justify-content space-between
                        dayForecast.innerHTML = `
                            <div><h4>${dayOfWeek}</h4> 
                            <p>Max: ${maxTemp} Min: ${minTemp}</p>
                            <p>Condition: ${condition}</p>
                            </div>${dayImg}
                        `;
                        currentForcast.appendChild(dayForecast); //append to weatherinfo div

                    });
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                    currentForcast.innerHTML = '<p>Failed to fetch forecast data. Please try again later.</p>';
                });
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            weatherInfo.innerHTML = '<p>Failed to fetch current weather data. Please try again later.</p>';
            currentForcast.innerHTML = '';
        });
}