// for all template functions including logout

/**
 * this function starts the page templates
 * @param {string} site - name of the active site
 */
async function initTemplate(site) {
  await includeHTML();
  if(window.innerWidth > 900){
    showMenu(site);
  } else {
    showMobileMenu(site);
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
 * @param {string} site - name of the active site
 */
async function showMenu(site) {
  if (site === "legal_notice" || site === "privacy_policy") {
      document.getElementById("sidebar_categories").classList.add("d-none");
  } else if (site !== "help") {
    highlightSite(site);
  }
}

/**
 * function will highlight the active category on sidebar
 * @param {string} site - name of the active site
 */
async function highlightSite(site) {
  document.getElementById("sidebar_categories").classList.remove("d-none");
  let allSites = document.getElementsByClassName("active_category");
  if (allSites.length !== 0) {
      for (let i = 0; i < allSites.length; i++) {
          const element = allSites[i];
          element.classList.remove("active_category");
      }
  }
  let string = "sidebar_categories_" + site;
  let activeSite = document.getElementById(string);
  if (activeSite !== null) {
      activeSite.classList.add("active_category");
  }
}

/**
 * function will highlight the active category on the mobile bar
 * @param {string} site - name of the active site
 */
async function showMobileMenu(site) {
  let allSites = document.getElementsByClassName("active_category");
  if (allSites.length != 0) {
    for (let i = 0; i < allSites.length; i++) {
      const element = allSites[i];
      element.classList.remove("active_category");
    }
  }
  let string = "mobile_categories_" + site;
  let activeSite = document.getElementById(string);
  if (activeSite !== null) {
    activeSite.classList.add("active_category");
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
  currentUserName = combineUserNames();
  let acronym = createAcronym(currentUserName);
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
 * function combines first and last name out of local storage to a combined name
 */
function combineUserNames() {
  let first_name = localStorage.getItem("first_name");
  if (first_name=='') {
    first_name = 'X'
  }
  let last_name = localStorage.getItem("last_name");
  return `${first_name} ${last_name}`;
}


/**
* This function initiates logout and empties cache
*/
async function logoutUser() {
 response = await logout();
 if(response) {
  console.log('logout');
  localStorage.setItem(`loggedIn`, false);
  localStorage.removeItem("authToken");
  localStorage.removeItem("currentUserId");
  localStorage.removeItem("last_name");
  localStorage.removeItem("first_name");
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
 }
}


/**
* function creates an acronym using the first letter of the first name and first letter of the last name, if existing
* @param {string} name - name used for acronym
*/
function createAcronym(name) {
  let acronym;
  let matches = name.match(/^(\w+)|(\w+)\W*$/g); //seperates first and last words of a string
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