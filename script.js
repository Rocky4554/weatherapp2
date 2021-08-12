const timeele = document.getElementById("idtime");
const dateele = document.getElementById("date");

const currentweatherele = document.getElementById("current_weather_item");
const timezome = document.getElementById("timezone");
const countryele = document.getElementById("country");
const weatherforecastele = document.getElementById("weatherforecast");
const currentTEmp = document.getElementById("current_temp");
// const meridian=document.getElementById("am-pm");

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const monthss = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Apikey = '37dfdf0999099d660ec8bf282e8936f0';

setInterval(() => {
    const time = new Date();
    const months = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursformat = hour >= 13 ? hour % 12 : hour;
    const minute = time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    //  meridian.textContent= ampm;
    //    var temp= document.querySelectorAll('#idtime span#am-pm')[0].innerHTML=ampm;//important

    timeele.innerHTML = hoursformat + ':' + (minute<10?'0'+minute:minute) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateele.innerHTML = days[day] + ',' + date + ' ' + monthss[months];



}, 1000);

weatherdata()

function weatherdata() {
    navigator.geolocation.getCurrentPosition((success) => {

        let { latitude, longitude } = success.coords;//object destructuring.
        //give us the latitudes and longitudes values.

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${Apikey}`).then(res => res.json()).then(data => {
            console.log(data);

            showweatherdata(data);
        })
    })
}

function showweatherdata(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

    timezome.innerHTML=data.timezone;
    countryele.innerHTML=data.lat + ' N '+ data.lon + ' E ';

    currentweatherele.innerHTML =
        `<div class="weatheritem">
 <div>Humidity</div>
 <div>${humidity}</div>
</div>
<div class="weatheritem">
 <div>Pressure</div>
 <div>${pressure}</div>
</div>
<div class="weatheritem">
 <div>Wind Speed</div>
 <div>${wind_speed}</div>
</div>
<div class="weatheritem">
 <div>Sunrise</div>
 <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
</div>
<div class="weatheritem">
 <div>Sunset</div>
 <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
</div>

`


    let otherDayForcast = '';
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTEmp.innerHTML = `
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="wicon">
        <div class="others">
            <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
            <div class="temp">Night - ${day.temp.night}&#176; C </div>
            <div class="temp">Day - ${day.temp.day}&#176; C </div>
        </div>
        `

        } else {
            otherDayForcast += `
        <div class="weatherforecast_item">
        <div class="day">${window.moment(day.dt * 1000).format('ddd')}</div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="wicon">
        <div class="temp">Night - ${day.temp.night}&#176; C </div>
        <div class="temp">Day - ${day.temp.day}&#176; C </div>
    </div>
         `
        }
    })
    weatherforecastele.innerHTML = otherDayForcast;
}

