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
 * this function adds subtask ids to the array and renders the added subtasks
 * @param {number} id - id of task in edit modus, by default 0 for add task
 * @param {string} mode - mode of either add or edit
 */
async function addSubTask(id, mode) {
    let subTaskName = document.getElementById(`inputSubtask${mode}`).value;
    let subTaskDone = 0;
    let subTask = {
      'subTaskName': subTaskName,
      'subTaskDone': subTaskDone,
      'taskId': id
    };
    subTasksArray.push(subTask);
    let subTaskId = findIndexOfItem(subTasksArray, subTask);
    renderAddedSubTask(mode, id, subTaskName, subTaskId);
  }
  

  async function saveNewSubTasks() {
    for (let i = 0; i < subTasksArray.length; i++) {
        const subTask = subTasksArray[i];
        await addItem('subTasks', JSON.stringify(subTask));
        await getSubTaskId(subTask);
    }
  }
  
  
  async function updateSubTasks() {
    for (let i = 0; i < subTasksArray.length; i++) {
        const subTask = subTasksArray[i];
        let id = subTask.id;
        await updateItem('subTasks', JSON.stringify(subTask), id);
        await getSubTaskId(subTask);
    }
  }
  

  async function getSubTaskId(subTask) {
    allSubTasks = await getItem("subTasks");
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskName == subTask.subTaskName) {
        subTasksIdArray.push(allSubTasks[i].id);
      }
    }
  }
  
  function renderAddedSubTask(mode, id, subTaskName, subTaskId) {
    document.getElementById(`subTasks${mode}`).innerHTML += /*html*/ `
      <div class="subTaskBox">
          <div id="checkBox${mode}${id}${subTaskId}" class="checkBox hover" onclick="addCheck(${subTaskId}, ${id}, '${mode}')"></div>
          <div class="subtask">${subTaskName}</div>
      </div>`;
    document.getElementById(`inputSubtask${mode}`).value = "";
  }

  
/**
 * this function add checksmarks to the subtasks if clicked on
 * @param {value} subTaskId backend id of subTask
 * @param {number} id - id of task in edit modus, by default 0 for add task
 * @param {string} mode - mode of either add or edit
 */
async function addCheck(subTaskId, id, mode) {
    console.log(subTaskId);
    console.log(subTasksArray);
    const checkBoxElement = document.getElementById(`checkBox${mode}${id}${subTaskId}`);
    const existingImage = checkBoxElement.querySelector('img');
    if (existingImage) {
      checkBoxElement.removeChild(existingImage);
      subTasksArray[subTaskId].subTaskDone = 0;
    } else {
      document.getElementById(`checkBox${mode}${id}${subTaskId}`).innerHTML = /*html*/ `<img src="assets/img/done.png">`;
      subTasksArray[subTaskId].subTaskDone = 1;
    }
  }
  
  


  function getAllSubTaskIndex(subTaskId) {
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskId == subTaskId) {
        return i;
      }
    }
  }
  
  
  function getSubTaskbyId(subTaskId) {
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskId == subTaskId) {
        return allSubTasks[i];
      }
    }
  }

