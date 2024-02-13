//for includeHTML() and initTemplate('addTask') see script_templates.js
//for categories see add_task_categories.js
//for saving see save_add_tasks.js
//for backend see storage.js

//these come from server and will be saved at the end
let tasks = [];
let contacts = [];
//let categories = [{name: 'New category', colorCode: 0}];
let categories = [];
let freeColors = [];

//these are needed to fill task
let assignedCategory;
let assignedContacts = [];
let assignedContactsStatus = new Array(contacts.length).fill(false);
let assignedPrio = '';
let subTasksArray = [];

//these are needed for the site to function
let prios = ['urgent', 'medium', 'low'];
let newCategoryName;
let newCategoryColor;
let inputDone = false;

//stored in local storage
let column;


/**
 * this function starts loading the page
 *
 * @param - no parameter
 */
async function initTask() {
  checkLogIn();
  await includeHTML();
  await loadItems();
  column = localStorage.getItem('column');
  renderCategories();
  renderContacts('contactContainer', 'Add');
  renderDueDate('Add');
}

/**
 * this function loads the needed items from the backend
 * @param - no parameter
 */
async function loadItems() {
  try {
    tasks = await getItem("tasks");
    console.log('tasks:', tasks);
    contacts = await getItem("contacts");
    categories = await getItem("savedCategories");
    freeColors = await getItem("savedFreeColors");
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * this function begins the rendering of the contacts
 * @param {string} idContactContainer - div id
 * @param {string} mode - mode of either add or edit
 */
function renderContacts(idContactContainer, mode) {
  document.getElementById(idContactContainer).innerHTML = templateContactSelection(mode);
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i]['user_name'];
    document.getElementById(`contactsOptions${mode}`).innerHTML += templateContactsOptions(contact, i, mode);
  }
  document.getElementById(`contactsOptions${mode}`).innerHTML += templateNewContact();
}


/**
 * this function returns the main template for contacts
 * @param {string} mode - mode of either add or edit
 */
function templateContactSelection(mode) {
  let templateContactSelection = /*html*/`
  <div class="inputWithList">
    <input id="contactSelection${mode}" class="selection" required disabled placeholder="Select contacts to assign">
    <img src="assets/img/dropdown.svg" class="hover" onclick="handleContactOptionsClick(event,'${mode}')"/>
  </div>
  <div class="hidden roundedBorder" id="contactsOptions${mode}"></div>`;
  return templateContactSelection;
}


/**
 * this function ensures the onlick-Funktion of closing the options isn't carried out
 * @param {event} - no parameter
 */
function handleContactOptionsClick(event, mode) {
  event.stopPropagation();
  toggleOptions(`contactsOptions${mode}`);
}


/**
 * this function returns the regular lines for the dropdown menu of contacts
 * @param {string} contact - the contact from the global JSON contacts
 * @param {number} i - index of the JSON contacts 
 * @param {string} mode - mode of either add or edit
 */
function templateContactsOptions(contact, i, mode) {
  let templateContactsOptions = /*html*/`
  <div class="option contactList" onclick="handlecheckContactClick(event,${i},'${mode}')">
    <div id="contact${mode}${i}">${contact}</div>
    <div class="checkBox hover" id="contactCheckBox${mode}${i}"></div>
  </div>`;
  return templateContactsOptions;
}


/**
 * this function returns the HTML code for the last line the dropdown menu of contacts to invite a new contact
 * @param - no parameter
 */
function templateNewContact() {
  let templateNewContact = /*html*/`
  <div class="option contactList">
    <div id="newContactAdd">Invite new contact</div>
    <div class="newContact roundedBorder"><img src="assets/img/Icon_Contacts_white.png" onclick="inviteContact()"></div>
  </div>`;
  return templateNewContact;
}


/**
 * this function ensures the onlick-Funktion of closing the options isn't carried out
 * @param {event} - no parameter
 * @param {number} i - index of the JSON contacts 
 * @param {string} mode - mode of either add or edit
 */
