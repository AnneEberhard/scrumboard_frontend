let users = [];
let username = document.getElementById("name");
let firstname = document.getElementById("firstname");
let lastname = document.getElementById("lastname");
let newEmail = document.getElementById("email");
let password = document.getElementById("password");
let confirmpassword = document.getElementById("confirmpassword");
let signup = document.getElementById("signup");

const form = document.getElementById("signup-form");
const button = document.querySelector(".fly-in-button");
const overlay = document.querySelector(".overlay");

/**
 * this delays the following code bei ms milliseconds
 * @param {}  - no parameter
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * when form is submitted, new registered user is added and login window is opened again
 * @param {}  - no parameter
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const userAdded = await addUser();

  if (userAdded) {
    document.body.classList.add("clicked");
    button.classList.add("clicked");
    await delay(1000);
    createContactRegister();
    window.location.href = "index.html";
  }
});

/**
 * this function adds a new user
 * @param {}  - no parameter
 */
async function addUser() {
  clearAlerts();
  if (
    validateUsername() &&
    validateEmail() &&
    validatePassword() &&
    validateConfirm()
  ) {
    let user = assembleData();
    response = await registerUser("register", JSON.stringify(user));
    if (response == '{"username":["A user with that username already exists."]}') {
      renderAlert("User already exists. Please choose a different name.", username);
      return false;
    }
    return true;
  } else {
    return false;
  }
}

/**
 * this function clears out all former alerts
 * @param {}  - no parameter
 */
function clearAlerts() {
  username.classList.remove("border-red");
  firstname.classList.remove("border-red");
  lastname.classList.remove("border-red");
  newEmail.classList.remove("border-red");
  password.classList.remove("border-red");
  confirmpassword.classList.remove("border-red");
  error.style = "display: none;";
}

/**
 * checks if username is correct
 * @returns boolean
 */
function validateUsername() {
  const usernameRegex = /^[a-zA-Z0-9@.+\-_]+$/;
  if (!usernameRegex.test(username.value)) {
    renderAlert("Please enter a valid username.", username);
  }
  return usernameRegex.test(username.value);
}

/**
 * checks if email is correct
 * @returns boolean
 */
function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmail.value)) {
    renderAlert("Please enter a valid email.", newEmail);
  }
  return emailRegex.test(newEmail.value);
}

/**
 * checks if password follows rules of at least 8 characters and not entirely numeric
 * @returns boolean
 */
function validatePassword() {
  let passwordToValidate = password.value;
  if (passwordToValidate.length < 8) {
    renderAlert("Password needs at least 8 characters.", password);
    return false;
  }
  if (!/[a-zA-Z]/.test(passwordToValidate)) {
    renderAlert("Password cannot be too common or entirely numeric.", password);
    return false;
  }
  return true;
}

/**
 * checks if confirm passwordmatches password
 * @returns boolean
 */
function validateConfirm() {
  if (password.value != confirmpassword.value) {
    renderAlert("Passwords do not match.", confirmpassword);
    return false;
  } else {
    return true;
  }
}

/**
 * renders alert
 */
function renderAlert(alert, alertedId) {
  alertedId.classList.add("border-red");
  error.style = "display: flex;";
  document.getElementById("error").innerHTML = alert;
  alertedId.value = "";
}

/**
 * this function assembles the data of a new user for backend
 * @param {}  - no parameter
 * @returns {JSON} userdata for payload
 */
function assembleData() {
  let user = {
    username: username.value,
    first_name: firstname.value,
    last_name: lastname.value,
    email: newEmail.value,
    password: password.value,
  };
  return user;
}

/**
 * resets the form
 */
function resetForm() {
  username.value = "";
  newEmail.value = "";
  confirmpassword.value = "";
  password.value = "";
  signup.disabled = false;
}


/**
 * This function creates the Contact.
 * @param {string} - id of the modal
 */
async function createContactRegister() {
  let contact_name = combineFirstAndLast();
  let acronym = createAcronym(contact_name);
  let contact = new Contact(
    contact_name,
    '000',
    newEmail.value,
    acronym.toUpperCase()
  );
  await addItem("contacts", JSON.stringify(contact));
}

function combineFirstAndLast() {
  let first_name= firstname.value;
  let last_name = lastname.value;
  return `${first_name} ${last_name}`;
}

