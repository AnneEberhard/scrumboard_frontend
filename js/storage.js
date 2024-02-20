//for all main functions that deal with the backend

const STORAGE_TOKEN = "D6K8FZVPKEGWQYJC18B898KX3JSFP5EYW8XN035V";
const STORAGE_URL = "http://127.0.0.1:8000/";


/**
 * this function initiates loading all items from the backend
 * @param - no parameter
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
    console.log('token:',cookieValue);
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


async function updateItem(key, updatedValue, id) {
  const csrftoken = getCSRFToken();
  const url = `${STORAGE_URL}${key}/${id}/`;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrftoken,
    },
    body: updatedValue,
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}


async function registerUser(key, value) {
  const csrftoken = getCSRFToken();
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


async function login(key, value) {
  const csrftoken = getCSRFToken();
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
     console.log(errorText);
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

function getAuthToken() {
  return localStorage.getItem('authToken');
}



/**
 * Function loads data from the backend for a specific user with user_id
 */
async function getCurrentUser() {
  const authToken = getAuthToken();  
  const url = `${STORAGE_URL}users/me/`;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${authToken}`, 
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch((error) => {
      console.error("Error:", error.message);
      throw error;
    });
}


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