function handlecheckContactClick(event,i, mode) {
  event.stopPropagation(); 
  checkContact(i, mode);
}


/**
 * this function checks if a contact has been assigned to the task and starts assigning of unassigning
 * @param {number} i - index of the JSON contacts 
 * @param {string} mode - mode of either add or edit
 */
function checkContact(i, mode) {
  if (assignedContactsStatus[i] === true) {
    unassignContact(i, mode);
  } else {
    assignContact(i, mode);
  }
  updateAssignedContacts(mode);
}


/**
 * this function fills the box of an assigned contact and sets the i. value of assignedContactsStatus[] to true
 * @param {number} i - index of the JSON contacts 
 * @param {string} mode - mode of either add or edit
 */
function assignContact(i, mode) {
  boxId = 'contactCheckBox'+mode+i;
  document.getElementById(boxId).innerHTML = /*html*/`
    <div class="checkBoxChecked hover"></div>
  </div>`;
  assignedContactsStatus[i] = true;
}



/**
 * this function clears the box of an assigned contact and sets the i. value of assignedContactsStatus[] to false
 * @param {number} i - index of the JSON contacts 
 * @param {string} mode - mode of either add or edit
 */
function unassignContact(i, mode) {
  boxId = 'contactCheckBox'+mode+i;
  document.getElementById(boxId).innerHTML = /*html*/``;
  assignedContactsStatus[i] = false;
}


/**
 * this function adds assigned contacts to the global array assignedContacts
 * @param {string} mode - mode of either add or edit
 */
function updateAssignedContacts(mode) {
  assignedContacts = [];
  document.getElementById('contactAlert').innerHTML = '';
  for (let i = 0; i < assignedContactsStatus.length; i++) {
    const contact = contacts[i];
    const assignedStatus = assignedContactsStatus[i];
    if (assignedStatus == true) {
      assignedContacts.push(contact);
    }
  }
  displayAssignedContact(mode);
}

/**
 * this function adds the assigned contact in color circles
 * @param {string} mode - mode of either add or edit
 */
function displayAssignedContact(mode) {
  let displaySelectedContacts;
  if (mode =='Add') {
    displaySelectedContacts = document.getElementById('displaySelectedContacts');
  } else if (mode =='Edit') {
    displaySelectedContacts = document.getElementById('editTaskAssignedChangable');
  }
  displaySelectedContacts.innerHTML = '';
  for (let i = 0; i < assignedContacts.length; i++) {
    const contactAcronym = assignedContacts[i].acronym;
    const contactColor = assignedContacts[i].color;
    displaySelectedContacts.innerHTML += `<div class="circleAcronym" style="background-color: ${contactColor};">${contactAcronym}</div>`;
  }
}


/**
 * this function links to the contact page to add a new contact
 * @param - no parameter
 */
function inviteContact() {
  window.location.href = "contacts.html";
}


/**
 * this function renders the field Due Date, enabling only future dates to be selected
 * @param {string} mode - mode of either add or edit
 */
function renderDueDate(mode) {
  let currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  document.getElementById(`dueDate${mode}`).setAttribute('min', `${year}-${month}-${day}`);
}


/**
 * this function renders the priorities
 * @param - no parameter
 */
function renderPrio() {
  document.getElementById("prioContainer").innerHTML = /*html*/`
    <button id="urgentAdd" type="button" onclick="assignPrio('urgent', 'add')" class="prio height51">
      Urgent <img src="assets/img/urgent.png" />
    </button>
    <button id="mediumAdd" type="button" onclick="assignPrio('medium', 'add')" class="prio height51">
      Medium <img src="assets/img/medium.png" />
    </button>
    <button id="lowAdd" type="button" onclick="assignPrio('low', 'add')" class="prio height51">
      Low <img src="assets/img/low.png" />
    </button>`;
}


