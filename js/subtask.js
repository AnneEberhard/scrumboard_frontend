/**
 * this function gets the subtasks based on the task id into a help JSON subTaskCard
 * @param {number} taskId - id of task in edit modus, by default 0 for add task
 */
function getSubTasks(taskId) {
  let subTaskCard = [];
    for (let j = 0; j < allSubTasks.length; j++) {
      if (taskId === allSubTasks[j].taskId) {
        subTaskCard.push(allSubTasks[j]);
      }
  }
  return subTaskCard;
}


/**
 * this function checks if field of adding subTasks is empty or not
 * @param {number} index - by default 0 for add task (not yet used in edit task)
 * @param {string} mode - mode of either add or edit
 */
function checkAddSubTask(index, mode) {
    const subTaskName = document.getElementById(`inputSubtask${mode}`).value.trim();
    
    if (subTaskName === "") {
      document.getElementById('subTaskAlertAdd').innerHTML = "Bitte einen Wert hinzufügen";
    } else {
      document.getElementById('subTaskAlertAdd').innerHTML = "";
      addSubTask(index, mode);
    }
  }

  
/**
 * this function adds subtask to the help JSON subTaskArray and renders the added subtasks
 * @param {number} index - by default 0 for add task (not yet used in edit task)
 * @param {string} mode - mode of either add or edit
 */
async function addSubTask(index, mode) {
    let subTaskName = document.getElementById(`inputSubtask${mode}`).value;
    let subTaskDone = 0;
    let subTask = {
      'subTaskName': subTaskName,
      'subTaskDone': subTaskDone,
      'taskId': 0
    };
    subTasksArray.push(subTask);
    let subTaskId = findIndexOfItem(subTasksArray, subTask);
    renderAddedSubTask(mode, index, subTaskName, subTaskId);
  }
  
  
  /**
 * this function saves the new SubTasks of a task to the backend, including the reference to the task
 * @param {number} taskId - backend id of task
 */
  async function saveNewSubTasks(taskId) {
    for (let i = 0; i < subTasksArray.length; i++) {
        subTasksArray[i].taskId = taskId;
        const subTask = subTasksArray[i];
        await addItem('subTasks', JSON.stringify(subTask));
    }
  }
  
  
  /**
 * this function updates subtasks of a task to the backend, using the global JSON subTaskArray
 * @param {} - no param
 */
  async function updateSubTasks() {
    for (let i = 0; i < subTasksArray.length; i++) {
        const subTask = subTasksArray[i];
        let id = subTask.id;
        await updateItem('subTasks', JSON.stringify(subTask), id);
    }
  }
  
  
  /**
 * this function renders the added subtask including the checkbox
 * @param {string} mode - mode of either add or edit
 * @param {number} taskId - backend id of task in edit modus, by default 0 for add task
 * @param {string} subTaskName - name of subtask
 * @param {number} subTaskIndex index of subTask in JSON subTasks
 */
  function renderAddedSubTask(mode, taskId, subTaskName, subTaskIndex) {
    document.getElementById(`subTasks${mode}`).innerHTML += /*html*/ `
      <div class="subTaskBox">
          <div id="checkBox${mode}${taskId}${subTaskIndex}" class="checkBox hover" onclick="addCheck(${subTaskIndex}, ${taskId}, '${mode}')"></div>
          <div class="subtask">${subTaskName}</div>
      </div>`;
    document.getElementById(`inputSubtask${mode}`).value = "";
  }

  
/**
 * this function add checksmarks to the subtasks if clicked on
 * @param {number} subTaskIndex index of subTask in JSON subTasks
 * @param {number} id - backend id of task in edit modus, by default 0 for add task
 * @param {string} mode - mode of either add or edit
 */
async function addCheck(subTaskIndex, id, mode) {
    const checkBoxElement = document.getElementById(`checkBox${mode}${id}${subTaskIndex}`);
    const existingImage = checkBoxElement.querySelector('img');
    if (existingImage) {
      checkBoxElement.removeChild(existingImage);
      subTasksArray[subTaskIndex].subTaskDone = 0;
    } else {
      document.getElementById(`checkBox${mode}${id}${subTaskIndex}`).innerHTML = /*html*/ `<img src="assets/img/done.png">`;
      subTasksArray[subTaskIndex].subTaskDone = 1;
    }
  }
  

