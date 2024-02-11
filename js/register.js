let users = [];
let username = document.getElementById("name");
let email = document.getElementById("email");
let confirm = document.getElementById("confirmpassword");
let password = document.getElementById("password");
let signup = document.getElementById("signup");

const form = document.getElementById("forgot-form");
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
  const passwordMatching = await addUser();
  if (passwordMatching) {
    document.body.classList.add("clicked");
    button.classList.add("clicked");
    await delay(1000);
    form.submit();
    window.location.href = "index.html";
  }
});

/** 
 * this function adds a new user
 * @param {}  - no parameter
 */
async function addUser() {
  confirm.classList.remove("border-red");
  error.style = "display: none;";
  if (
    username.value.length >= 1 &&
    email.value.length >= 1 &&
    password.value.length >= 1 &&
    password.value == confirm.value
  ) {
    users.push({
      name: username.value,
      email: email.value,
      password: password.value,
    });
    await setItem("users", JSON.stringify(users));
    resetForm();
    return true;
  } else {
    confirm.classList.add("border-red");
    error.style = "display: flex;";
    confirm.value = "";
    return false;
  }
}

/**
 * resets the form
 * @param {}  - no parameter
 */
function resetForm() {
  username.value = "";
  email.value = "";
  confirm.value = "";
  password.value = "";
  signup.disabled = false;
}
