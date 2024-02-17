let prioToEdit;


/**
 * opens a card, which shows the detailed task
 * @param {*} id index of task which was clicked
 * @param {*} category category of the clicked task
 */
function openTaskOverview(id, category) {
    let task = tasks[id];
    column = task.column;
    assignedCategory = category;
    subTasksArray = getSubTasks(task); 
    let colorCode = determineColorCategory(task['category']);
    renderEditOverviewTemplate(colorCode, task['prio'], id);
    let taskOverview = document.getElementById('editTask');
    taskOverview.classList.remove('d-none');
    renderTaskOverview(task, id);
    displayAssignedContact(task["assignedContacts"], "editTaskContainerAssignedNames");
    renderSubtasksInTaskOverview(id);
}

/**
 * render values in Overview Container
 * @param {*} task which is opened
 * @param {*} id task id
 */
function renderTaskOverview(task, id) {
    document.getElementById('editTaskContainerCategory').innerHTML = `${task['category']}`;
    document.getElementById('editTaskContainerTitle').innerHTML = `${task['title']}`;
    document.getElementById('editTaskContainerDescription').innerHTML = `${task['description']}`;
    document.getElementById('editTaskContainerDueDateDate').innerHTML = `${task['dueDate']}`;
    document.getElementById('editTaskContainerDelete').innerHTML = `<img src="assets/img/delete_bigger.png" onclick="askBeforeDelete(${task['id']})">`;
    document.getElementById('editTaskContainerPrioPrio').innerHTML = `${task['prio']} <img src="assets/img/${task['prio']}_white.png"/>`;
}

/**
 * template of the card
 * @param {*} colorCode colorCode of the category 
 * @param {*} prio prio of the task
 * @param {*} id index of the task
 */
function renderEditOverviewTemplate(colorCode, prio, id) {
    document.getElementById('editTask').innerHTML = /*html*/`
        <div id="confirmDeleteTask" class="d-none">
        </div>
        <div id="editTaskContainer" >
            <div id="editTaskContainerClose" onclick="saveBoard(${id})"><img src="assets/img/close.png" alt="">
            </div>
            <div id="editTaskContainerEditDelete">
                <div id="editTaskContainerDelete"></div>
                <div id="editTaskContainerEdit" onclick="openEditMode(${id})"><img src="assets/img/edit_white.png"></div>
            </div>
            <div id="editTaskContainerInner">
                <div id="editTaskContainerCategory" style="background-color: ${colorCode}"></div>
                <div id="editTaskContainerTitle"></div>
                <div id="editTaskContainerDescription"></div>
                <div id="editTaskContainerDueDate">
                    <div id="editTaskContainerDueDateText">Due Date:</div>
                    <div id="editTaskContainerDueDateDate"></div>
                </div>
                <div id="editTaskContainerPrio">
                    <div id="editTaskContainerPrioText">Priority:</div>
                    <div id="editTaskContainerPrioPrio"class="prio_${prio}"></div>
                </div>
                <div id="editTaskContainerAssigned">
                    <div id="editTaskContainerAssignedText">Assigned to:</div>
                    <div id="editTaskContainerAssignedNames"></div>
                </div>
                <div id=editTaskContainerSubtasks>
                <div id=editTaskContainerSubtasksText>Subtasks</div>
                <div id=editTaskContainerSubtasksTasks></div>
                </div>
            </div>
        </div>`;
    disableBackgroundScroll();
}

/**
 * renders Subtasks in Overview
 * @param {*} id index of task which was clicked
 */
async function renderSubtasksInTaskOverview(id) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML = "";
    for (let i = 0; i < subTasksArray.length; i++) {
        if (subTasksArray[i].subTaskDone == 0) {
            renderSubtasksWithoutHook(subTasksArray[i].subTaskName, id, i);
        } else {
            renderSubtasksWithHook(subTasksArray[i].subTaskName, id, i);
        }
    }
}


/**
 * render checkbox without hook
 * @param {*} subTask subtask 
 * @param {*} taskId index of task which was clicked
 */