/**
 * this function assigns the clicked-on priority to the global variable assignedPrio or unassigns it at the 2nd click
 * @param {string} chosenPrio - id of clicked-on priority
 * @param {string} mode - either add or edit
 */
function assignPrio(chosenPrio, mode) {
  document.getElementById(`prioAlert${mode}`).innerHTML = '';
  if (assignedPrio === chosenPrio) {
    assignedPrio = '';
  } else {
    assignedPrio = chosenPrio;
  }
  renderAssignedPrio(chosenPrio, mode);
}


/**
 * this function either highlights or de-highlights the clicked-on priority depending on 1st or 2nd click as well as de-highlights all others
 * @param {string} chosenPrio - id of clicked-on priority
 * @param {string} mode - either add or edit
 */
function renderAssignedPrio(chosenPrio, mode) {
  for (let i = 0; i < prios.length; i++) {
    const prio = prios[i];
    priomode = prio+mode;
    const prioBox = document.getElementById(`${priomode}`);
    const capitalPrio = prio.charAt(0).toUpperCase() + prio.slice(1);
    if (prio === chosenPrio && prioBox.classList.contains(prio) === false) {
      prioBox.classList.add(`${prio}`);
      prioBox.innerHTML = `${capitalPrio} <img src="assets/img/${prio}_white.png" />`;
    }
    else {
      prioBox.classList.remove(`${prio}`);
      prioBox.innerHTML = `${capitalPrio} <img src="assets/img/${prio}.png" />`;
    }
  }
}

/**
 * this function checks if field of adding subTasks is empty or not
 * @param {number} id - id of task in edit modus, by default 0 for add task
 * @param {string} mode - mode of either add or edit
 */
function checkAddSubTask(id, mode) {
  const subTaskName = document.getElementById(`inputSubtask${mode}`).value.trim();
  
  if (subTaskName === "") {
    document.getElementById('subTaskAlertAdd').innerHTML = "Bitte einen Wert hinzufügen";
  } else {
    document.getElementById('subTaskAlertAdd').innerHTML = "";
    addSubTask(id, mode);
  }
}

/**
 * this function adds subtasks to the array and renders the added subtasks
 * @param {number} id - id of task in edit modus, by default 0 for add task
 * @param {string} mode - mode of either add or edit
 */
function addSubTask(id, mode) {
  let subTaskName = document.getElementById(`inputSubtask${mode}`).value;
  let subTaskDone = 0;
  let subTask = {
    'subTaskName': subTaskName,
    'subTaskDone': subTaskDone
  }
  subTasksArray.push(subTask);
  let index = findIndexOfItem(subTasksArray, subTask);
  document.getElementById(`subTasks${mode}`).innerHTML += /*html*/ `
    <div class="subTaskBox">
        <div id="checkBox${mode}${id}${index}" class="checkBox hover" onclick="addCheck(${index}, ${id}, '${mode}')"></div>
        <div class="subtask">${subTaskName}</div>
    </div>`;
  document.getElementById(`inputSubtask${mode}`).value = "";
}


/**
 * this function returns the index of an item in an array
 * @param {string} array - name of respective array
 * @param {string} item - name of respective item
 */
function findIndexOfItem(array, item) {
  return array.indexOf(item);
}


/**
 * this function add checksmarks to the subtaks if clicked on
 * @param {value} index - index of the subtask in the global array subTasksArray
 * @param {number} id - id of task in edit modus, by default 0 for add task
 * @param {string} mode - mode of either add or edit
 */
function addCheck(index, id, mode) {
  const checkBoxElement = document.getElementById(`checkBox${mode}${id}${index}`);
  const existingImage = checkBoxElement.querySelector('img');

  if (existingImage) {
    checkBoxElement.removeChild(existingImage);
    subTasksArray[index].subTaskDone = 0;
  } else {
    document.getElementById(`checkBox${mode}${id}${index}`).innerHTML = /*html*/ `<img src="assets/img/done.png">`;
    subTasksArray[index].subTaskDone = 1;
  }
}

