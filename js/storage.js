const STORAGE_TOKEN = "D6K8FZVPKEGWQYJC18B898KX3JSFP5EYW8XN035V";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
* function saves data to the backend
* @param {string} key - key for storage
* @param {object} value - object to store
*/
async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}


/**
* function gets data from the backend
* @param {string} key - key for storage
*/
async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
