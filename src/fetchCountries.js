const ENDPOINT = 'https://restcountries.com/v3.1/name/';
const options = '?fields=name,capital,population,flags,languages';

function fetchCountries(name) {
  return fetch(`${ENDPOINT}/${name}${options}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

export { fetchCountries };
