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
 * when form is submitted, password reset is initated
 * @param {}  - no parameter
 */
//form.addEventListener("submit", async (event) => {
//  event.preventDefault();
//  const passwordMatching = await resetPassword();
//  if (passwordMatching) {
//    document.body.classList.add("clicked");
//    button.classList.add("clicked");
//    await delay(1000);
//    form.submit();
//    window.location.href = "index.html";
//  }
//});

/**
 * this resets the password if two identical words are entered in the respective fields
 * @param {}  - no parameter
 */
async function resetPassword() {
  const uidb64 = getQueryParameter("uidb64");
  const token = getQueryParameter("token");
  console.log('new token', token);
  if (passwordsMatch()) {
    let newPassword = document.getElementById("password").value;
    let key = `reset/${uidb64}/${token}/`;
    let payload = {
      password: newPassword
    }
    resetPasswordInBackend(key, JSON.stringify(payload));
    return true;
  }
}

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

function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}
