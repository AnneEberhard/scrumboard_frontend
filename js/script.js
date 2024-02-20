let currentUser;
let currentUserId;
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
 * @param - no parameter
 */
async function loginUser() {
  let credentials = {"username": username.value, "password": password.value};
  await login('login', JSON.stringify(credentials));
}

function errorMessage() {
  username.classList.add("border-red");
  password.classList.add("border-red");
  error.style = "display: flex;";
  password.value = "";
}


function correctLogin(data){
  console.log(data);
  console.log(data.first_name);
  window.location.href = "summary.html";
  localStorage.setItem('authToken', data.token);
  localStorage.setItem(`currentUserId`, `${data.user_id}`);
  localStorage.setItem(`first_name`, `${data.first_name}`);
  localStorage.setItem(`last_name`, `${data.last_name}`);
  localStorage.setItem(`loggedIn`, true);
}



/**
 * this function allows login as guest
 * @param - no parameter
 */
function guestUser() {
  localStorage.setItem(`currentUserId`, `2`);
  localStorage.setItem(`first_name`, `Guest`);
  window.location.href = "summary.html";
  localStorage.setItem(`loggedIn`, true);
}

/**
 * this function checks if user is logged in (also as guest) and if not, returns to start page
 * @param - no parameter
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
    localStorage.setItem("username", `${username.value}`);
    localStorage.setItem(`password`, `${password.value}`);
  }
}

/**
 * this function loads data from the local storage for the remember me function
 * @param - no parameter
 */
function loadCache() {
  let username = localStorage.getItem("username");
  let password = localStorage.getItem("password");
  document.getElementById("username").value = username;
  document.getElementById("password").value = password;
}

/**
 * this function is for sending email if password is forgotten
 * @param {event} - event
 */
function sendMail(event) {
  event.preventDefault();
  const data = new FormData(event.target);
  fetch("https://formspree.io/f/xvojdaqr", {
    method: "POST",
    body: new FormData(event.target),
    headers: {
      Accept: "application/json",
    },
  })
    .then(() => {
      window.location.href = "reset.html";
    })
    .catch((error) => {
      console.log(error);
    });
}