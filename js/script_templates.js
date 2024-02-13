/**
 * this function starts the page templates
 * @param - no parameter
 */
async function initTemplate(categoryName) {
  await includeHTML();
  if(window.innerWidth > 900){
    showCategory(categoryName);
  } else {
    showMobileCategory(categoryName);
  } 
  currentUser = localStorage.getItem("currentUser");
  createNameCircle();
}


/**
 * this function includes the templates for sidebar, topbar, mobile Bars & task_form
 * @param - no parameter
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}


/**
 * function will start the highlighting of the active category on sidebar
 * @param {string} categoryName - id of the current page
 */
async function showCategory(categoryName) {
  if (categoryName === "legal_notice" || categoryName === "privacy_policy") {
      document.getElementById("sidebar_categories").classList.add("d-none");
  } else if (categoryName !== "help") {
    highlightCategory(categoryName);
  }
}

/**
 * function will highlight the active category on sidebar
 * @param {string} categoryName - id of the current page
 */
async function highlightCategory(categoryName) {
  document.getElementById("sidebar_categories").classList.remove("d-none");
  let allCategories = document.getElementsByClassName("active_category");
  if (allCategories.length !== 0) {
      for (let i = 0; i < allCategories.length; i++) {
          const element = allCategories[i];
          element.classList.remove("active_category");
      }
  }
  let string = "sidebar_categories_" + categoryName;
  let addCat = document.getElementById(string);
  if (addCat !== null) {
      addCat.classList.add("active_category");
  }
}

/**
 * function will highlight the active category on the mobile bar
 * @param {string} categoryName - gives the last string-part of the ID conatainer
 */
async function showMobileCategory(categoryName) {
  let allCategories = document.getElementsByClassName("active_category");
  if (allCategories.length != 0) {
    for (let i = 0; i < allCategories.length; i++) {
      const element = allCategories[i];
      element.classList.remove("active_category");
    }
  }
  let string = "mobile_categories_" + categoryName;
  let addCat = document.getElementById(string);
  if (addCat !== null) {
  addCat.classList.add("active_category");
}
}


/**
 * function will show toggle bar when clicking on the name circle
 * @param {} - no parameter
 */
function togglePopupBar() {
  let popupBar = document.getElementById("popupBar");
  popupBar.classList.toggle("d-none");
}


/**
 * function create a namecircle with the first letters of first and last name of the User
 * @param {} - no parameter
 */
async function createNameCircle() {
  //await loadUsers();
  let acronym = createAcronym(currentUser);
  let topbar = document.getElementById("topbar_icons");
  let mobiletopbar = document.getElementById("mobile_topbar_icons");
  topbar.innerHTML += /*html*/ `
        <div id="topbar_Icons_Username" onclick="togglePopupBar()">${acronym}</div>
    `;
  mobiletopbar.innerHTML += /*html*/ `
     <div id="mobile_topbar_Icons_Username" onclick="togglePopupBar()">${acronym}</div>
 `;
}



/**
* This function logs that the user is logged out from the Website
* @param {} - no parameter
*/
function logoutUser(){
  localStorage.setItem(`loggedIn`, false);
}



/**
* function creates an acronym using the first letter of the first name and first letter of the last name, if existing
* @param {} - no parameter
*/
function createAcronym(currentUser) {
  let acronym;
  let matches = currentUser.match(/^(\w+)|(\w+)\W*$/g); //seperates first and last words of a string
  if (matches.length == 2) {
    acronym = matches[0].charAt(0) + matches[1].charAt(0); //combine first letters of this words
  } else {
    acronym = matches[0].charAt(0);
  }
  return acronym; // passes the beginning letter(s) back to createNameCircle()
}


/**
* function saves parameter for categories to local storage when adding a new task to that column
* @param {string} clickColumn - id of column in which the button was clicked
*/
function saveColumn(clickColumn) {
  column = localStorage.setItem('column', clickColumn);
}