/**
 * @param {*} task 
 * @param {*} idContainer container to render in
 */
function renderAssignementsInTaskOverview(task, idContainer) {
    let assignedUsers = task['assignedContacts'];
    document.getElementById(`${idContainer}`).innerHTML = "";
    for (let i = 0; i < assignedUsers.length; i++) {
        const assignedUser = assignedUsers[i];
        for (let k = 0; k < contacts.length; k++) {
            const contact = contacts[k];
            renderAssignmentIconsInCard(assignedUser, contact, idContainer);
        }
    }
}

/**
 * compares if assignedUser is an user in contact List --> creates an IconCircle
 * @param {*} assignedUser 
 * @param {*} contact 
 * @param {*} idContainer 
 */
function renderAssignmentIconsInCard(assignedUser, contact, idContainer) {
    if (assignedUser.user_name === contact.user_name) {
        let newContainer = document.createElement('div');
        newContainer.classList.add('editTaskUsername');
        let newCircle = document.createElement('div');
        newCircle.classList.add('editTaskUsernameCircle');
        newCircle.style.backgroundColor = getColor(assignedUser.user_name);
        let newName = document.createElement('div');
        newName.classList.add('editTaskUsernameName');
        let un = document.getElementById(idContainer);
        newContainer.appendChild(newCircle);
        newContainer.appendChild(newName);
        newCircle.innerHTML = assignedUser.acronym;
        newName.innerHTML = assignedUser.user_name;
        un.appendChild(newContainer);
    }
}



/**
 * @param {*} assignedUser User who is working on the task
 * @returns color of the user in contact list
 */
function getColor(assignedUser) {
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (contact.user_name === assignedUser) {
        return contact.color;
      }
    }
  }

  /**
 * Subtask Input and Add Button in Overview
 * @param {*} id index of task which was clicked
 */
function renderAddSubtasksInOverview(id) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
        <div class="subtaskEdit">
            <input id="inputSubtaskEdit" class="inputSubtask" placeholder="Add new subtask" />
            <div class="buttonAddSubTask hover" onclick="addSubTask(${id}, 'Edit')">
                <img src="assets/img/plus.png" />
            </div>
        </div>`
}


  
/**
 * this function loads the JSON tasks from the backend
 * @param {} - no parameter
 */
async function loadToDelete() {
    try {
    tasks = JSON.parse(await getItem("tasks")); 
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.error("Loading error:", e);
  }
  }

  
/**
 * this function renders the field for adding subtasks
 * @param {*} id index of task which was clicked
 */
async function addSubTaskEdit(id) {
    let subTaskName = document.getElementById("inputSubtaskEdit").value;
    let subTaskDone = 0;
    let subTask = {
        'subTaskName': subTaskName,
        'subTaskDone': subTaskDone
    }
    subTasksArray.push(subTask);
    renderSubtasksInTaskOverview(id);
    await updateTask(id);
    renderBoard();
    document.getElementById("inputSubtaskEdit").value = "";
}


/**
 * closes the delete request container 
 * @param - no parameter
 */
function closeDeleteRequest() {
    document.getElementById('confirmDeleteTask').innerHTML = "";
    document.getElementById('confirmDeleteTask').classList.add('d-none');
}



//muss ersetzt werden durch delete
/**
 * this function saves only the savedCategories to the backend and is used when a category is deleted or added
 * @param {}  - no parameter
 */
async function saveOnlyCategories() {
    await setItem("savedCategories", JSON.stringify(categories));
  }
  

  
/**
 * this function updates 
 * @param {id}  - backend Id of task
 */
async function updateTask(i, taskId) {
    let updatedTask = tasks[i];
    await updateItem("tasks", JSON.stringify(updatedTask), taskId);
  }

  
  async function getSubTaskId(subTask) {
    allSubTasks = await getItem("subTasks");
    for (let i = 0; i< allSubTasks.length; i++) {
      if (allSubTasks[i].subTaskName == subTask.subTaskName) {
        subTasksIdArray.push(allSubTasks[i].id);
      }
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