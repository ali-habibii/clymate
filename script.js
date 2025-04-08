async function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OWM_API_KEY}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
  
    if (data.cod !== 200) {
      alert("City not found. Please try again.");
      return;
    }
  
    document.getElementById("city").textContent = data.name;
    document.getElementById("temp").textContent = data.main.temp.toFixed(1);
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("condition").textContent = data.weather[0].description;
    document.getElementById("weatherIcon").src =
      `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
  }
  
  async function fetchAQI(city) {
    const url = `https://api.waqi.info/feed/${city}/?token=${AQI_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
  
    if (data.status === "ok") {
      const aqi = data.data.aqi;
      const pm25 = data.data.iaqi.pm25?.v || 0;
  
      document.getElementById("aqiIndex").textContent = aqi;
      document.getElementById("pm25").textContent = pm25;
  
      updateChart(aqi, pm25);
    } else {
      document.getElementById("aqiIndex").textContent = "N/A";
      document.getElementById("pm25").textContent = "N/A";
      updateChart(0, 0);
    }
  }
  
  function searchCity() {
    const city = document.getElementById("cityInput").value;
    if (!city.trim()) return;
    fetchWeather(city);
    fetchAQI(city);
  }
  
  let chart;
  function updateChart(aqi, pm25) {
    const ctx = document.getElementById("aqiChart").getContext("2d");
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['AQI', 'PM2.5'],
        datasets: [{
          label: 'Air Quality',
          data: [aqi, pm25],
          backgroundColor: ['#ff6f61', '#ffa07a'],
          borderRadius: 10
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 300
          }
        }
      }
    });
  }
  
  // Dark mode toggle
  document.getElementById("darkModeToggle").addEventListener("change", function () {
    document.body.classList.toggle("dark");
  });
  
  // Load default city on start
  fetchWeather(CITY);
  fetchAQI(CITY);
  