function renderSubtasksWithoutHook(subTaskName, taskId, subTaskIndex) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
            <div class="subtaskInOverview">
                <div id="checkBoxEdit${taskId}${subTaskIndex}" class="checkBox hover" onclick="addCheck(${subTaskIndex}, ${taskId},'Edit')"></div>
                <div>${subTaskName}</div>
            </div>`
}

/**
 * render checkbox with hook
 * @param {*} subTask subtask 
 * @param {*} taskId index of task which was clicked
 */
function renderSubtasksWithHook(subTaskName, taskId, subTaskIndex) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
            <div class="subtaskInOverview">
                <div id="checkBoxEdit${taskId}${subTaskIndex}" class="checkBox hover" onclick="addCheck(${subTaskIndex},${taskId},'Edit')"><img src="assets/img/done.png"></div>
                <div>${subTaskName}</div>
            </div>`;
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
 * confirm Container if task should be deleted
 * @param {*} id index of task which was clicked 
 */
function askBeforeDelete(id) {
    let confirmDelete = document.getElementById('confirmDeleteTask');
    confirmDelete.classList.remove('d-none');
    confirmDelete.innerHTML += /*html*/`
        <div id="confirmDeleteTaskQuestion">Delete Task?</div>
        <div id="confirmDeleteTaskAnswers">
                <div id="confirmDeleteTaskAnswersYes" onclick="deleteTaskFinally(${id})">Delete</div>
                <div id="confirmDeleteTaskAnswersNo" onclick="closeDeleteRequest()">Back</div>
        </div>`;
}

/**
 * carries out final delete 
 * @param {*} id index of task which was clicked
 */
async function deleteTaskFinally(id) {
    closeDeleteRequest();
    await deleteTask(id);
    renderBoardCards();
    closeEditTask();
    flushArrays();
}

/**
 * closes the delete request container 
 * @param - no parameter
 */
function closeDeleteRequest() {
    document.getElementById('confirmDeleteTask').innerHTML = "";
    document.getElementById('confirmDeleteTask').classList.add('d-none');
}

/**
 * closes the edit task container 
 * @param - no parameter
 */
function closeEditTask() {
    enableBackgroundScroll();
    document.getElementById('editTask').classList.add('d-none');
    flushArrays();
}

/**
 * closes opens edit task container 
 * @param {*} id index of task which was clicked
 */
function openEditMode(id) {
    let task = tasks[id];
    prioToEdit = task['prio'];
    renderEditModeTemplates(task, id);
}

/**
 * render edit container 
 * @param {*} task = JSON of task to be edited
 * @param {*} id = id of task to be edited
 */
function renderEditModeTemplates(task, id) {
    let editTask = document.getElementById('editTask');
    editTask.innerHTML = "";
    editTask.innerHTML = editModeTemplate(task, id);
    let assignedContactsCard = getAssignedContacts(task);
    renderContacts('editContactContainer', 'Edit');
    renderDueDate('Edit');
    renderContactsAssignContacts(assignedContactsCard);
    displayAssignedContact(task['assignedContacts'], "EditTaskAssignedChangable");
    renderAssignedPrio(task["prio"], 'Edit');
}

/**
 * returns html code for the editTaks container
 * @param {*} task = JSON of task to be edited
 * @param {*} id = id of task to be edited
 */
