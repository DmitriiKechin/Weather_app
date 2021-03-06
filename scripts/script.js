import { Weather } from './weather.js';
import {
  dayArrow,
  hoursClick,
  clickCity,
  decoding,
  activeDayReset,
} from './UI.js';
const API_KEY = decoding(
  '3e5a3a5c6631675d3e2c392e665e6a2937316b5c695f392f665a352b37296630'
);

windowStart();

const arrowRigthDay = document.getElementById('weather__day_arrow-rigth');
const arrowLeftDay = document.getElementById('weather__day_arrow-left');
const weatherHours = document.getElementById('weather-hours');
export const weatherAlerts = document.getElementById('weather-alerts');
export const weatherAir = document.getElementById('weather-air');
const daySlider = document.getElementById('day-slider');
const buttonUpdate = document.querySelector('.window__update');
const buttonClose = document.querySelector('.window__close');
const buttonStretch = document.querySelector('.window__stretch');
const minutesWindow = document.getElementById('weather-minutes');
const timeUpdate = document.getElementById('time-update');
export const hoursContent = document.getElementById('hours-content');
const city = document.getElementById('city');

const fakeResize = () => {
  setTimeout(() => {
    window.resizeBy(0, 1);
    window.resizeBy(0, -1);
  }, 330);
};

const upDateDate = function () {
  activeDayReset();
  weather.update(JSON.parse(localStorage.getItem('responseData')));
  daySlider.lastChild.remove();
  daySlider.append(weather.dayContext);
  minutesWindow.innerHTML = weather.minutesContext;
  timeUpdate.textContent = weather.getDateUpdate;
  hoursContent.innerHTML = '';
  hoursContent.append(weather.hoursContext);
  weatherAlerts.innerHTML = weather.getAlerts;
};

const upDateAir = function () {
  weather.updateAir(JSON.parse(localStorage.getItem('responseAir')));
  weatherAir.innerHTML = weather.getAir(0);
};

export const weather = new Weather();
upDate();

async function requestWeather(urlData, urlAir) {
  async function fetchAndDecode(url) {
    let response = await fetch(url);
    let content;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      content = await response.text();
    }

    return content;
  }

  try {
    const responseData = fetchAndDecode(urlData);
    const responseAir = fetchAndDecode(urlAir);

    const values = await Promise.allSettled([responseData, responseAir]);
    localStorage.setItem('responseData', values[0].value);
    localStorage.setItem('responseAir', values[1].value);
  } catch (err) {
    throw new Error(err.massage || '???????????? ??????????????');
  }
}

export function upDate() {
  buttonUpdate.style.animationName = 'rotate';
  let latitude = +localStorage.getItem('latitude');
  let longitude = +localStorage.getItem('longitude');

  if (!latitude) {
    latitude = 43.70011;
  }

  if (!longitude) {
    longitude = -79.4163;
  }

  city.textContent = localStorage.getItem('city');

  if (!city?.firstChild?.data) {
    city.textContent = '??????????????';
  }

  const urlData = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}&lang=ru`;

  const urlAir = `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

  const isJson = (json) => {
    if (!json) {
      return false;
    }

    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  };

  if (
    isJson(localStorage.getItem('responseData')) &&
    isJson(localStorage.getItem('responseAir'))
  ) {
    upDateDate();
    upDateAir();
  }

  requestWeather(urlData, urlAir)
    .then(() => {
      upDateDate();
      upDateAir();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      buttonUpdate.style.animationName = 'null';
      fakeResize();
    });
}

function windowStart() {
  const windowSizes = JSON.parse(localStorage.getItem('windowSizes'));

  if (!windowSizes) {
    window.resizeTo(600, 850);
    window.moveTo(0, 0);
    return;
  }
  window.resizeTo(windowSizes.width, windowSizes.height);
  document.documentElement.style.fontSize =
    0.02588235294117647058823529411765 * windowSizes.height + 'px';
  window.moveTo(windowSizes.x, windowSizes.y);
}

const resizeWindow = (event) => {
  const position = {
    x: event.pageX,
    y: event.pageY,
    height: window.outerHeight,
    width: window.outerWidth,
  };

  const mouseMove = (event) => {
    const diff = event.pageY - position.y;
    window.resizeTo(
      (position.height + diff) * 0.70588235294117647058823529411765,
      position.height + diff
    );
    document.documentElement.style.fontSize =
      0.02588235294117647058823529411765 * (position.height + diff) + 'px';
  };

  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', mouseMove);
  });
};

buttonStretch.addEventListener('mousedown', resizeWindow);

arrowRigthDay.addEventListener('click', (event) => {
  dayArrow('right', event);
});
arrowLeftDay.addEventListener('click', (event) => {
  dayArrow('left', event);
});
weatherHours.addEventListener('click', hoursClick);
buttonUpdate.addEventListener('click', upDate);
city.addEventListener('click', clickCity);

buttonClose.addEventListener('click', () => {
  const windowSizes = {
    x: window.screenX,
    y: window.screenY,
    height: window.outerHeight,
    width: window.outerWidth,
  };
  localStorage.setItem('windowSizes', JSON.stringify(windowSizes));

  setTimeout(() => {
    window.close();
  });
});

window.addEventListener('click', () => {
  fakeResize();
});

window.addEventListener('load', () => {
  fakeResize();
});
