// for all functions that deal directly with backend see storage.js

const form = document.getElementById("forgot-form");
const button = document.querySelector(".fly-in-button");
const overlay = document.querySelector(".overlay");




/**
 * when form is submitted, starts code for sending mail for resetting password
 * @param {} - no parameter
 */
async function checkMail() {
  let email = document.getElementById("email");
  let payload = {email: email.value};
  response = await checkExistInBackend('forgot', JSON.stringify(payload));

  if(response.exists) {
    email.classList.remove("border-red");
    error.style = "display:none;";
    document.body.classList.add("clicked");
    button.classList.add("clicked");
    await delay(1000);
    window.location.href = "index.html";
  } else {
    email.classList.add("border-red");
    email.value = "";
    error.style = "display:flex;";
  }
}


