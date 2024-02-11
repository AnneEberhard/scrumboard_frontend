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
