let prioToEdit;


/**
 * opens a card, which shows the detailed task
 * @param {*} i index of task which was clicked
 * @param {*} category category of the clicked task
 */
function openTaskOverview(i, category) {
    let task = tasks[i];
    column = task.column;
    assignedCategory = category;
    subTasksArray = getSubTasks(task.id); 
    let colorCode = determineColorCategory(task['category']);
    renderEditOverviewTemplate(colorCode, task['prio'], task['id'], i);
    let taskOverview = document.getElementById('editTask');
    taskOverview.classList.remove('d-none');
    renderTaskOverview(task);
    displayAssignedContact(task["assignedContacts"], "editTaskContainerAssignedNames");
    renderSubtasksInTaskOverview(task['id']);
}

/**
 * render values in Overview Container
 * @param {*} task which is opened
 */
function renderTaskOverview(task) {
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
 * @param {*} taskId backend id of the task
 * @param {*} i index of the task ins tasks array
 */
function renderEditOverviewTemplate(colorCode, prio, taskId, i) {
    document.getElementById('editTask').innerHTML = /*html*/`
        <div id="confirmDeleteTask" class="d-none">
        </div>
        <div id="editTaskContainer" >
            <div id="editTaskContainerClose" onclick="saveBoard(${taskId},${i})"><img src="assets/img/close.png" alt="">
            </div>
            <div id="editTaskContainerEditDelete">
                <div id="editTaskContainerDelete"></div>
                <div id="editTaskContainerEdit" onclick="openEditMode(${i})"><img src="assets/img/edit_white.png"></div>
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
 * @param {*} id backend id of task which was clicked
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
 * @param {*} taskIndex index of task which was clicked
 */
function renderSubtasksWithoutHook(subTaskName, taskIndex, subTaskIndex) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
            <div class="subtaskInOverview">
                <div id="checkBoxEdit${taskIndex}${subTaskIndex}" class="checkBox hover" onclick="addCheck(${subTaskIndex}, ${taskIndex},'Edit')"></div>
                <div>${subTaskName}</div>
            </div>`
}

/**
 * render checkbox with hook
 * @param {*} subTask subtask 
 * @param {*} taskIndex index of task which was clicked in JSON tasks
 */
function renderSubtasksWithHook(subTaskName, taskIndex, subTaskIndex) {
    document.getElementById('editTaskContainerSubtasksTasks').innerHTML += /*html*/`
            <div class="subtaskInOverview">
                <div id="checkBoxEdit${taskIndex}${subTaskIndex}" class="checkBox hover" onclick="addCheck(${subTaskIndex},${taskIndex},'Edit')"><img src="assets/img/done.png"></div>
                <div>${subTaskName}</div>
            </div>`;
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
 * @param {*} i index of task which was clicked in JSON tasks
 * @param {*} taskId id of task in backend
 */
function openEditMode(i) {
    let task = tasks[i];
    prioToEdit = task['prio'];
    renderEditModeTemplates(task, i);
}

/**
 * render edit container 
 * @param {*} task = JSON of task to be edited
 * @param {*} i = index of task to be edited in JSON tasks
 */
function renderEditModeTemplates(task, i) {
    let editTask = document.getElementById('editTask');
    editTask.innerHTML = "";
    editTask.innerHTML = editModeTemplate(task, i);
    assignedContacts = getAssignedContacts(task);
    renderContacts('editContactContainer', 'Edit');
    renderDueDate('Edit');
    renderContactsAssignContacts(assignedContacts);
    displayAssignedContact(task['assignedContacts'], "EditTaskAssignedChangable");
    renderAssignedPrio(task["prio"], 'Edit');
}

/**
 * returns html code for the editTaks container
 * @param {*} task = JSON of task to be edited
 * @param {*} i = index of task to be edited in JSON tasks
 */
function editModeTemplate(task, i) {
    let editModeTemplate = /*html*/`
    <form id="editTaskContainer" onsubmit="saveEditedBoard(${i}); return false;">
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
                <div id="contactAlert" class="alert"></div>
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
 * @param {*} i - index of task in array tasks
 */
async function saveEditedBoard(i) {
    let prioFilled = checkEditedPrio();
    let correctContact = checkCorrectContact();
    if (prioFilled == true && correctContact == true) {
        console.log(tasks);
        //await updateSubTasks();
        let title = document.getElementById("editTaskTitleChangable").value;
        let description = document.getElementById("editTaskDescriptionChangable").value;
        let dueDate = document.getElementById("dueDateEdit").value;
        let task = {
            'id': tasks[i].id,
            'author': tasks[i].author,
            'created_at': tasks[i].created_at,
            'title': title,
            'description': description,
            'category': assignedCategory,
            'assignedContacts': assignedContacts,
            'dueDate': dueDate,
            'prio': prioToEdit,
            'column': column,
            'subtasks': subTasksIdArray,
        }
        await updateTask(task);
        await updateSubTasks();
        closeEditTask();
        await renderBoardCards();
        flushArrays();
    }
}

/**
 * saves edited Task, close EditMode and render board
 * @param {*} id - backend id of task
 */
async function saveBoard(id) {
        await updateSubTasks();
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