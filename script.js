async function fetchWeather() {
    let searchInput = document.getElementById('search').value.trim();
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";

    const apiKey = "0cc13f6a7d2856f89dea2cf305f43491";

    if (searchInput === "") {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Empty Input!</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return;
    }

    async function getLonAndLat() {
      const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
      
      try {
        const response = await fetch(geocodeURL);
        if (!response.ok) {
          throw new Error("Failed to fetch coordinates");
        }

        const data = await response.json();
        console.log("Geocode API Response:", data);  // Debugging output

        if (data.length === 0) {
          weatherDataSection.innerHTML = `
            <div>
              <h2>No Results for "${searchInput}"</h2>
              <p>Could not find the specified city. Please try again with a valid <u>city name</u>.</p>
            </div>
          `;
          return null;
        }
        return data[0];
      } catch (error) {
        console.log(error.message);
        weatherDataSection.innerHTML = `
          <div>
            <h2>Error!</h2>
            <p>Something went wrong. Please try again later.</p>
          </div>
        `;
        return null;
      }
    }

    async function getWeatherData(lon, lat) {
      const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      
      try {
        const response = await fetch(weatherURL);
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = await response.json();
        console.log("Weather API Response:", data);  // Debugging output

        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
          <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
          </div>
        `;
      } catch (error) {
        console.log(error.message);
        weatherDataSection.innerHTML = `
          <div>
            <h2>Error!</h2>
            <p>Failed to retrieve weather information. Please try again later.</p>
          </div>
        `;
      }
    }

    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();
    if (geocodeData) {
      await getWeatherData(geocodeData.lon, geocodeData.lat);
    }
}
