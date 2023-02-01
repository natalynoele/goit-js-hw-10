import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const searchBox = document.getElementById('search-box');
const countriesListContainer = document.querySelector('.country-list');
const countryCardContainer = document.querySelector('.country-info');
const debouncedFetch = debounce(onSearchBoxInput, DEBOUNCE_DELAY);

searchBox.addEventListener('input', debounce(onSearchBoxInput, DEBOUNCE_DELAY));

function onSearchBoxInput({ target }) {
  const inputValue = target.value.trim();
  if (inputValue === '') {
    updateMarkup(countriesListContainer);
    updateMarkup(countryCardContainer);
    return;
  }
  fetchCountries(inputValue).then(renderMarkup).catch(onError);
}

function onError(err) {
  updateMarkup(countriesListContainer);
  updateMarkup(countryCardContainer);
  console.log(err);
  Notify.failure('Oops, there is no country with that name');
}

function updateMarkup(element, markup = '') {
  element.innerHTML = markup;
}

function renderMarkup(countries) {
  const amountOfCountries = countries.length;
  if (amountOfCountries > 10) {
    updateMarkup(countriesListContainer);
    updateMarkup(countryCardContainer);
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (amountOfCountries === 1) {
    updateMarkup(countriesListContainer);
    const markup = createCountryCard(countries[0]);
    updateMarkup(countryCardContainer, markup);
  } else if (amountOfCountries > 1 && amountOfCountries <= 10) {
    updateMarkup(countryCardContainer);
    markup = countries.reduce(
      (listMarkup, country) => listMarkup + createMarkupOfList(country),
      ''
    );
    updateMarkup(countriesListContainer, markup);
  }
}

function createMarkupOfList({ name, flags }) {
  return `
    <li class="country-item">        
        <img src=${flags.svg} class="country-flag" width="30">  
        <p class="country-item-name">${name.official}</p>      
    </li>    
    `;
}

function createCountryCard({ capital, flags, languages, population, name }) {
  const currentLanguages = Object.values(languages).join(', '); 
  return `
  <div class="country-name-wrap">
  <img src=${flags.svg} class="country-flag" width="80"> 
  <h2 class="country-name">${name.official}</h2></div>  
  <p class="country-info-detail"><b>Capital:</b> ${capital}</p>
  <p class="country-info-detail"><b>Population:</b> ${population}</p>
  <p class="country-info-detail"><b>Languages:</b> ${currentLanguages}</p>
  `;
}




