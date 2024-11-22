document.addEventListener("DOMContentLoaded", () => {
  const getCity = async (city) => {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await res.json();
    return data;
  };

  const getWeather = async (latitude, longitude) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,rain,showers&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
    );
    const data = await res.json();
    return data;
  };

  const createRow = (headerText, ...dataTexts) => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = headerText;
    row.appendChild(th);
    dataTexts.forEach(text => {
      const td = document.createElement("td");
      td.textContent = text;
      row.appendChild(td);
    });
    return row;
  };

  const buildHTML = async (cityInput) => {
    const cityData = await getCity(cityInput);
    const { latitude, longitude } = cityData.results[0];
    console.log(cityData);
    const weatherData = await getWeather(latitude, longitude);
    console.log(weatherData);
    document.getElementById("city-name").textContent = cityData.results[0].name;
    document.getElementById(
      "temperature"
    ).textContent = `${weatherData.current.temperature_2m} °C`;

    const isDay = weatherData.current.is_day;
    const imageDiv = document.getElementById("title");
    imageDiv.style.backgroundImage = isDay ? 'url(./images/day.jpg)' : 'url(./images/night.jpg)';
    imageDiv.style.backgroundSize = 'cover';
    imageDiv.style.backgroundPosition = 'bottom';
    const titleDiv = document.getElementById("title");
    titleDiv.style.color = isDay ? 'black' : 'white'; 
    document.body.style.backgroundColor = isDay ? 'white' : 'black'; 

    const table = document.createElement("table");
    table.setAttribute("id", "weather-table");
    table.appendChild(createRow("Country", `${cityData.results[0].country}`));
    table.appendChild(createRow("Timezone", `${cityData.results[0].timezone}`));
    table.appendChild(createRow("Population", `${cityData.results[0].population}`));
    table.appendChild(createRow("Tomorow's Forecast", `Low: ${weatherData.daily.temperature_2m_min[0]} °C / Max: ${weatherData.daily.temperature_2m_max[0]} °C`));

    const weatherInfo = document.getElementById("details");
    weatherInfo.innerHTML = "";
    weatherInfo.appendChild(table);
  };

  searchBtn.addEventListener("click", () => {
    const cityInput = document.getElementById("city-input").value;
    buildHTML(cityInput);
  });
});
