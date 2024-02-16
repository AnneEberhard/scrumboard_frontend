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