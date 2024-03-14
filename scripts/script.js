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
            tempUnit = toggle.getAttribute('value');
            // tempUnit = activeTempUnit;
            console.log(tempUnit); 
            //call function to toggle temp
            const location = searchInput.value.trim();
            if(location) {
                getWeatherData(location);
            } else {
                //getWeatherData('new york'); //testing for default location

                //if no location on page load, promt user for input
                weatherInfo.innerHTML = '<p>Please enter a location.</p>';
                currentForcast.innerHTML = '';
            }
        }
    });
}
console.log(tempUnit); 

function getWeatherData(location='new york') {
    //current weather
    const currentUrl = `https://api.weatherapi.com/v1/current.json?key=d9e8ad87d5d642e4a0d13230241403&q=${(location)}`;
    console.log(currentUrl);

    //address must replace 'current' with 'forecast' and concat for 3 day forcast
    const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=d9e8ad87d5d642e4a0d13230241403&q=${(location)}&days=3`;
    console.log(forecastUrl);
    //fetch url
    fetch(currentUrl , {method: "GET"})
        //return promise
        .then(response => response.json()) //parse usable obj
        .then(currentData => {
            //get weather condtions and assign to variables
            const currentWeather = currentData.current;
            const location = currentData.location.name+',';
            let region = currentData.location.region;
            let country = currentData.location.country;
            //if in US do not list country
            if (country === "United States of America") {
                country = '';
            } else { //if outside US list country, but not region/state
                region = '';
            }
            const condition = currentWeather.condition.text;
            const weatherImg = `<img src=${currentWeather.condition.icon}>`;
            const humidity = currentWeather.humidity;
            //check if tempUnit is 'f' or 'c'
            if(tempUnit === 'f') {
                temperature = currentWeather.temp_f+"°F";
                fealsLike = currentWeather.feelslike_f+"°F";
            } else {
                temperature = currentWeather.temp_c+"°C";
                fealsLike = currentWeather.feelslike_c+"°C";
            }
            console.log('fetchTempUnits:', temperature)
            //clear inneHTML before getting current weather
            currentForcast.innerHTML = '';
            const today = document.createElement('div'); //create new div for each period
            today.classList.add('day-forecast');
            weatherInfo.innerHTML = `
                        <h2>Current conditions in:</h2>
                        <div>${location} ${region}${country}:<div>
                        <div class=bigTemp>${temperature}${weatherImg}</div>
                        <p>Feals Like: ${fealsLike}</p>
                        <p>Skys: ${condition}</p>
                        <p>Humidity: ${humidity}%</p>
                    `;
            // currentForcast.appendChild(today); //append to weatherinfo div
            fetch(forecastUrl , {method: "GET"})
                .then(response => response.json())
                .then(forecastData => {
                    //clear innerHTML before looping through forcast
                    threeDayForcast.innerHTML = '';
                    //get day
                    const forecast = forecastData.forecast.forecastday;
                    const h3 = document.createElement('h3'); //create new div for each period
                    h3.innerHTML = '3 Day Forcast:'
                    currentForcast.appendChild(h3); 
                    forecast.forEach(day => {
                        const date = new Date(day.date);
                        console.log('rawDate:', date)
                        //set parameters for toLocaleDateString 
                        const dateParams = {
                            weekday: 'long', 
                            timeZone: 'UTC' };
                        //return the date only using toLocaleDateString method
                        const dayOfWeek = date.toLocaleDateString('en-US', dateParams);
                        console.log('toLocaleDateString:', dayOfWeek)
                        const dayImg = `<div class=dayImg><img src=${day.day.condition.icon}></div>`
                        const condition = day.day.condition.text;
                        //check if tempUnit is 'f' or 'c'
                        if(tempUnit === 'f') {
                            maxTemp = day.day.maxtemp_f+"°F";
                            minTemp = day.day.mintemp_f+"°F";
                        } else {
                            maxTemp = day.day.maxtemp_c+"°C";
                            minTemp = day.day.mintemp_c+"°C";
                        };
                        //create new div for each period
                        const dayForecast = document.createElement('div'); 
                        dayForecast.classList.add('day-forecast');
                        //weather info and dayImg go in speparate dives in order to justify-content space-between
                        dayForecast.innerHTML = `
                            <div><h4>${dayOfWeek}</h4> 
                            <p>High: ${maxTemp} Low: ${minTemp}</p>
                            <p>Condition: ${condition}</p>
                            </div>${dayImg}
                        `;
                        //append to weatherinfo div
                        currentForcast.appendChild(dayForecast); 
                    });
                //error handling if 3 day forcast is unavailable 
                }).catch(() => {
                    weatherInfo.innerHTML = '<p>Three day forcast unavailable at this time.</p>';
                    currentForcast.innerHTML = ''; //clear forcast div
                });
        //error handling if input is wrong, or unable to reach servers
        }).catch(() => {
            weatherInfo.innerHTML = '<p>Failed to get weather data for location.</p>';
            currentForcast.innerHTML = ''; //clear forcast div
    });
}