// gerneral functions of board
// for delete see delete.js
// for subtasks see also subtask.js
// for adding see board_add.js
// for editing see board_edit.js
// for additional functions see add_task and save_add_tasks.js


/** for Drag&Drop  */
let currentDraggedElement;

/**
 * initialized rendering of board
 */
async function renderBoard() {
  await renderBoardCards();
}

/**
 * load alle data from backend, delete tasks columns and build new Cards out of loaded Datas
 */
async function renderBoardCards() {
  await loadItems();
  await deleteBoard();
  for (let i = 0; i < tasks.length; i++) {    
    createBoardCard(i);
  }
  fillEmptyColumns();
}

/**
 * delete tasks columns when refreshing Board
 */
async function deleteBoard() {
  document.getElementById("board_container_bottom_todo").innerHTML = "";
  document.getElementById("board_container_bottom_inprogress").innerHTML = "";
  document.getElementById("board_container_bottom_awaitingfeedback").innerHTML = "";
  document.getElementById("board_container_bottom_done").innerHTML = "";
}

/**
 * creates variabeles for every attribut of the task with id & functions for creating an card for this task
 * @param {*} i passes index of the task in the JSON tasks
 */
async function createBoardCard(i) {
  let task = tasks[i];
  let taskId = task['id'];
  let titleCard = task["title"];
  let descriptionCard = task["description"];
  let categoryCard = task["category"];
  let categoryColorCode = determineColorCategory(categoryCard);
  let assignedContactsIds = task["assignedContacts"];
  let prioCard = task["prio"];
  let cats = task["column"];
  let subtaskCard = getSubTasks(taskId);
  let idContainerAssignements = `board_icons_username${i}`;
  renderBoardCard(categoryCard, titleCard, descriptionCard, taskId, i, prioCard, cats, categoryColorCode);
  if (subtaskCard.length > 0) {
    createProgressbar(subtaskCard, i);
  }
  displayAssignedContact(assignedContactsIds, idContainerAssignements);
}



function getAssignedContacts(task) {
  let assignedContactsTask = [];
  for (let i = 0; i < task.assignedContacts.length; i++) {
    for (let j = 0; j < contacts.length; j++) {
      if (task.assignedContacts[i] === contacts[j].id) {
        assignedContactsTask.push(contacts[j]);
      }
    }
  }
  return assignedContactsTask;
}

/**
 * @param {} category passes category of the task
 * @returns Background color for the category
 */
function determineColorCategory(category) {
  let colorCode;
  for (let i = 0; i < categories.length; i++) {
    const compareCategory = categories[i].name;
    if (category === compareCategory) {
      colorCode = categories[i].colorCode;
    }
  }
  return colorCode;
}

/**
 * renders a taskCard
 * @param {*} attributes passes attributes of the task to create the template of this taskCard
 */
function renderBoardCard(categoryCard,titleCard,descriptionCard,taskId,ID,prioCard,cats,categoryColorCode) {
  let board_todo = document.getElementById(`${cats}`);
  if (cats) {
    board_todo.innerHTML += templateBoardTodo(categoryCard,titleCard,descriptionCard,ID,prioCard,categoryColorCode);
  } else { deleteTask(taskId) }
  if (isMobileDevice()) {
    renderMoveBtns(cats, ID);
  }
}

/**
 * create template a taskCard
 * @param {*} attributes passes attributes of the task to create the template of this taskCard
 */
function templateBoardTodo(categoryCard,titleCard,descriptionCard, ID,prioCard,categoryColorCode) {
  let templateBoardTodo = /*html*/ `
  <div id="${ID}" draggable="true" ondragstart="startDragging(${ID})" 
  onclick="openTaskOverview(${ID}, '${categoryCard}')" class="board_task_container" >
      <div id="innerContainer${ID}" class="board_task_container_inner">
          <div class="board_task_container_category" style="background-color: ${categoryColorCode}">${categoryCard}</div>
          <div class="board_task_container_title_and_description">
              <div class="board_task_container_title">${titleCard}</div>
              <div class="board_task_container_description">${descriptionCard}</div>
          </div>
          <div class="board_task_progress">
              <div class="board_task_progressbar" id="progressbar${ID}"></div>
              <div class="board_task_progress_text" id="progressbarText${ID}"></div>
          </div>
          <div class="board_task_assignments">
              <div class="board_task_working">
                  <div class="icons_container" id="board_icons_username${ID}"></div>
                  <div class="board_prio"><img src="assets/img/${prioCard}.png" /></div>
              </div>                            
          </div>
      </div>
  </div> `;
  return templateBoardTodo;
}


/**
 * stops passing on click
 * @param {*} event
 */
function stopPropagation(event) {
  event.stopPropagation();
}

/**
 * assigns task to previous category
 * @param {*} column name of current category column
 * @param {*} id index of the task
 */
function moveToLastCat(column, id) {
  if (column.id == "board_container_bottom_inprogress") {
    newColumn = "board_container_bottom_todo";
  }
  if (column.id == "board_container_bottom_awaitingfeedback") {
    newColumn = "board_container_bottom_inprogress";
  }
  if (column.id == "board_container_bottom_done") {
    newColumn = "board_container_bottom_awaitingfeedback";
  }
  changeTaskColumn(id, newColumn);
}

