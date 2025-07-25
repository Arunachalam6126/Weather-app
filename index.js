function getweather() {
    const apikey = '7209695443723fc0494434f89057daf7';
    const city = document.getElementById("city").value;
    if (!city) {
        alert('Please enter the city');
        return;
    }
    const currentweatherurl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;
    const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apikey}`;

    fetch(currentweatherurl)
        .then(response => response.json())
        .then(data => {
            displayweather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            const weatherDivInfo = document.getElementById('weather-info');
            weatherDivInfo.innerHTML = `<p>Error fetching current weather data. Please try again.</p>`;
        });

    fetch(forecasturl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForcast(data.list);
        })
        .catch(error => {
            console.error('Error fetching current forecast data:', error);
            const hourlyForcastDiv = document.getElementById('hourly-forecast');
            hourlyForcastDiv.innerHTML = `<p>Error fetching hourly forecast data. Please try again.</p>`;
        });
}

function displayweather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherDivInfo = document.getElementById('weather-info');
    const hourlyForcastDiv = document.getElementById('hourly-forecast');

    weatherDivInfo.innerHTML = '';
    tempDivInfo.innerHTML = '';
    hourlyForcastDiv.innerHTML = '';

    if (data.cod === '404') {
        weatherDivInfo.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityname = data.name;
        const temperature = convertToCelsius(data.main.temp);
        const description = data.weather[0].description;
        const iconurl = getIconUrl(data.weather[0].icon);

        const temperatureHTML = `<p>${temperature}<sup>o</sup>C</p>`;
        const weatherHTML = `
            <p>${cityname}</p>
            <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherDivInfo.innerHTML = weatherHTML;

        showImage(iconurl, description);
    }
}

function displayHourlyForcast(hourlydata) {
    const hourlyForcastDiv = document.getElementById('hourly-forecast');
    const next24hours = hourlydata.slice(0, 8);

    let hourlyHTML = '';
    next24hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = convertToCelsius(item.main.temp);
        const iconurl = getIconUrl(item.weather[0].icon);

        hourlyHTML += `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconurl}" alt="Hourly Weather Icon">
                <span>${temperature}<sup>o</sup>C</span>
            </div>
        `;
    });

    hourlyForcastDiv.innerHTML = hourlyHTML;
}

function showImage(iconUrl, description) {
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.src = iconUrl;
    weatherIcon.alt = description;
    weatherIcon.style.display = 'block';
}

function convertToCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function getIconUrl(iconCode, size = '4x') {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`;
}