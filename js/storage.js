const STORAGE_TOKEN = "D6K8FZVPKEGWQYJC18B898KX3JSFP5EYW8XN035V";
const STORAGE_URL = "http://127.0.0.1:8000/";


/**
 * this function loads the needed items from the backend
 * @param - no parameter
 */
async function loadItems() {
  try {
    tasks = await getItem("tasks");
    console.log(tasks);
    allSubTasks = await getItem("subTasks");
    contacts = await getItem("contacts");
    categories = await getItem("savedCategories");
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * function saves data to the backend
 * @param {string} key - key for storage
 * @param {object} value - object to store
 */
async function setItem(key, value) {
  const url = `${STORAGE_URL}${key}/`;
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
  return fetch(url, { mode: "cors" })
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        return res;
      }
      throw `Could not find data with key "${key}".`;
    });
}

function getCSRFToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    .split("=")[1];

  return cookieValue;
}

async function addItem(key, value) {
  const csrftoken = getCSRFToken();
  const url = `${STORAGE_URL}${key}/`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: value,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function deleteItem(key, id) {
  const csrftoken = getCSRFToken();
  const url = `${STORAGE_URL}${key}/${id}/`;
  console.log(url);
  console.log(id);
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    }
  })
    .then((res) => {
      if (res.ok) {
        console.log("Item successfully deleted");
      } else {
        console.error("Failed to delete task");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


async function updateItem(key, updatedValue) {
  const csrftoken = getCSRFToken();
  const url = `${STORAGE_URL}${key}/`;
  console.log('to update:',updatedValue);
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: updatedValue,
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
}