/**
 * assigns task to next category
 * @param {*} column name of current category column
 * @param {*} id index of the task
 */
function moveToNextCat(column, id) {
  if (column.id == "board_container_bottom_inprogress") {
    newColumn = "board_container_bottom_awaitingfeedback";
  }
  if (column.id == "board_container_bottom_todo") {
    newColumn = "board_container_bottom_inprogress";
  }
  if (column.id == "board_container_bottom_awaitingfeedback") {
    newColumn = "board_container_bottom_done";
  }
  changeTaskColumn(id, newColumn);
}

/**
 * creates progressbar for subtasks --> 138 is width of the complete progressbar
 * @param {*} subtaskCard Array with all subtasks of the task
 * @param {*} id index of the task
 */
function createProgressbar(subtaskCard, id) {
  let tasksNumber = subtaskCard.length;
  let done = countDoneSubtasks(subtaskCard);
  let percentDoneTasks = done / tasksNumber;
  let filledprogressbar = 138 * percentDoneTasks;
  renderProgressBar(filledprogressbar, id);
  renderProgressText(done, tasksNumber, id);
}

/**
 * counts progress to done
 * @param {*} subtaskCard Array with all subtasks of the task
 * @returns count
 */
function countDoneSubtasks(subtaskCard) {
  let counter = 0;
  for (let s = 0; s < subtaskCard.length; s++) {
    const sub = subtaskCard[s];
    if (sub.subTaskDone == 1) {
      counter++;
    }
  }
  return counter;
}

/**
 * creates the filled Part of the progressbar
 * @param {*} filledprogressbar fillment of the progressbar in px
 * @param {*} id index of the task
 */
function renderProgressBar(filledprogressbar, id) {
  let progresID = "progressbar" + id;
  document.getElementById(progresID).style = `width: ${filledprogressbar}px`;
}

/**
 * creates the text shich shows how many subtasks of all have been finished
 * @param {*} doneTasksNumbe number of finished subtasksr
 * @param {*} tasksNumber number of all subtasks
 * @param {*} id index of the task
 */
function renderProgressText(doneTasksNumber, tasksNumber, id) {
  let progresTextID = "progressbarText" + id;
  document.getElementById(progresTextID).innerHTML = /*html*/ `
        ${doneTasksNumber}/${tasksNumber} Done
    `;
}


/**
 * searching function, to show task who hast the searched word in title
 */
function searchTasksOnBoard() {
  let searchedTask = document.getElementById("board_input").value.toUpperCase();
  let searchingElements = document.getElementsByClassName("board_task_container_title");
  searchTask(searchedTask,searchingElements);
}

/**
 * searching function for both version
 * @param {string} searchedTask - input from the search field
 * @param {array} searchingElements - array of the task titles
 */
function searchTask(searchedTask,searchingElements) {
  for (let p = 0; p < searchingElements.length; p++) {
    let title = searchingElements[p];
    searchValue = title.textContent || title.innerText;
    if (searchValue.toUpperCase().indexOf(searchedTask) > -1) {
      searchingElements[p].parentElement.parentElement.parentElement.style.display = "flex";
    } else {
      searchingElements[p].parentElement.parentElement.parentElement.style.display = "none";
    }
  }
}

/**
 * identifies dragged element
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * allows drop in drag and drop
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * moves dragged card to target column
 * @param {string} category - name of target category
 */
async function moveTo(category) {
  let targetContainer = document.getElementById(category);
  let draggedCard = document.getElementById(currentDraggedElement);
  targetContainer.appendChild(draggedCard);
  targetContainer.style.backgroundColor = "";
  changeTaskColumn(currentDraggedElement, category);
}

/**
 * changes category of dragged card to target category and starts rendering the board
 * @param {number} taskIndex - index of dragged task card
 * @param {string} newColumn - name of target category
 */
async function changeTaskColumn(taskIndex, newColumn) {
  if (taskIndex >= 0 && taskIndex < tasks.length) {
    tasks[taskIndex].column = newColumn;
    await updateTask(tasks[taskIndex]);
    renderBoard();
  }
}

/**
 * adds highlight to target container
 * @param {event} - dragging
 */
function highlight(event) {
  event.preventDefault();
  let targetContainer = event.target;
  targetContainer.style.backgroundColor = "white";
}

/**
 * removes highlight of target container
 * @param {event} - dragging
 */
function removeHighlight(event) {
  event.preventDefault();
  let targetContainer = event.target;
  targetContainer.style.backgroundColor = "";
}

/**
 * add "NoTasks Container" to empty columns
 */
function fillEmptyColumns() {
  let columnsToCheck = [
    "board_container_bottom_todo",
    "board_container_bottom_inprogress",
    "board_container_bottom_awaitingfeedback",
    "board_container_bottom_done",
  ];
  for (let c = 0; c < columnsToCheck.length; c++) {
    const column = columnsToCheck[c];
    let isEmpty = isDivEmpty(column);
    if (isEmpty) {
      document.getElementById(column).innerHTML = /*html*/ `<div class="emptyColumnContainer">No Tasks</div>`;
    }
  }
}

/**
 * @param {*} checkedColumn
 * @returns true if div is empty or undefined is
 */
function isDivEmpty(checkedColumn) {
  let div = document.getElementById(checkedColumn);
  return !div || div.innerHTML.trim() === "";
}

