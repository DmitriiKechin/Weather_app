import {
  weather,
  hoursContent,
  weatherAlerts,
  weatherAir,
  upDate,
} from './script.js';
export let activeDay = 0;

function initSlider(slides, slider) {
  const styleSlider = window.getComputedStyle(slider);
  const paddingLeft = parseFloat(styleSlider.getPropertyValue('padding-left'));
  const paddingRight = parseFloat(
    styleSlider.getPropertyValue('padding-right')
  );
  const padding = paddingRight + paddingLeft;
  const sliderWidth =
    parseFloat(styleSlider.getPropertyValue('width')) - padding;

  const styleSlides = window.getComputedStyle(slides);
  const slidesOffsetLeft = parseFloat(styleSlides.getPropertyValue('left'));

  return { slidesOffsetLeft, sliderWidth };
}

export function dayArrowRigth() {
  this.disabled = true;
  const slides = document.getElementById('daysslides');
  const slider = document.getElementById('day-slider');
  const dayTitle = document.getElementById('day-title');
  const { slidesOffsetLeft, sliderWidth } = initSlider(slides, slider);
  if (slidesOffsetLeft > -slides.clientWidth + sliderWidth * 1.5) {
    activeDay++;
    slides.style.left = slidesOffsetLeft - sliderWidth + 'px';
    dayTitle.textContent = weather.dayTitle(activeDay);
  }

  setTimeout(() => (this.disabled = false), 310);
}

export function dayArrowLeft() {
  this.disabled = true;
  const slides = document.getElementById('daysslides');
  const slider = document.getElementById('day-slider');
  const dayTitle = document.getElementById('day-title');
  const { slidesOffsetLeft, sliderWidth } = initSlider(slides, slider);

  if (slidesOffsetLeft < -sliderWidth * 0.5) {
    activeDay--;
    slides.style.left = slidesOffsetLeft + sliderWidth + 'px';
    dayTitle.textContent = weather.dayTitle(activeDay);
  }
  setTimeout(() => (this.disabled = false), 310);
}

export function hoursClick(event) {
  const right = event.target.closest('.arrow-right');
  const left = event.target.closest('.arrow-left');
  const card = event.target.closest('.hours-card');

  if (!right && !left && !card) {
    return;
  }

  event.target.disabled = true;
  let slides = document.getElementById('hours-cards');
  const slider = document.getElementById('hours-content');
  const cancel = document.getElementById('button-hours-cancel');
  const { slidesOffsetLeft, sliderWidth } = initSlider(slides, slider);

  if (right) {
    if (slidesOffsetLeft > -slides.clientWidth + sliderWidth * 1.5) {
      slides.style.left = slidesOffsetLeft - sliderWidth + 'px';

      if (this.dataset.isDetails) {
        weatherAir.innerHTML = weather.getAir(
          Number((-slidesOffsetLeft / sliderWidth).toFixed(0)) + 1
        );
      }
    }
  }

  if (left) {
    if (slidesOffsetLeft < -sliderWidth * 0.5) {
      slides.style.left = slidesOffsetLeft + sliderWidth + 'px';

      if (this.dataset.isDetails) {
        weatherAir.innerHTML = weather.getAir(
          Number((-slidesOffsetLeft / sliderWidth).toFixed(0)) - 1
        );
      }
    }
  }

  if (card) {
    this.dataset.isDetails = true;
    hoursContent.innerHTML = '';
    hoursContent.append(weather.hoursDetalisContext);
    cancel.hidden = false;
    weatherAlerts.hidden = true;
    weatherAir.classList.add('hidden');
    slides = document.getElementById('hours-cards');
    weatherAir.innerHTML = weather.getAir(+card.dataset.index);

    setTimeout(() => {
      slides.style.left = -sliderWidth * card.dataset.index + 'px';
    }, 0);

    cancel.addEventListener('click', function () {
      this.hidden = true;
      this.dataset.isDetails = false;
      weatherAir.classList.remove('hidden');
      weatherAlerts.hidden = false;
      hoursContent.innerHTML = '';
      hoursContent.append(weather.hoursContext);
    });
  }

  setTimeout(() => {
    event.target.disabled = false;
  }, 310);
}

export function clickCity() {
  const dayTitle = document.getElementById('day-title');
  const citySearch = document.getElementById('city-search');
  const cityInput = document.getElementById('city-input');
  let dataHelp;

  const citySearchClick = (event) => {
    const button = event.target.closest('.city-search__button');
    const cardHelp = event.target.closest('.city-search__help');

    if (!button && !cardHelp) {
      return;
    }

    if (button) {
      setTimeout(() => {
        dayTitle.hidden = false;
        this.hidden = false;
        upDate();
      }, 500);

      citySearch.style.height = '1.5rem';
      citySearch.style.flex = '0 0 0px';
      citySearch.style.borderColor = 'transparent';
      citySearch.style.backgroundColor = 'transparent';
      dataHelp = undefined;
      citySearch.removeEventListener('click', citySearchClick);
      cityInput.removeEventListener('input', inputText);
    }

    if (cardHelp) {
      this.textContent = dataHelp.suggestions[cardHelp.dataset.index].data.city;
      localStorage.setItem(
        'city',
        dataHelp.suggestions[cardHelp.dataset.index].data.city
      );
      localStorage.setItem(
        'latitude',
        dataHelp.suggestions[cardHelp.dataset.index].data.geo_lat
      );
      localStorage.setItem(
        'longitude',
        dataHelp.suggestions[cardHelp.dataset.index].data.geo_lon
      );
      cityInput.value = dataHelp.suggestions[cardHelp.dataset.index].value;
    }
  };

  const inputText = () => {
    const text = cityInput.value;

    if (text.length > 2) {
      requestCity(text, 3).then((data) => {
        dataHelp = data;

        Array.from(citySearch.children).forEach((element) => {
          if (element.dataset.index) {
            element.textContent = data.suggestions[element.dataset.index].value;
          }
        });
      });
      citySearch.style.height = 6 * 1.5 + 'rem';
    }
  };

  citySearch.addEventListener('click', citySearchClick);

  dayTitle.hidden = true;
  this.hidden = true;
  citySearch.style.flex = '1 1';
  citySearch.style.borderColor = 'rgba(0, 0, 0, 0.9)';
  citySearch.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';

  cityInput.addEventListener('input', inputText);
}

async function requestCity(query, count) {
  const url =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';
  const token = decoding(
    '3e2e3b30662b3a29375a3d2b3d5c675c675e362d3d29372c6a5a3831362d392f675d362b675d6b5a'
  );

  const options = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token ' + token,
    },
    body: JSON.stringify({
      query,
      count,
      locations: [
        {
          country_iso_code: '*',
        },
      ],
    }),
  };

  let response = await fetch(url, options);
  let content;

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  } else {
    content = await response.json();
  }
  return content;
}

export function decoding(text) {
  let index = 0;
  let textOut = '';
  let code;
  for (let i = 0; i < text.length; i += 2) {
    if (index % 2 === 0) {
      code = parseInt(text[i] + text[i + 1], 16) - 5;
    } else {
      code = parseInt(text[i] + text[i + 1], 16) + 7;
    }
    textOut += String.fromCodePoint(code);
    index++;
  }
  return textOut;
}
/*
function coding(text) {
  let code;
  let textOut = '';

  for (let i = 0; i < text.length; i++) {
    if (i % 2 === 0) {
      code = text.charCodeAt(i) + 5;
    } else {
      code = text.charCodeAt(i) - 7;
    }
    textOut += code.toString(16);
  }
  return textOut;
}*/
