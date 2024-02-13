const STORAGE_TOKEN = "D6K8FZVPKEGWQYJC18B898KX3JSFP5EYW8XN035V";
const STORAGE_URL = "http://127.0.0.1:8000/";


/**
* function saves data to the backend
* @param {string} key - key for storage
* @param {object} value - object to store
*/
async function setItem(key, value) {
  const url = `${STORAGE_URL}${key}`;
  const payload = { key, value };
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}


/**
* function gets data from the backend
* @param {string} key - key for storage
*/
async function getItem(key) {
  const url = `${STORAGE_URL}${key}`;
  return fetch(url, { mode: 'cors' })
    .then((res) => res.json())
    .then((res) => {
      console.log(key,':',res);
      if (res) {
        return res;
      }
      throw `Could not find data with key "${key}".`;
    });
}

