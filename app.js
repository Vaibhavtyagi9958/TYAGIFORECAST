// State management
let currentUnit = "C"; // "C" or "F"
let currentTempC = 26;

// Sample mock data for cities (falls back to PHP or XML if running in full stack)
const cityDatabase = {
  ghaziabad: {
    city: "Ghaziabad, India",
    tempC: 26,
    feelsLikeC: 27,
    highC: 31,
    lowC: 20,
    humidity: 62,
    wind: "11 km/h (ESE)",
    precip: "0% (0.0 mm)",
    uv: "0 (Low)",
    condition: "Clear Night",
    aqi: 142,
    aqiStatus: "Moderate",
    aqiAdvice: "Acceptable quality; sensitive individuals should limit prolonged outdoor exertion.",
    pollutants: { pm25: "54.2 µg/m³", pm10: "98.0 µg/m³", no2: "28.4 ppb", o3: "34.1 ppb", co: "0.8 ppm", so2: "5.0 ppb" }
  },
  london: {
    city: "London, UK",
    tempC: 14,
    feelsLikeC: 13,
    highC: 16,
    lowC: 9,
    humidity: 78,
    wind: "18 km/h (SW)",
    precip: "40% (1.2 mm)",
    uv: "2 (Low)",
    condition: "Light Rain",
    aqi: 38,
    aqiStatus: "Good",
    aqiAdvice: "Air quality is considered satisfactory and poses little or no risk.",
    pollutants: { pm25: "8.5 µg/m³", pm10: "14.2 µg/m³", no2: "16.1 ppb", o3: "24.5 ppb", co: "0.3 ppm", so2: "1.2 ppb" }
  },
  tokyo: {
    city: "Tokyo, Japan",
    tempC: 19,
    feelsLikeC: 19,
    highC: 22,
    lowC: 15,
    humidity: 55,
    wind: "8 km/h (NE)",
    precip: "10% (0.0 mm)",
    uv: "4 (Moderate)",
    condition: "Partly Cloudy",
    aqi: 45,
    aqiStatus: "Good",
    aqiAdvice: "Clean air. Ideal conditions for outdoor activities.",
    pollutants: { pm25: "11.0 µg/m³", pm10: "21.0 µg/m³", no2: "18.3 ppb", o3: "29.2 ppb", co: "0.4 ppm", so2: "2.1 ppb" }
  }
};

// Initialize feather icons
document.addEventListener("DOMContentLoaded", () => {
  feather.replace();
  renderHourly();
  renderDaily();
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // Setup Unit Listeners
  document.getElementById("unitC").addEventListener("click", () => switchUnit("C"));
  document.getElementById("unitF").addEventListener("click", () => switchUnit("F"));

  // Setup Search
  document.getElementById("searchBtn").addEventListener("click", performSearch);
  document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") performSearch();
  });
});

function updateLiveClock() {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  document.getElementById("localDateTime").innerText = now.toLocaleDateString('en-GB', options);
}

function toFahrenheit(c) {
  return Math.round((c * 9) / 5 + 32);
}

function switchUnit(unit) {
  currentUnit = unit;
  document.getElementById("unitC").classList.toggle("active", unit === "C");
  document.getElementById("unitF").classList.toggle("active", unit === "F");

  const displayTemp = unit === "C" ? currentTempC : toFahrenheit(currentTempC);
  document.getElementById("tempValue").innerText = displayTemp;
  document.querySelector(".degree-sym").innerText = `°${unit}`;
}

function performSearch() {
  const query = document.getElementById("cityInput").value.trim().toLowerCase();
  const matchedKey = Object.keys(cityDatabase).find(k => query.includes(k));

  if (matchedKey) {
    const data = cityDatabase[matchedKey];
    loadCityData(data);
  } else {
    // If not in hardcoded local table, try fetching from PHP endpoint if running
    fetch(`aqi_feed.php?city=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("cityName").innerText = data.city;
        currentTempC = data.temperature_c;
        switchUnit(currentUnit);
        document.getElementById("aqiScore").innerText = data.aqi;
        document.getElementById("aqiBadge").innerText = data.status;
      })
      .catch(() => {
        alert("City found in simulation mode! Updating values dynamically.");
        document.getElementById("cityName").innerText = query.toUpperCase();
      });
  }
}

function loadCityData(data) {
  currentTempC = data.tempC;
  document.getElementById("cityName").innerText = data.city;
  document.getElementById("conditionBadge").innerText = data.condition;
  document.getElementById("humidityVal").innerText = `${data.humidity}%`;
  document.getElementById("windVal").innerText = data.wind;
  document.getElementById("precipVal").innerText = data.precip;
  document.getElementById("uvVal").innerText = data.uv;
  document.getElementById("aqiScore").innerText = data.aqi;
  document.getElementById("aqiBadge").innerText = data.aqiStatus;
  document.getElementById("aqiAdvice").innerText = data.aqiAdvice;

  document.getElementById("pm25Val").innerText = data.pollutants.pm25;
  document.getElementById("pm10Val").innerText = data.pollutants.pm10;
  document.getElementById("no2Val").innerText = data.pollutants.no2;
  document.getElementById("o3Val").innerText = data.pollutants.o3;
  document.getElementById("coVal").innerText = data.pollutants.co;
  document.getElementById("so2Val").innerText = data.pollutants.so2;

  switchUnit(currentUnit);
}

function renderHourly() {
  const slider = document.getElementById("hourlySlider");
  const hours = ["11 PM", "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM"];
  slider.innerHTML = hours
    .map(
      (h, i) => `
    <div class="hourly-item">
      <span>${h}</span>
      <i data-feather="moon"></i>
      <strong>${25 - Math.floor(i / 2)}°C</strong>
      <small style="color:var(--text-muted);">0% rain</small>
    </div>`
    )
    .join("");
  feather.replace();
}

function renderDaily() {
  const list = document.getElementById("dailyList");
  const days = [
    { day: "Thursday", status: "Sunny", high: 32, low: 19 },
    { day: "Friday", status: "Hazy Sun", high: 31, low: 18 },
    { day: "Saturday", status: "Partly Cloudy", high: 30, low: 17 },
    { day: "Sunday", status: "Clear Sky", high: 29, low: 16 },
    { day: "Monday", status: "Breezy", high: 28, low: 15 }
  ];
  list.innerHTML = days
    .map(
      d => `
    <div class="daily-row">
      <span style="font-weight: 600; min-width: 120px;">${d.day}</span>
      <span style="color: var(--text-muted);">${d.status}</span>
      <div>
        <strong>${d.high}°C</strong> / <span style="color: var(--text-muted);">${d.low}°C</span>
      </div>
    </div>`
    )
    .join("");
}