const form = document.getElementById("forgot-form");
const button = document.querySelector(".fly-in-button");
const overlay = document.querySelector(".overlay");


/**
 * this function starts reset code
 * @param {}  - no parameter
 */
async function resetPassword() {
  const uidb64 = getQueryParameter("uidb64");
  const token = getQueryParameter("token");
  console.log('new token', token);
  if (passwordsMatch()) {
    let newPassword = document.getElementById("password").value;
    let key = `reset/${uidb64}/${token}`;
    let payload = {
      password: newPassword
    }
    resetPasswordInBackend(key, JSON.stringify(payload));
    return true;
  }
}

/**
 * this function checks if the two entered passwords in the input field match
 * @param {}  - no parameter
 */
function passwordsMatch() {
  let password = document.getElementById("password");
  let confirmedPass = document.getElementById("confirmpassword");
  let error = document.getElementById("error");
  if (confirmedPass.value == password.value) {
    confirmedPass.classList.remove("border-red");
    error.style = "display:none;";
    return true;
  } else {
    confirmedPass.classList.add("border-red");
    confirmedPass.value = "";
    error.style = "display:flex;";
    return false;
  }
}


/**
 * this function gets the query parameters from the unique link
 * @param {string} name -identifier for uidb64 and token
 * @returns token or uidb64 from unique link
 */
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}


/**
 * this delays the following code bei ms milliseconds
 * @param {}  - no parameter
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
