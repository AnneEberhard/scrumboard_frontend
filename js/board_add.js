// add functions of board
// for delete see delete.js
// for subtasks see also subtask.js
// for editing see board_edit.js
// for general functions see board.js
// for additional functions see add_task and save_add_tasks.js
// for backend see storage.js
// for background functions see board_background.js


/**
 * this function opens add Task container on the board
 * @param - no parameter
 */
function openAddTask(column) {
    localStorage.setItem('column', column);
    assignedContacts = [];
    if (isMobileDevice()) {
        window.location.href = "add_task.html";
    } else {
        document.getElementById('addTaskBoard').classList.remove('d-none');
        initTask();
        document.getElementById('addTaskBoardContainer').classList.add('slideIn');
    }
}

/**
 * this function closes add Task container on the board
 * @param - no parameter
 */
function closeAddTask() {
    document.getElementById('addTaskBoard').classList.add('d-none');
    document.getElementById('addTaskBoardContainer').classList.remove('slideOut');
}
