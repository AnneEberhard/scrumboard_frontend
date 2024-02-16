//for includeHTML() and initTemplate('addTask') see script_Templates.js
//for categories see add_task_categories.js
//for overall functions of the site see add_task.js
//for backend see storage.js

/**
 * this function clears the entire template and resets to original state
 * @param - no param
 */
function clearTask() {
  clearTaskHTML();
  renderCategories();
  renderContacts('contactContainer', 'Add');
  renderPrio();
  assignedPrio = "";
  flushArrays();
}

/**
 * this function clears the HTML and classlists
 * @param - no param
 */
function clearTaskHTML() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("categoryOptions").innerHTML = "";
  document.getElementById("categoryAlert").innerHTML = "";
  document.getElementById("contactAlert").innerHTML = "";
  document.getElementById(`prioAlertAdd`).innerHTML = "";
  document.getElementById("dueDateAdd").value = "";
  document.getElementById("inputSubtaskAdd").value = "";
  document.getElementById("subTasksAdd").innerHTML = "";
  document.getElementById("urgentAdd").classList.remove("urgent");
  document.getElementById("mediumAdd").classList.remove("medium");
  document.getElementById("lowAdd").classList.remove("low");
  document.getElementById("popupNotice").classList.remove("visible");
}

/**
 * this function creates the respective JSOn tasks if all requirements are met and adds it to the array tasks
 * @param {Event} event - needed to prevent new loading of form
 */
function createTask(event) {
  event.preventDefault();
  let prioFilled = checkPrio();
  let correctCategory = checkCorrectCategory();
  let correctContact = checkCorrectContact();
  if (prioFilled == true && correctCategory == true && correctContact == true) {
    let author = getAuthorId();
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let dueDate = document.getElementById("dueDateAdd").value;
    let today = currentDate();
    let task = {
      author: author,
      created_at: today,
      title: title,
      description: description, 
      category: assignedCategory, 
      assignedContacts: assignedContacts, 
      dueDate: dueDate, 
      prio: assignedPrio,
      subtasks: subTasksIdArray,
      column: column};
    tasks.push(task);
    saveNewTask(task); 
    popUpNotice();
    flushArrays();
  }
}

function getAuthorId() {
  if(currentUser == 'Guest') {
    return 2
  } else {
    return currentUser.id
  }
}


/**
 * this function clears the subtask array
 * @param {}  - no parameter
 */
function flushArrays() {
  subTasksArray = [];
  subTasksIdArray= [];
  assignedContacts = [];
  assignedContactsStatus = new Array(contacts.length).fill(false);
}

/**
 * this function checks if a priority is assigned to task and writes an alert otherwise
 * @param {}  - no parameter
 */
function checkPrio() {
  if (
    typeof assignedPrio !== "undefined" &&
    assignedPrio !== null &&
    assignedPrio !== ""
  ) {
    return true;
  } else {
    document.getElementById(`prioAlertAdd`).innerHTML =
      "Please select a priority!";
  }
}

/**
 * this function checks if a correct category is assigned to task and writes an alert otherwise
 * @param {}  - no parameter
 */
function checkCorrectCategory() {
  let inputCategory = document.getElementById("categorySelection").value;
  const categoryExists = categories.some(
    (category) => category.name === inputCategory
  );
  if (categoryExists) {
    return true;
  } else {
    document.getElementById("categoryAlert").innerHTML =
      "Please enter a valid category or choose from the dropdown Menu";
  }
}

/**
 * this function checks if at least one contact is assigned to task and writes an alert otherwise
 * @param {}  - no parameter
 */
function checkCorrectContact() {
  if (assignedContacts.length != 0) {
    return true;
  } else {
    document.getElementById("contactAlert").innerHTML =
      "Please choose an option from the dropdown Menu";
  }
}

/**
 * this function shows popUp Notice when task is added and saved
 * @param {}  - no parameter
 */
function popUpNotice() {
  document.getElementById("popupNotice").classList.add("visible");
  setTimeout(function () {
    switchToBoard();
  }, 1000);
}

/**
 * this function refers to the site board.html
 * @param {}  - no parameter
 */
function switchToBoard() {
  window.location.href = "board.html";
}

/**
 * this function saves the JSONs tasks, savedCategories and the array savedfreeColors to the backend
 * @param {}  - no parameter
 */
async function updateTask(id) {
  let updatedTask = tasks[id];
  await updateItem("tasks", JSON.stringify(updatedTask));
  //await updateItem("subTasks", JSON.stringify(task));
  //await setItem("tasks", JSON.stringify(tasks));
  //await setItem("savedCategories", JSON.stringify(categories));
  //await setItem("savedFreeColors", JSON.stringify(freeColors));
}

/**
 * this function saves the newly created task to the backend
 * @param {}  - no parameter
 */
async function saveNewTask(task) {
  await addItem("tasks", JSON.stringify(task));
}

async function saveNewCategory (newCategory) {
  await addItem("savedCategories", JSON.stringify(newCategory));
}


function currentDate() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1;
  month = month < 10 ? '0' + month : month;
  const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

  return `${year}-${month}-${day}`;
}




//muss ersetzt werden durch delete
/**
 * this function saves only the savedCategories to the backend and is used when a category is deleted or added
 * @param {}  - no parameter
 */
async function saveOnlyCategories() {
  await setItem("savedCategories", JSON.stringify(categories));
}
