let summaryTasksInBoard = 0;
let summaryTasksInProgress = 0;
let summaryAwaitingFeedback = 0;
let summaryToDo = 0;
let summaryDone = 0;
let summaryUrgentTasks = 0;
let summaryDueDate = "3000-12-31";
let newSummaryDueDate;

/**
 * starts when summary.html is loads
 */
async function loadSummary() {
  checkLogIn();
  await loadItems();
  await countTasks();
  greetingSummary();
}

/**
 * determine amounts of tasks
 * @param {} - no parameter
 */
async function countTasks() {
  for (let t = 0; t < tasks.length; t++) {
    const task = tasks[t];
    let column = task.column;
    let urgent = task.prio;
    let date = task.dueDate;
    countBoard(column);
    countTodo(column);
    countInProgress(column);
    countAwaitingFeedback(column);
    countDone(column);
    countUrgent(urgent);
    checkDueDate(date);
  }
  await renderSummary();
}

/**
 * render the tasks and amounts determined in function above
 * @param {} - no parameter
 */
function renderSummary() {
  //to be deleted once loadTasks() works
  document.getElementById(
    "tasks_in_Board_number"
  ).innerHTML = `${summaryTasksInBoard}`;
  document.getElementById(
    "tasks_in_progress_number"
  ).innerHTML = `${summaryTasksInProgress}`;
  document.getElementById(
    "awaiting_feedback_number"
  ).innerHTML = `${summaryAwaitingFeedback}`;
  document.getElementById(
    "summary_bottom_stats_mid_left_container_number"
  ).innerHTML = `${summaryUrgentTasks}`;
  document.getElementById(
    "summary_bottom_stats_bottom_left_todo_number"
  ).innerHTML = `${summaryToDo}`;
  document.getElementById(
    "summary_bottom_stats_bottom_right_done_number"
  ).innerHTML = `${summaryDone}`;
  if (newSummaryDueDate == undefined) {
    return;
  } else {
    document.getElementById(
      "summary_bottom_stats_mid_right_date"
    ).innerHTML = `${newSummaryDueDate}`;
  }
}

/**
 * all tasks on board
 * @param {} - no parameter
 */
function countBoard() {
  summaryTasksInBoard++;
}

/**
 * determine all tasks todo
 * @param {*} column stage of an task in workflow --> column on board
 */
function countTodo(column) {
  if (column === "board_container_bottom_todo") {
    summaryToDo++;
  }
}

/**
 * determine all tasks in Progress
 * @param {*} column stage of an task in workflow --> column on board
 */
function countInProgress(column) {
  if (column === "board_container_bottom_inprogress") {
    summaryTasksInProgress++;
  }
}

/**
 * determine all tasks waiting for feedback
 * @param {*} column stage of an task in workflow --> column on board
 */
function countAwaitingFeedback(column) {
  if (column === "board_container_bottom_awaitingfeedback") {
    summaryAwaitingFeedback++;
  }
}

/**
 * determine all tasks done
 * @param {*} column stage of an task in workflow --> column on board
 */
function countDone(column) {
  if (column === "board_container_bottom_done") {
    summaryDone++;
  }
}

/**
 * determine all tasks with prio urgent
 * @param {*} prio of the task
 */
function countUrgent(prio) {
  if (prio === "urgent") {
    summaryUrgentTasks++;
  }
}

/**
 * determine the next dueDate
 * @param {*} date of the task
 */
function checkDueDate(date) {
  if (date < summaryDueDate || summaryDueDate == "undefinded") {
    formatedDate = formatDate(date);
    summaryDueDate = date;
    newSummaryDueDate = formatedDate;
  }
}

/**
 * formats the dueDate in another style
 * @param {*} inputDate stage of an task in workflow --> column on board
 */
function formatDate(inputDate) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let parts = inputDate.split("-");
  let year = parts[0];
  let month = parseInt(parts[1], 10);
  let day = parseInt(parts[2], 10);

  const formattedDate = `${months[month - 1]} ${day}, ${year}`;
  return formattedDate;
}

/**
 * create Greeting
 * @param {} - no parameter
 */
function greetingSummary() {
  createGreetingPhrase();
  createNameGreating();
  fadeGreeting();
}

/**
 * Greeting phrase depending on daytime
 * @param {} - no parameter
 */
function createGreetingPhrase() {
  let timeNow = new Date().getHours();
  let greeting;
  if (5 < timeNow && timeNow < 12) {
    greeting = "Good morning";
  } else if (12 <= timeNow && timeNow < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  document.getElementById(
    "summary_container_bottom_right_greeting"
  ).innerHTML = /*html*/ `
        ${greeting}
    `;
}

/**
 *
 * @returns Name of User or nothing when Guest is online
 * @param {} - no parameter
 */
async function createNameGreating() {
  currentUserFirstName = localStorage.getItem(`first_name`);
  if (currentUserFirstName == "Guest" || currentUserFirstName == "") {
    return;
  } else {
    document.getElementById(
      "summary_container_bottom_right_Name"
    ).innerHTML = /*html*/ `
        ${currentUserFirstName}
    `;
  }
}

/**
 * fading Greeting away if display is smaller 1200px
 * @param {} - no parameter
 */
function fadeGreeting() {
  if (window.innerWidth < 1200) {
    // Warte 2 Sekunden, bevor das Ausblenden beginnt
    setTimeout(function () {
      // Restlicher Code für die Animation, wie zuvor
      var container = document.getElementById("summary_container_bottom_right");
      var fadeDuration = 1000;
      var fadeInterval = 10;
      var opacity = 1;
      var deltaOpacity = 1 / (fadeDuration / fadeInterval);
      var fadeOut = setInterval(function () {
        opacity -= deltaOpacity;
        container.style.opacity = opacity;
        if (opacity <= 0) {
          clearInterval(fadeOut);
          container.style.display = "none";
        }
      }, fadeInterval);
    }, 1000);
  }
}

/**
 * refers to the board site
 * @param {} - no parameter
 */
function openBoard() {
  window.location.href = "board.html";
}
