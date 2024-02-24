const form = document.getElementById("forgot-form");
const button = document.querySelector(".fly-in-button");
const overlay = document.querySelector(".overlay");

/**
 * this delays the following code bei ms milliseconds
 * @param {} - no parameter
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}




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
    //sendMail(email.value);
    await delay(1000);
    window.location.href = "index.html";
  } else {
    email.classList.add("border-red");
    email.value = "";
    error.style = "display:flex;";
  }
}


async function sendMail(emailadress) {
  data = {email: emailadress, 
    info: 'needs password reset'};
  email.classList.remove("border-red");
  error.style = "display:none;";
  try {
    const response = await fetch("https://formspree.io/f/xoqobgbr", {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok) {
        alert('Message was sent');
        document.body.classList.add("clicked");
        button.classList.add("clicked");
        await delay(1000);
    } else {
      email.classList.add("border-red");
      email.value = "";
      error.style = "display:flex;";
    }
} catch (error) {
    console.error('Error:', error);
  }
}

