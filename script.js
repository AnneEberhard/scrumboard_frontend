let currentUser;

/**
 * this function initializes the index page
 * @param - no parameter
 */
function init() {
  loadUsers();
  loadCache();
}

/**
 * this function loads users from the backend
 * @param - no parameter
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}

/**
 * this function allows user to login if registered and password correct
 * @param - no parameter
 */
function loginUser() {
  let error = document.getElementById("error");
  loadUsers();
  if (users[0].email == email.value && users[0].password == password.value) {
    password.classList.remove("border-red");
    error.style = "display: none;";
    window.location.href = "summary.html";
    localStorage.setItem(`currentUser`, `${users[0].name}`);
    localStorage.setItem(`loggedIn`, true);
    cacheData();
  } else {
    password.classList.add("border-red");
    error.style = "display: flex;";
    password.value = "";
  }
}

/**
 * this function allows login as guest
 * @param - no parameter
 */
function guestUser() {
  localStorage.setItem(`currentUser`, `Guest`);
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
    localStorage.setItem("email", `${email.value}`);
    localStorage.setItem(`password`, `${password.value}`);
  }
}

/**
 * this function loads data from the local storage for the remember me function
 * @param - no parameter
 */
function loadCache() {
  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");
  document.getElementById("email").value = email;
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