function editModeTemplate(task, id) {
    let editModeTemplate = /*html*/`
    <form id="editTaskContainer" onsubmit="saveEditedBoard(${id}); return false;">
        <div id="editTaskContainerClose" onclick="closeEditTask()"><img src="assets/img/close.png" alt="">
        </div>
        <button id="editTaskContainerSave" type="submit">
            <div id="editTaskContainerSaveText">Ok</div>
            <div id="editTaskContainerSaveIcon"><img src="assets/img/done.png"></div>
        </button>
        <div id="editTaskContainerInner" class="editContainerInner" onclick="closeOptionsOnClick(event, 'Edit')">
            <div id="editTaskTitle" class="editTaskTitleFixed editTasksWidth80">
                <div id="editTaskTitleFixed">Title</div>
                <input id="editTaskTitleChangable" required class="inputsAddTask" value="${task['title']}" maxlength="30">
            </div>
            <div id="editTaskDescription" class="editTaskTitleFixed editTasksWidth80">
                <div id="editTaskDescriptionFixed">Description</div>
                <textarea id="editTaskDescriptionChangable" class="inputsAddTask" required maxlength="100">${task['description']}</textarea>
            </div>
            <div id="editTaskDueDate" class="editTaskTitleFixed editTasksWidth80">
                <div id="editTaskDueDateFixed">Due Date</div>
                    <input id="dueDateEdit" class="inputsAddTask height51 padding hover" type="date"required value="${task['dueDate']}" />
            </div> 
            <div id="editTaskPrio" class="editTaskTitleFixed editTasksWidth80">
                <div id="editTaskPrioFixed">Priority</div>
                <div id="editTaskPrioChangable"> 
                    <button id="urgentEdit" type="button" onclick="editPrio('urgent', 'Edit')" class="prio height51 hover">
                    Urgent <img src="assets/img/urgent.png" />
                    </button>
                    <button id="mediumEdit" type="button" onclick="editPrio('medium', 'Edit')" class="prio height51 hover">
                        Medium <img src="assets/img/medium.png" />
                    </button>
                    <button id="lowEdit" type="button" onclick="editPrio('low', 'Edit')" class="prio height51 hover">
                        Low <img src="assets/img/low.png" />
                    </button>
                </div>
                <div id="prioAlertEdit" class="alert"></div>
            </div>
            <div id="editTaskAssigned" class="editTaskTitleFixed">
                <div id="editTaskAssignedFix">Assigned to</div>
                <div id="editContactContainer" class="inputsAddTask editAssignment"></div>
                <div id="editContactAlert" class="alert"></div>
                <div id="EditTaskAssignedChangable"></div>
            </div>
        </div>
</form>`;
    return editModeTemplate;
}

/** 
 * this function assigns the clicked-on priority to the global variable assignedPrio or unassigns it at the 2nd click
 * @param {string} chosenPrio - id of clicked-on priority
 * @param {string} modus - modus edit
 */
function editPrio(chosenPrio, modus) {
    document.getElementById(`prioAlert${modus}`).innerHTML = '';
    if (prioToEdit === chosenPrio) {
        prioToEdit = '';
    } else {
        prioToEdit = chosenPrio;
    }
    renderAssignedPrio(chosenPrio, modus);
  }

/**
 * renders assigned contacts in edit modus
 * @param {*} assContacts = JSON of assigned contacts to task
 */
function renderContactsAssignContacts(assContacts) {
    let searchArea = document.getElementsByClassName("contactList");
    for (let c = 0; c < assContacts.length; c++) {
        const assContact = assContacts[c];
        for (let d = 0; d < searchArea.length; d++) {
            const searchElement = searchArea[d];
            searchValue = searchElement.textContent || searchElement.innerText;
            if (searchValue.indexOf(assContact.user_name) > -1) {
                classContainer = d;
                assignContact(d, 'Edit')
            }
        }
    }
}

/**
 * save edited Task, close EditMode and render board
 * @param {*} id - id of task
 */
async function saveEditedBoard(id) {
    let prioFilled = checkEditedPrio();
    let correctContact = checkCorrectContact();
    if (prioFilled == true && correctContact == true) {
        console.log(tasks);
        //await updateSubTasks();
        let title = document.getElementById("editTaskTitleChangable").value;
        let description = document.getElementById("editTaskDescriptionChangable").value;
        let dueDate = document.getElementById("dueDateEdit").value;
        let task = {
            'id': tasks[id].id,
            'author': tasks[id].author,
            'created_at': tasks[id].created_at,
            'title': title,
            'description': description,
            'category': assignedCategory,
            'assignedContacts': assignedContacts,
            'dueDate': dueDate,
            'prio': prioToEdit,
            'column': column,
            'subtasks': subTasksIdArray,
        }
        await updateEditedTask(task);
        closeEditTask();
        await renderBoardCards();
        flushArrays();
    }
}

/**
 * saves edited Task, close EditMode and render board
 * @param {*} id - id of task
 */
async function saveBoard(id) {
        await updateSubTasks();
        await updateTask(id);
        closeEditTask();
        await renderBoardCards();
        flushArrays();
}

/**
  * this function checks if a priority is assigned to task and writes an alert otherwise
*/
function checkEditedPrio() {
    if (typeof prioToEdit !== 'undefined' && prioToEdit !== null && prioToEdit !== '') {
      return true;
    } else {
     document.getElementById(`prioAlertEdit`).innerHTML ='Please select a priority!';
    }
  }