// Configuration
const config = {
    apiKey: '5869e7d1ceb6ed673cad2f7e0c7cc511' // Replace with your API key
};

// DOM Elements
const clockFace = document.querySelector('.clock-face');
const hoursElement = document.querySelector('.hours');
const minutesElement = document.querySelector('.mins');
const hoursHand = document.querySelector('.hours.counter');
const minutesHand = document.querySelector('.minutes.counter');
const cityElement = document.querySelector('.city');
const conditionElement = document.querySelector('.cond');
const temperatureElement = document.querySelector('.temp-value');

// Update clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Update digital clock
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    
    // Update analog clock
    const hoursRotation = (360 / 12) * hours;
    const minutesRotation = (360 / 60) * minutes;
    
    hoursHand.style.transform = `rotate(${hoursRotation}deg)`;
    minutesHand.style.transform = `rotate(${minutesRotation}deg)`;
}

// Get location from IP
async function getLocationFromIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        return {
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city
        };
    } catch (error) {
        console.error('Error getting location from IP:', error);
        return null;
    }
}

// Get weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.apiKey}&units=metric`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Update weather display
function updateWeatherDisplay(data) {
    if (!data) return;
    
    cityElement.textContent = data.name;
    conditionElement.textContent = data.weather[0].description;
    temperatureElement.textContent = Math.round(data.main.temp);
    
    // Update weather icon
    updateWeatherIcon(data.weather[0].icon);
}

// Update weather icon
function updateWeatherIcon(iconCode) {
    const iconContainer = document.querySelector('.weather-icon');
    if (!iconContainer) return;
    
    // Clear existing icon
    iconContainer.innerHTML = '';
    
    // Create new icon based on weather condition
    const icon = document.createElement('div');
    icon.className = getIconClass(iconCode);
    
    // Add specific elements based on weather type
    switch(iconCode) {
        case '01n':
            icon.innerHTML = `
                <span class="moon"></span>
                <span class="spot1"></span>
                <span class="spot2"></span>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            `;
            break;
        case '01d':
            icon.innerHTML = `
                <span class="sun icon"></span>
                <span class="sunx icon"></span>
            `;
            break;
        case '50d':
        case '50n':
        case '02d':
        case '02n':
        case '03d':
        case '03n':
        case '04d':
        case '04n':
            icon.innerHTML = `
                <span class="cloud"></span>
                <span class="cloudx"></span>
            `;
            break;
        case '13d':
        case '13n':
            icon.innerHTML = `
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <span class="snowe"></span>
                <span class="snowex"></span>
                <span class="stick"></span>
                <span class="stick2"></span>
            `;
            break;
        case '11d':
        case '11n':
        case '10d':
        case '10n':
        case '09d':
        case '09n':
            icon.innerHTML = `
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <span class="cloudr"></span>
            `;
            break;
    }
    
    iconContainer.appendChild(icon);
}

// Get icon class based on weather code
function getIconClass(iconCode) {
    const iconMap = {
        '01d': 'hot icon',
        '01n': 'night icon',
        '02d': 'cloudy icon',
        '02n': 'cloudy icon',
        '03d': 'cloudy icon',
        '03n': 'cloudy icon',
        '04d': 'cloudy icon',
        '04n': 'cloudy icon',
        '09d': 'breezy icon',
        '09n': 'breezy icon',
        '10d': 'breezy icon',
        '10n': 'breezy icon',
        '11d': 'breezy icon',
        '11n': 'breezy icon',
        '13d': 'stormy icon',
        '13n': 'stormy icon',
        '50d': 'cloudy icon',
        '50n': 'cloudy icon'
    };
    
    return iconMap[iconCode] || 'hot icon';
}

// Initialize application
async function init() {
    // Start clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Get user location from IP
    try {
        const location = await getLocationFromIP();
        
        if (location) {
            const weatherData = await getWeatherData(
                location.city
            );
            updateWeatherDisplay(weatherData);
        } else {
            throw new Error('Could not get location from IP');
        }
    } catch (error) {
        console.error('Error getting location:', error);
        // Fallback to a default location (Tehran)
        const weatherData = await getWeatherData("Tehran");
        updateWeatherDisplay(weatherData);
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', init); 