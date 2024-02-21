//for all main functions that deal with the backend

const STORAGE_TOKEN = "D6K8FZVPKEGWQYJC18B898KX3JSFP5EYW8XN035V";
const STORAGE_URL = "http://127.0.0.1:8000/";


/**
 * this function initiates loading all items from the backend and saves them in global JSONarrays
 */
async function loadItems() {
  try {
    tasks = await getItem("tasks");
    allSubTasks = await getItem("subTasks");
    contacts = await getItem("contacts");
    categories = await getItem("savedCategories");
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * function gets data from the backend
 * @param {string} key - key for storage
 * @returns {json} data 
 */
async function getItem(key) {
  const authToken = getAuthToken(); 
  const url = `${STORAGE_URL}${key}`;
  return fetch(url, { headers: {
    "Authorization": `Token ${authToken}`, 
  }})
    .then((res) => res.json())
    .then((res) => {
      if (res) {
        return res;
      }
      throw `Could not find data with key "${key}".`;
    });
}


/**
 * this function uploads a new item from the backend
 * @param {string} key of the respective item class
 * @param {JSON} value JSON of new Item
 */
async function addItem(key, value) {
  const authToken = getAuthToken(); 
  const url = `${STORAGE_URL}${key}/`;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${authToken}`, 
    },
    body: value,
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * this function deletes and item from the backend
 * @param {string} key class of the item to be deleted
 * @param {integer} id backend id of the item to be deleted
 */
async function deleteItem(key, id) {
  const authToken = getAuthToken(); 
  const url = `${STORAGE_URL}${key}/${id}/`;
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${authToken}`, 
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

/**
 * this function updates an item in the backend
 * @param {string} key of the item to be updated
 * @param {JSON} updatedValue JSON of updated Item
 * @param {integer} id backend id
 */
async function updateItem(key, updatedValue, id) {
  const authToken = getAuthToken(); 
  const url = `${STORAGE_URL}${key}/${id}/`;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${authToken}`, 
    },
    body: updatedValue,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}

/**
 * this function registered user in the backend
 * @param {string} key register/
 * @param {JSON} value user data from signup form
 */
async function registerUser(key, value) {
  const url = `${STORAGE_URL}${key}/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: value,
    });
    if (!response.ok) {
      const errorText = await response.text();
      return errorText
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

/**
 * this function logins via backend and refers to functions in case of successful or unsuccessful login
 * @param {string} key login
 * @param {JSON} value credentials
 */
async function login(key, value) {

  const url = `${STORAGE_URL}${key}/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: value,
    })
    ;
    if (!response.ok) {
      const errorText = await response.text();
      errorMessage();
    } else {
      const data = await response.json();
      correctLogin(data);
    }
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}


/**
 * this function gets the auth token from local storage
 * @returns authToken
 */
function getAuthToken() {
  return localStorage.getItem('authToken');
}


/**
 * this function logs out from the backend
 */
async function logout() {
  const authToken = getAuthToken(); 
  const url = `${STORAGE_URL}logout/`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Token ${authToken}`, 
      },
    });
    if (response.ok) {
      console.log("Logout erfolgreich");
      return true;
    } else {
      console.error("Logout fehlgeschlagen");
      return false;
    }
  } catch (error) {
    console.error("Fehler beim Logout:", error);
  }
}


/**
 * this function gets the crsf token from the cookies (currently not used)
 * @return csrfToken
 */
function getCSRFToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    .split("=")[1];
    console.log('token:',cookieValue);
  return cookieValue;
}

