//basic functions for login
//for backend see storage.js
//for logout see script_template.js

let currentUser;
let currentUserFirstName;

/**
 * this function initializes the index page
 * @param - no parameter
 */
function init() {
  loadCache();
}


/**
 * this function allows user to login if registered and password correct
 */
async function loginUser() {
  cacheData();
  let credentials = {"email": usermail.value, "password": password.value};
  await login('login', JSON.stringify(credentials));
}


/**
 * this function shows error message if login did not work out
 */
function errorMessage() {
  usermail.classList.add("border-red");
  password.classList.add("border-red");
  error.style = "display: flex;";
  password.value = "";
}


/**
 * after correct login, user data is stored in local storage and user forwarded to summary page
 * @param {JSON} data - json returned from backend
 */
function correctLogin(data){
  window.location.href = "summary.html";
  localStorage.setItem('authToken', data.token);
  localStorage.setItem(`currentUser`, `${data.user_id}`);
  localStorage.setItem(`first_name`, `${data.first_name}`);
  localStorage.setItem(`last_name`, `${data.last_name}`);
  localStorage.setItem(`loggedIn`, true);
}


/**
 * this function allows login as guest
 */
async function guestUser() {
  localStorage.setItem(`currentUser`, `2`);
  localStorage.setItem(`first_name`, `Guest`);
  let credentials = {"email": `guest@test.de`, "password": 'T€st1234'};
  await login('login', JSON.stringify(credentials));
  window.location.href = "summary.html";
  localStorage.setItem(`loggedIn`, true);
}

/**
 * this function checks if user is logged in (also as guest) and if not, returns to start page
 */
function checkLogIn() {
  let LogInStatus = localStorage.getItem(`loggedIn`);
  if (LogInStatus == "false") {
    alert("Please Log In to view this Page.");
    setTimeout((window.location.href = "index.html"), 2000);
  }
}

/**
 * this function stores data in local storage for the remember me function
 * @param - no parameter
 */
function cacheData() {
  let check = document.getElementById("remember");
  if (check.checked == true) {
    localStorage.setItem("usermail", `${usermail.value}`);
    //localStorage.setItem(`password`, `${password.value}`);
  }
}

/**
 * this function loads data from the local storage for the remember me function
 * @param - no parameter
 */
function loadCache() {
  let usermail = localStorage.getItem("usermail");
  //let password = localStorage.getItem("password");
  document.getElementById("usermail").value = usermail;
  //document.getElementById("password").value = password;
}

/**
 * this delays the following code bei ms milliseconds
 * @param {}  - no parameter
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}



