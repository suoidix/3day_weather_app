# 3day_weather_app

## weatherapi.com API
https://www.weatherapi.com

# JavaScript Project
To preview file download as zip. 
Or click here: https://suoidix.github.io/3day_weather_app/

### API key is trial version
### Input buttons and weather display: 
- **Search input**: will search for city, or best match and return location and weather
- **°C/°F Button**: will toggle between degrees C and degrees F
- **Current weather**: will display current weather conditions, to most recent hour
- **3 Day forcast**: will display 3 day forcast: high/low tems, conditions, and condition icon.
This design deciscion was chosen in favor of a 5 or 7 day forcast, as API only displays up to
3 days after trial period ends.

**API endpoints used**
- Search box and tempToggle request weather data by **name** from **realtime data**:  
**https://www.weatherapi.com/docs/#apis-realtime**  
- 3 day forcast will retrieve data by **forcastday** from **forcast data**:  
**(https://www.weatherapi.com/docs/#apis-forecast)**  

- **script.js** file uses **fetch()** to make the current weather request
- nested **fetch()** to make the 3 day forcast request

**API returns an object w key: "currentData"**
Arry of objects contained in currentData:
- **current** - current weather conditions:
                -**humidity**
                -**icon**
                -**temp_f**
                -**temp_c**
                -**feelslike_f**
                -**feelslike_c**

**API returns an object w key: "forecastData"**
Arry of objects contained in forecastData:
- **forecast** - forcast weather conditions:
                -**forecastday**

Iterate through **forcast** for each **day**
                -**date** - defaults to server local time
                Day.condition:
                    -**day.condition.text** - condition text
                    -**day.condition.icon** - icon data
                    -**day.condition.maxtemp_f** - temp high in f
                    -**day.condition.mintemp_f** - temp lows in f
                    -**day.condition.maxtemp_c** - temp high in c
                    -**day.condition.mintemp_c** - temp lows in c